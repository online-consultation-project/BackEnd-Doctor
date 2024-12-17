const mongoose = require("mongoose");
const { v4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
    },
    picture: {
      type: String,
    },
    googleId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User_register", userSchema);

const contactSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    fullName: String,
    email: String,
    phone: String,
    role: String,
    message: String,
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = { User, Contact };
