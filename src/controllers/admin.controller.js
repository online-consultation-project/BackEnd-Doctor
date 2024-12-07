const { adminData, slot } = require("../models/admin.model");
const bcrypt = require("bcrypt");
const { passwordGenerator } = require("../utils/generator");
const { sendMailToUser } = require("../utils/mailSend");
const { generateToken } = require("../middlewares/authToken");

const addAdmin = async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;
    console.log(req.body);

    const findEmail = await adminData.findOne({ email });
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
    let addAdmindata = await adminData.create(data);
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
    const findEmail = await adminData.findOne({ email });
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

const getAllUsers = async (req, res) => {
  try {
    const findAllUser = await adminData.find();
    res.status(200).json(findAllUser);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// const getIdByUpdate = async (req, res) => {
//   try {
//     let { objId } = req.query;
//     const updatedData = await adminData.findByIdAndUpdate(objId, req.body, {new: true})
//     if (!updatedData) {
//       res.status(404).json({
//         message: "User not found",
//       });
//     }
//     res.status(200).json({
//       updatedData,
//       message: "Data Updated Successfully",
//     });
//   } catch (error) {
//     res.status(400).json({
//       message: error.message,
//     });
//   }
// };

// Admin Profile

const getAdminData = async (req, res) => {
  try {
    const id = req.query;
    const getProfile = await adminData.findOne({ _id: id });

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

    const findAdmin = await adminData.findOne({ _id: _id });
    if (!findAdmin) {
      return res.status(404).json({ message: "Admin Not Found" });
    }

    res.json(findAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { objId } = req.query;
    const updatedAmin = await adminData.findByIdAndUpdate(
      { _id: objId },
      req.body,
      { new: true }
    );
    if (!updatedAmin) {
      res.status(404).json({
        message: "Admin not found",
      });
    }
    res.status(200).json({
      updatedAmin,
      message: "Admin Updated Successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

//slots

const createSlot = async (req, res) => {
  try {
    const { doctor_id } = req.body;

    if (!doctor_id) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }

    const findAdmin = await adminData.findById(doctor_id);

    if (!findAdmin) {
      return res.status(404).json({ message: "Doctor Not Found" });
    }

    const slotData = await slot.create(req.body);

    if (slotData) {
      res.status(201).json({ message: "Slot created successfully", slotData });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const addSlots = async (req, res) => {
  try {
    const { objId } = req.query;

    const updateAdminSlot = await adminData.findByIdAndUpdate(objId, req.body, {
      new: true,
    });

    if (!updateAdminSlot) {
      return res.status(404).json({ message: "Admin not Found" });
    }
    res.json({ updateAdminSlot, message: "slot updated Successfully..!" });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

 const getSlotById = async (req, res) => {
  try {
    const { doctor_id } = req.query;

    let findDoctorSlot = await slot.findOne({ doctor_id });

    if (!findDoctorSlot) {
      return res.status(404).json({ message: "Data not found" });
    }
    console.log(findDoctorSlot.slots);
    res.json(findDoctorSlot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

 const getSlotForUpdate = async (req, res) => {
  try {
    const { doctor_id } = req.query;
    console.log("doctorId", doctor_id);

    let findDoctorSlot = await slot.findById({ doctor_id: doctor_id });
    console.log("doctordata", findDoctorSlot);

    if (!findDoctorSlot) {
      return res.status(404).json({ message: "Data not found" });
    }
    console.log(findDoctorSlot.slots);
    res.json(findDoctorSlot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

 const editSlots = async (req, res) => {
  try {
    const { objId } = req.query;
    
    const updateAdminSlot = await adminData.findByIdAndUpdate(objId, req.body, {
      new: true,
    });

    if (!updateAdminSlot) {
      return res.status(404).json({ message: "Admin not Found" });
    }
    res.json({ updateAdminSlot, message: "slot updated Successfully..!" });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  addAdmin,
  getAllUsers,
  getIdByUpdate,
  updateAdmin,
  AdminSignin,
  getAdminData,
  addSlots,
  createSlot,
  getSlotById,
  getSlotForUpdate,
  editSlots,
};
