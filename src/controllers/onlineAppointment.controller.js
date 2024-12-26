// const axios = require('axios');
// const nodemailer = require('nodemailer');
// const ZoomMeeting = require('../models/zoomMeeting.model');

// // Zoom JWT credentials
// const ZOOM_API_KEY = 'your_zoom_api_key';
// const ZOOM_API_SECRET = 'your_zoom_api_secret';

// // Helper function to generate JWT
// const generateZoomToken = () => {
//   const jwt = require('jsonwebtoken');
//   const payload = {
//     iss: ZOOM_API_KEY,
//     exp: Math.floor(Date.now() / 1000) + 60 * 60,
//   };
//   return jwt.sign(payload, ZOOM_API_SECRET);
// };

// // Create Zoom Meeting
// const createZoomMeeting = async (req, res) => {
//   const { userId, doctorId, userEmail, doctorName, date, slot } = req.body;

//   try {
//     const token = generateZoomToken();

//     // Combine date and slot to create start_time
//     const startTime = new Date(`${date}T${slot}`).toISOString();

//     const meetingOptions = {
//       topic: `Consultation with ${doctorName}`,
//       type: 2,
//       start_time: startTime, // Use the combined date and slot
//       duration: 30, // Meeting duration in minutes
//       timezone: 'Asia/Kolkata',
//       password: '12345',
//     };

//     // Zoom API request
//     const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', meetingOptions, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     const meetingData = response.data;

//     // Save meeting details to DB
//     const newMeeting = new ZoomMeeting({
//       userId,
//       doctorId,
//       meetingId: meetingData.id,
//       meetingLink: meetingData.join_url,
//       meetingPassword: meetingData.password,
//       date,
//       slot, // Save the slot for reference
//       startTime, // Save the combined start time
//     });

//     await newMeeting.save();

//     // Send email to user
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: 'your_email@gmail.com',
//         pass: 'your_email_password',
//       },
//     });

//     const mailOptions = {
//       from: 'your_email@gmail.com',
//   to: userEmail,
//   subject: 'Your Zoom Meeting Details',
//   html: `
//     <p>Dear User,</p>
//     <p>Your consultation meeting is scheduled as follows:</p>
//     <ul>
//       <li><strong>Date:</strong> ${date}</li>
//       <li><strong>Time:</strong> ${slot}</li>
//     </ul>
//     <p>Join the meeting using the following details:</p>
//     <p><strong>Meeting Link:</strong> <a href="${meetingData.join_url}">${meetingData.join_url}</a></p>
//     <p><strong>Meeting Password:</strong> ${meetingData.password}</p>
//     <p>Best regards,<br/>Your Team</p>
//   `,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({
//       success: true,
//       message: 'Zoom meeting created and email sent successfully.',
//       meetingData: newMeeting,
//     });
//   } catch (error) {
//     console.error('Error creating Zoom meeting:', error);
//     res.status(500).json({ success: false, message: 'Failed to create Zoom meeting.' });
//   }
// };

// module.exports = { createZoomMeeting };

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





module.exports = {
  createMeeting,
};
