const jwt = require("../middlewares/userAuthToken");
const { User, Contact } = require("../models/user.model");
const bcrypt = require("bcrypt");
const fs = require("fs")

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

// // fetching the user profile
// const getIdByUpdate = async (req, res) => {
//   try {
//     const { _id } = req.query;
//     console.log(req.query);

//     const findAdmin = await User.findOne({ _id: _id });
//     if (!findAdmin) {
//       return res.status(404).json({ message: "Admin Not Found" });
//     }

//     res.json(findAdmin);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// updating the user profile
// const updateProfile = async (req, res) => {
//   const { userid } = req.query;  // Get the userId from query params

//   // Prepare the updated data
//   const updatedData = {
//     username: req.body.username,
//     email: req.body.email,
//     mobile: req.body.mobile,
//     address: req.body.address,
//     gender: req.body.gender,
//     bloodGroup: req.body.bloodGroup,
//   };

//   // Handle profile image update
//   if (req.file) {
//     updatedData.profileImage = `/uploads/${req.file.filename}`;
//   }

//   try {
//     const updatedUser = await User.findByIdAndUpdate(userid, updatedData, { new: true, runValidators: true });
//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     return res.status(200).json(updatedUser);  // Return the updated user data
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };


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
      message: "Admin profile updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  userRegister,
  userLogin,
  userGoogleAuth,
  addContactUsData,
  updateProfile,
  getProfileData,
};
