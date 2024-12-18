const Appointment = require('../models/apointment.model');  // Ensure correct path

// Create Appointment
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
  } = req.body;

  if (paymentStatus !== 'Success') {
    return res.status(400).json({ success: false, message: 'Payment failed, appointment not booked' });
  }

  try {
    const newAppointment = new Appointment({
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
    });

    await newAppointment.save();
    res.status(200).json({ success: true, message: 'Appointment booked successfully' });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ success: false, message: 'Failed to book appointment.' });
  }
};

module.exports = { createAppointment };
