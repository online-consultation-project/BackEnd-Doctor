const mongoose = require("mongoose");
const { v4 } = require("uuid");

const adminSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    category: {
      type: String,
    },
    gender: {
      type: String,
    },
    experience: {
      type: String,
    },
    hospitalName: {
      type: String,
    },
    displayName: {
      type: String,
    },
    UgDegree: {
      type: String,
    },
    PgDegree: {
      type: String,
    },
    UgCompletedAt: {
      type: String,
    },
    PgCompletedAt: {
      type: String,
    },
    Ugyear: {
      type: Number,
    },
    Pgyear: {
      type: Number,
    },
    experience1: {
      type: String,
    },
    experience2: {
      type: String,
    },
    location: {
      type: String,
    },
    employement: {
      type: String,
    },
    slotCreatedDate: {
      type: String,
    },
    password: {
      type: String,
    },
    profileFileName: {
      type: String,
    },
    filePath: {
      type: String,
    },
    fileType: {
      type: String,
    },
  },
  {
    timestamps: true,
    TimeRanges: true,
  }
);

const admin_data = mongoose.model("admin_data", adminSchema);

const SlotSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4
  },
  doctorId: {
    type: String,
    ref: 'admin_data',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  slots: {
    type: [String],
    required: true,
  },
},
{
  timestamps: true,
  TimeRanges: true,
});

const slot = mongoose.model('Avail_Slot', SlotSchema);

module.exports = { admin_data, slot };
