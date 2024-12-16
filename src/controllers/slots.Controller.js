const slotModel = require("../models/admin.model");

const createSlots = async (req, res) => {
  const { doctorId, date, slots } = req.body;

  try {
    const existingSlot = await slotModel.slot.findOne({ doctorId, date });
    if (existingSlot) {
      return res
        .status(400)
        .json({ message: "Slots already exist for this date." });
    }

    const newSlot = new slotModel.slot({ doctorId, date, slots });
    await newSlot.save();

    res
      .status(201)
      .json({ message: "Slots created successfully.", slot: newSlot });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

const getSlots = async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;
  console.log("=====>", doctorId, date);
  try {
    const slot = await slotModel.slot.findOne({ doctorId, date });
    if (!slot) {
      return res.status(404).json({ message: "No slots found for this date." });
    }
    res.status(200).json(slot);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
    console.log(error);
  }
};

const updateSlots = async (req, res) => {
  const { doctorId } = req.params;
  const { date, slots } = req.body;

  try {
    const updatedSlot = await slotModel.slot.findOneAndUpdate(
      { doctorId, date },
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
};
