const Appointment = require("../models/apointment.model"); // Ensure correct path

const createAppointment = async (req, res) => {
  const {
    userId,
    patientName,
    patientEmail,
    patientPhone,
    patientGender,
    patientAge,
    doctorId,
    slot,
    date,
    paymentStatus,
    doctorFirstName,
    doctorLastName,
    doctorCategory,
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
      patientGender,
      patientAge,
      doctorId,
      doctorFirstName,
      doctorLastName,
      doctorCategory,
      slot,
      date: formattedDate,
      paymentStatus,
    });

    await newAppointment.save();
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

// Fetch Appointments for a Doctor
const getAppointmentsByDoctor = async (req, res) => {
  const { doctorId } = req.params;
  // console.log("kfjjj===>",req.params);
  

  try {
    const appointments = await Appointment.find({ doctorId }).sort({ createdAt: -1 });

    if (!appointments.length) {
      return res.status(404).json({ success: false, message: 'No appointments found for this doctor' });
    }

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
  }
};

// Update Appointment Status
const updateAppointmentStatus = async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  if (!['Accepted', 'Rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.status(200).json({ success: true, message: `Appointment ${status.toLowerCase()} successfully`, appointment });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ success: false, message: 'Failed to update appointment status' });
  }
};

module.exports = { 
  createAppointment,
  getAppointmentsByDoctor,
  updateAppointmentStatus,
 };
