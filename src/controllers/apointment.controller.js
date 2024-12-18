// const Appointment = require('../models/apointment.model');  // Ensure correct path

// // Create Appointment
// const createAppointment = async (req, res) => {
//   const {
//     userId,
//     patientName,
//     patientEmail,
//     patientPhone,
//     patientGender,
//     patientAge,
//     doctorId,
//     slot,
//     date,
//     paymentStatus,
//   } = req.body;

//   if (paymentStatus !== 'Success') {
//     return res.status(400).json({ success: false, message: 'Payment failed, appointment not booked' });
//   }

//   try {
//     const newAppointment = new Appointment({
//       userId,
//       patientName,
//       patientEmail,
//       patientPhone,
//       patientGender,
//       patientAge,
//       doctorId,
//       slot,
//       date,
//       paymentStatus,
//     });

//     await newAppointment.save();
//     res.status(200).json({ success: true, message: 'Appointment booked successfully' });
//   } catch (error) {
//     console.error('Error creating appointment:', error);
//     res.status(500).json({ success: false, message: 'Failed to book appointment.' });
//   }
// };

// module.exports = { createAppointment };

const Appointment = require('../models/apointment.model'); 

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
    date, // Expecting full ISO format: YYYY-MM-DDTHH:mm:ss.sssZ
    paymentStatus,
  } = req.body;

  if (paymentStatus !== 'Success') {
    return res.status(400).json({ success: false, message: 'Payment failed, appointment not booked' });
  }

  try {
    // Extract only the date part (YYYY-MM-DD)
    const formattedDate = date.split('T')[0];

    // Check if the time slot is already booked for the doctor
    const isSlotTaken = await Appointment.findOne({ doctorId, date: formattedDate, slot });

    if (isSlotTaken) {
      return res.status(400).json({
        success: false,
        message: 'Selected time slot is already booked. Please choose another slot.',
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
      slot,
      date: formattedDate, // Store only the date part
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

