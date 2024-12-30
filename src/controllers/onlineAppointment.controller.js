require("dotenv").config();
const axios = require("axios");
const ZoomMeeting = require("../models/onlineAppointment.model");
const moment = require("moment-timezone"); // Import moment-timezone
const sendMail = require("../utils/changePassmail");

// Function to get Zoom OAuth access token
async function getZoomAccessToken() {
  const authString = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  ).toString("base64");

  try {
    const response = await axios.post(
      "https://zoom.us/oauth/token",
      "grant_type=account_credentials&account_id=" +
        process.env.ZOOM_ACCOUNT_ID,
      {
        headers: {
          Authorization: `Basic ${authString}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error fetching Zoom access token:",
      error.response?.data || error
    );
    throw new Error("Failed to fetch Zoom access token");
  }
}

// Controller to create a Zoom meeting
const createMeeting = async (req, res) => {
  const {
    userId,
    doctorId,
    doctorFirstName,
    doctorLastName,
    doctorCategory,
    doctorEmail,
    patientName,
    patientEmail,
    patientConsult,
    patientPhone,
    patientGender,
    patientAge,
    payment,
  } = req.body;

  try {
    // Ensure valid inputs
    if (
      !userId ||
      !doctorId ||
      !patientName ||
      !patientEmail ||
      !patientPhone
    ) {
      console.error("Invalid input - Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Get Zoom access token
    const accessToken = await getZoomAccessToken();

    // Call Zoom API to create a meeting
    const zoomResponse = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: `Consultation with ${doctorFirstName}`,
        type: 2, // Scheduled meeting
        duration: 30,
        password: "123456",
        timezone: "Asia/Kolkata", // This indicates to Zoom the timezone for display purposes
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true,
          approval_type: 2,
          authentication_option: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Save meeting details in MongoDB
    const meetingData = new ZoomMeeting({
      userId,
      doctorId,
      joinUrl: zoomResponse.data.join_url,
      password: zoomResponse.data.password,
      doctorFirstName,
      doctorLastName,
      doctorCategory,
      doctorEmail,
      patientName,
      patientEmail,
      patientConsult,
      patientPhone,
      patientGender,
      patientAge,
      payment,
    });

    await meetingData.save();
    await sendMail({
      to: patientEmail,
      subject: "Your Zoom Meeting Details",
      html: `
        <p>Dear ${patientName},</p>
        <p>Your consultation meeting is scheduled as follows:</p>
        <ul>
          <li><strong>Doctor Name:</strong> ${`${doctorFirstName} ${doctorLastName}`}</li>
          <li><strong>Category:</strong> ${doctorCategory}</li>
        </ul>
        <p>Join the meeting using the following details:</p>
        <p><strong>Meeting Link:</strong> <a href="${zoomResponse.data.join_url}">${zoomResponse.data.join_url}</a></p>
        <p><strong>Meeting Password:</strong> ${zoomResponse.data.password}</p>
        <p>Best regards,<br/>Your Team</p>
      `,
    });
    await sendMail({
      to: doctorEmail,
      subject: "Your Zoom Meeting Details",
      html: `
        <p>Dear ${doctorFirstName},</p>
        <p>Your consultation meeting is scheduled as follows:</p>
        <ul>
          <li><strong>Patient Name:</strong> ${patientName}</li>
          <li><strong>Category:</strong> ${patientConsult}</li>
        </ul>
        <p>Join the meeting using the following details:</p>
        <p><strong>Meeting Link:</strong> <a href="${zoomResponse.data.join_url}">${zoomResponse.data.join_url}</a></p>
        <p><strong>Meeting Password:</strong> ${zoomResponse.data.password}</p>
        <p>Best regards,<br/>Your Team</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Meeting created successfully check your email for meeting details",
      data: meetingData,
    });
  } catch (error) {
    console.error(
      "Error creating Zoom meeting:",
      error.response?.data || error
    );
    res.status(500).json({
      success: false,
      message: "Error creating meeting",
    });
  }
};


////get on check online appointment
const getOnlineAppoint =  async (req, res) => {
  const userId = req.query.userId; 
  console.log(userId);
  try {
    const appointments = await ZoomMeeting.find({ userId: userId });
    if (!appointments||appointments.length===0) {
      return res
        .status(404)
        .json({ message: "No Appointment found for this user." });
    }
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAppointment = async (req, res) => {
  try {
    const appointment = await ZoomMeeting.find()
      .sort({ createdAt: -1 })
      .limit(25);
    if (appointment <= 0) {
      return res
        .status(404)
        .json({ success: false, message: "No appointments found" });
    }

    res.status(200).json(appointment)
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

const getAppointmentsByDoctor = async (req, res) => {
  // const { doctorId } = req.params;
  const adminData = req.adminAuthData

  try {
    const appointments = await ZoomMeeting.find({ doctorId:adminData._id }).sort({
      createdAt: -1,
    });

    if (!appointments.length) {
      return res.status(404).json({
        success: false,
        message: "No appointments found for this doctor",
      });
    }

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch appointments" });
  }
};




module.exports = {
  createMeeting,
  getOnlineAppoint,
  getAllAppointment,
  getAppointmentsByDoctor,

};
