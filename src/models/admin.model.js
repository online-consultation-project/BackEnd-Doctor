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
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
    TimeRanges: true,
  }
);

const adminData = mongoose.model("admin_data", adminSchema);

module.exports = {adminData};
