const { admin_data ,Report } = require("../models/admin.model");
const bcrypt = require("bcrypt");
const { passwordGenerator } = require("../utils/generator");
const { sendMailToUser } = require("../utils/mailSend");
const { generateToken } = require("../middlewares/authToken");
const sendMail = require("../utils/changePassmail");
const fs = require("fs");

const addAdmin = async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;
    // const file = req.file;
    console.log(req.body);

    const findEmail = await admin_data.findOne({ email });
    if (findEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    const password = passwordGenerator(8);
    const hash = await bcrypt.hash(password, 10);
    const name = firstName + " " + lastName;
    let data = {
      ...req.body,
      password: hash,
    };
    let addAdmindata = await admin_data.create(data);
    await sendMailToUser(email, name, password);
    res.status(200).json({
      addAdmindata,
      message: "Admin created successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const AdminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findEmail = await admin_data.findOne({ email });
    if (!email) {
      return res.status(400).json({
        message: "Email not registered..!",
      });
    }
    const findPassword = await bcrypt.compare(password, findEmail.password);
    if (!findPassword) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }
    const token = generateToken(findEmail);
    res.json({
      token,
      findEmail,
      message: "Admin Login Successful",
      role: "admin",
    });
  } catch (error) {
    res.json({
      message: error.messsage,
    });
  }
};


////report by admin

const createReport = async (req, res) => {
  try {
    const { subject, issue, detailedProblem, } = req.body;

    const adminreport = req.adminAuthData

    if (!subject || !issue || !detailedProblem ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newReport = new Report({

     ...req.body,
      doctorId:adminreport._id,
      doctorName:adminreport.firstName,
      email:adminreport.email,
    });

    await newReport.save();
    return res.status(200).json({ message: "Report created successfully!" });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const adminsCount = async (req, res) => {
  try {
    const currentDate = new Date();
    const count = await admin_data.countDocuments({
      createdAt: { $lte: currentDate },
    });
    res.json({ count });
  } catch (error) {
    console.error("Error fetching count:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getLimitedData = async (req, res) => {
  try {
    const getLimitData = await admin_data
      .find()
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(200).json({
      getLimitData,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const findAllUser = await admin_data.find();
    res.status(200).json(findAllUser);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};


const getAdminData = async (req, res) => {
  try {
    const id = req.query;
    const getProfile = await admin_data.findOne({ _id: id });

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

const getIdByUpdate = async (req, res) => {
  try {
    const { _id } = req.query;
    console.log(req.query);

    const findAdmin = await admin_data.findOne({ _id: _id });
    if (!findAdmin) {
      return res.status(404).json({ message: "Admin Not Found" });
    }

    res.json(findAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Controller for deleting a doctor in super admin 
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Use query to find and delete the doctor
    const deletedDoctor = await admin_data.findOneAndDelete({ _id: id });

 if (deletedDoctor.filePath) {
      fs.unlinkSync(deletedDoctor.filePath);
    }
    if (!deletedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting doctor", error: error.message });
  }
};

//slots

const updateAdmin = async (req, res) => {
  try {
    let { objId } = req.query;
    let file = req.file;
    let newFile = req.file;

    let data = {
      ...req.body,
    };

    if (newFile) {
      const oldFile = await admin_data.findById({ _id: objId });

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
    const updatedAdmin = await admin_data.findByIdAndUpdate(objId, data, {
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

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const { _id } = req.adminAuthData;

  try {
    const user = await admin_data.findById(_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    const name = user.firstName + " " + user.lastName;

    // Send email notification
    await sendMail({
      to: user.email,
      subject: "Password Changed",
      text: `Hello ${name},\n\nYour password has been successfully changed.\n\nIf you did not make this change, please contact support immediately.`,
    });

    res.status(200).json({ message: "Password updated successfully..." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
    console.log(error);
  }
};

const resetPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    const user = await admin_data.findOne({ email });
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

// user panel

// search by location and category

const fetchDocByLocation = async (req, res) => {
  try {
    const { location, category } = req.query;

    const searchCondition = {};
    if (location) searchCondition.location = location;
    if (category) searchCondition.category = category;

    const doctorsByLocation = await admin_data.find(searchCondition);
    if (doctorsByLocation.length === 0) {
      res.status(404).json({ message: "No Docotors Found in this Location " });
    }
    res.status(200).json(doctorsByLocation);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

//report fetch

const getRecentReports = async (req, res) => {
  try {
    const recentReports = await Report.find()

    res.status(200).json(recentReports);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching recent reports', error: error.message });
  }
};

module.exports = {
  addAdmin,
  getAllUsers,
  getIdByUpdate,
  updateAdmin,
  AdminSignin,
  getAdminData,
  getLimitedData,
  changePassword,
  resetPassword,
 fetchDocByLocation,
 adminsCount,
 deleteDoctor,
 createReport,
 getRecentReports, 
};
