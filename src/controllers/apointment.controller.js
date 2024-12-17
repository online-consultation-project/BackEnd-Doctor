const { Appointment } = require("../models/apointment.model")

const createAppointment = async (req, res) => {
    const { patientName, patientEmail,patientGender,patientAge, patientPhone, doctorId, slot, date, paymentStatus } = req.body;
  
    if (paymentStatus !== "Success") {
      return res.status(400).json({ success: false, message: "Payment failed, appointment not booked" });
    }
  
    try {
      const newAppointment = new Appointment({
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
      res.status(200).json({ success: true, message: "Appointment booked successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  
  module.exports = {createAppointment}