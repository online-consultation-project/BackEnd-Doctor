const slotModel = require("../models/admin.model");
const Appointment = require("../models/apointment.model"); 


const createSlots = async (req, res) => {
  const adminData = req.adminAuthData
  const { date, slots } = req.body;
  
  try {
    const existingSlot = await slotModel.slot.findOne({ doctorId: adminData._id, date });
    if (existingSlot) {
      return res
        .status(400)
        .json({ message: "Slots already exist for this date." });
    }

    const newSlot = new slotModel.slot({ doctorId: adminData._id, date, slots });
    await newSlot.save();

    res
      .status(201)
      .json({ message: "Slots created successfully.", slot: newSlot });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};


const getSlots = async (req, res) => {
  const adminData = req.adminAuthData
  // const { doctorId } = req.params;
  const { date } = req.query;

  try {
    const slot = await slotModel.slot.findOne({ doctorId:adminData._id, date });
    if (!slot) {
      return res.status(404).json({ message: "No slots found for this date." });
    }

    const bookedAppointments = await Appointment.find({
      doctorId: adminData._id,
      date,
    }).select("slot"); // Select only the slot field

    const bookedSlots = bookedAppointments.map((appointment) => appointment.slot);

    res.status(200).json({
      slots: slot.slots,
      bookedSlots, 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
    console.log(error);
  }
};
const userGetSlots = async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  try {
    const slot = await slotModel.slot.findOne({ doctorId, date });
    if (!slot) {
      return res.status(404).json({ message: "No slots found for this date." });
    }

    const bookedAppointments = await Appointment.find({
      doctorId,
      date,
    }).select("slot"); // Select only the slot field

    const bookedSlots = bookedAppointments.map((appointment) => appointment.slot);

    res.status(200).json({
      slots: slot.slots,
      bookedSlots, 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
    console.log(error);
  }
};

const updateSlots = async (req, res) => {
  const adminData = req.adminAuthData
  const { date, slots } = req.body;

  try {
    const updatedSlot = await slotModel.slot.findOneAndUpdate(
      { doctorId: adminData._id, date },
      { slots },
      { new: true, upsert: true }
    );

    res
      .status(200)
      .json({ message: "Slots updated successfully.", slot: updatedSlot });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

module.exports = {
  createSlots,
  getSlots,
  updateSlots,
  userGetSlots
};
