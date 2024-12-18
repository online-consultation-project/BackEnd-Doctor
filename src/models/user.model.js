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
    mobile: {
      type: String,
    },
    address: {
      type: String,
    },
    gender:{
      type: String,
    },
    bloodGroup:{
      type: String,
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



const review = require('mongoose');

const reviewSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4,
  },
  title: {
    type: String,

  },
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  docId: {
    type: String,
    ref: 'admin_data',  
   
  },
  // userId: {
  //   type: String,
  //   ref: 'User',  
  //   required: true,
  // },
}, {
  timestamps: true,  
});

const Review = mongoose.model('Review', reviewSchema);



module.exports = { User, Contact,Review };
