const mongoose = require("mongoose");
const { v4 } = require("uuid");

const superAdminSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    userName: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    phoneNo: {
      type: Number,
    },
    password: {
        type: String,
    }
  },
  {
    timestamps: true,
    timeseries: true,
  }
);

const superAdmin = mongoose.model("super_Admin", superAdminSchema);

module.exports = {superAdmin};
