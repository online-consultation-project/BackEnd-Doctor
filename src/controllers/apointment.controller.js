const Appointment = require("../models/apointment.model"); // Ensure correct path
const sendMail = require("../utils/changePassmail");

const createAppointment = async (req, res) => {
  const {
    userId,
    patientName,
    patientEmail,
    patientPhone,
    patientConsult,
    patientGender,
    patientAge,
    doctorId,
    slot,
    date,
    paymentStatus,
    doctorFirstName,
    doctorLastName,
    doctorCategory,
    payment,
  } = req.body;

  if (paymentStatus !== "Success") {
    return res.status(400).json({
      success: false,
      message: "Payment failed, appointment not booked",
    });
  }

  try {
    const formattedDate =
      typeof date === "string"
        ? date.split("T")[0]
        : new Date(date).toISOString().split("T")[0];

    const isSlotTaken = await Appointment.findOne({
      doctorId,
      date: formattedDate,
      slot,
    });

    if (isSlotTaken) {
      return res.status(400).json({
        success: false,
        message:
          "Selected time slot is already booked. Please choose another slot.",
      });
    }

    // Create a new appointment if the slot is available
    const newAppointment = new Appointment({
      userId,
      patientName,
      patientEmail,
      patientPhone,
      patientConsult,
      patientGender,
      patientAge,
      doctorId,
      doctorFirstName,
      doctorLastName,
      doctorCategory,
      slot,
      date: formattedDate,
      paymentStatus,
      payment,
    });

    await newAppointment.save();

    await sendMail({
      to: patientEmail,
      subject: "Your Zoom Meeting Details",
      html: `
        <p>Dear ${patientName},</p>
        <p>Your consultation meeting is scheduled as follows:</p>
        <ul>
          <li><strong>Doctor Name:</strong> ${`${doctorFirstName} ${doctorLastName}`}</li>
          <li><strong>Date-Slot:</strong> ${doctorCategory}</li>
        </ul>
        <p>Join the meeting using the following details:</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Slot:</strong> ${slot}</p>
        <p>Best regards,<br/>Your Team</p>
      `,
    });

    res
      .status(200)
      .json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to book appointment." });
  }
};

const getAllAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.find()
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

// Fetch Appointments for a Doctor
const getAppointmentsByDoctor = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const appointments = await Appointment.find({ doctorId }).sort({
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

// Update Appointment Status
const updateAppointmentStatus = async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  if (!["Accepted", "Rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({
      success: true,
      message: `Appointment ${status.toLowerCase()} successfully`,
      appointment,
    });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update appointment status" });
  }
};
//// get apppointment detials for the confirmation message

const getConfirmationMessage = async (req, res) => {
  try {
    const { _id } = req.query;

    if (!_id) {
      return res.status(400).json({ message: "User ID Not Found" });
    }

    const confirmationMessage = await Appointment.findOne({ userId: _id }).sort(
      { createdAt: -1 }
    );

    if (!confirmationMessage) {
      return res.status(400).json({ message: "Data for user was not found" });
    }

    return res.status(200).json(confirmationMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

//// get function  accepted appointmenty only disply on my patient

const getAcceptPatient = async (req, res) => {
  try {
    const { doctorId } = req.query;

    // console.log(doctorId);

    if (!doctorId) {
      return res.status(400).json({ message: "Admin ID not found" });
    }

    const getPatient = await Appointment.find({
      doctorId: doctorId,
      status: "Accepted",
    }).sort();

    console.log("fghjk", getPatient);

    if (!getPatient.length) {
      return res
        .status(404)
        .json({ message: "No Accepted Appointments are not found" });
    }
    res.status(200).json(getPatient);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "server error" });
  }
};

//// for admin  dashboard

const getForAdminDashBoard = async (req, res) => {
  const { doctorId } = req.query;

  try {
    if (!doctorId) {
      return res
        .status(400)
        .json({ message: "Doctor ID is required in query parameters." });
    }

    const patients = await Appointment.find({ doctorId });
    if (!patients || patients.length === 0) {
      return res
        .status(404)
        .json({ message: "No patients found for this doctor." });
    }

    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients by doctor:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  createAppointment,
  getAppointmentsByDoctor,
  updateAppointmentStatus,
  getConfirmationMessage,
  getAcceptPatient,
  getForAdminDashBoard,
  getAllAppointment,
};
