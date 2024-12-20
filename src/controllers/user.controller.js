const jwt = require("../middlewares/userAuthToken");
const { User, Contact, Review } = require("../models/user.model");
const bcrypt = require("bcrypt");
const fs = require("fs");

const userRegister = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const findEmail = await User.findOne({ email });
    if (findEmail) {
      return res.status(400).json({
        message: "Email already exists.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = {
      ...req.body,
      password: hashedPassword,
    };
    await User.create(data);
    res.status(200).json({
      message: "User created successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const findEmail = await User.findOne({ email });
    if (!findEmail) {
      return res.status(400).json({
        message: "Email not registered.",
      });
    }
    const validPassword = await bcrypt.compare(password, findEmail.password);
    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid password.",
      });
    }
    const token = await jwt.generateToken(findEmail);

    res.status(200).json({
      message: "User logged in successfully.",
      token,
      findEmail,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const userGoogleAuth = async (req, res) => {
  try {
    const { username, email, picture, googleId } = req.body;
    let findEmail = await User.findOne({ email });
    if (!findEmail) {
      findEmail = new User({ username, email, picture, googleId });
      await findEmail.save();
    }
    const token = await jwt.generateToken(findEmail);
    res.status(200).json({
      message: "User logged in successfully.",
      token,
      findEmail,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//sri
//contact us post

const addContactUsData = async (req, res) => {
  const { fullName, email, phone, role, message } = req.body;

  if (!fullName || !email || !phone || !role || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newContact = new Contact({
      fullName,
      email,
      phone,
      role,
      message,
    });

    const product = await Contact.create(newContact);

    res
      .status(200)
      .json({ message: "Form data successfully submitted", product });
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//get profile data

const getProfileData = async (req, res) => {
  try {
    const id = req.query;
    const getProfile = await User.findOne({ _id: id });

    if (!getProfile) {
      return res.status(400).json({ message: "Mail id not exist" });
    }
    res.status(200).json(getProfile);
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    let { objId } = req.query;
    let file = req.file;
    let newFile = req.file;

    let data = {
      ...req.body,
    };

    if (newFile) {
      const oldFile = await User.findById({ _id: objId });

      if (!oldFile) {
        return res.status(404).json({ Message: "Data Not Found.." });
      }
      if (oldFile.profileFileName) {
        fs.unlinkSync(`${oldFile.filePath}`);

        data.profileFileName = newFile.filename;
        data.filePath = newFile.path;
        data.fileType = newFile.mimetype;
      } else {
        data = {
          ...data,
          profileFileName: file.filename,
          filePath: file.path,
          fileType: file.mimetype,
        };
      }
    }
    const updatedAdmin = await User.findByIdAndUpdate(objId, data, {
      new: true,
    });

    res.status(200).json({
      updatedAdmin,
      message: "User profile updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

//get all user data for super admin

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit);

    res.json(users);
  } catch (error) {
    console.error("Error fetching users: ", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

//delete user from Super-admin
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.filePath) {
      fs.unlinkSync(user.filePath);
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    const name = user.firstName + " " + user.lastName;

    // Send email notification
    await sendMail({
      to: user.email,
      subject: "Password Changed",
      text: `Hello ${name},\n\nYour password has been successfully changed.\n\nIf you did not make this change, please contact support immediately.`,
    });

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

//post user review

const SubmitReview = async (req, res) => {
  try {
    const { title, review, rating, docId, userId } = req.body;

    if (!title || !review || !rating || !docId || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newReview = new Review({
      title,
      review,
      rating,
      docId,
      userId,
    });

    await newReview.save();

    res.status(200).json({
      message: "Review successfully submitted",
      review: newReview,
    });
  } catch (error) {
    console.error("Error saving review data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// get reviews 

const getReviews = async (req,res) => {
  try {
    const {docId} = req.query;

    if (!docId) {
      return res.status(400).json({message:"Doctor ID is  not found "})

    }
    const reviews = await Review.find({docId})
    .populate("userId","profileFileName")
    .sort({createdAt: -1 })

    if (!reviews.length){
      return res.status(404).json({message:"No reviews found for this doctor"})

    }
    return res.status(200).json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  userRegister,
  userLogin,
  userGoogleAuth,
  addContactUsData,
  updateProfile,
  getProfileData,
  getAllUsers,
  deleteUser,
  resetPassword,
  SubmitReview,
  getReviews
};
