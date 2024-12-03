const adminData = require("../models/admin.model");
const bcrypt = require("bcrypt");
const { passwordGenerator } = require("../utils/generator");
const { sendMailToUser } = require("../utils/mailSend");

const addAdmin = async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body;
    console.log(req.body);

    const findEmail = await adminData.adminData.findOne({ email });
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
    let addAdmindata = await adminData.adminData.create(data);
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

const getAllUsers = async (req, res) => {
  try {
    const findAllUser = await adminData.adminData.find();
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

const getIdByUpdate = async (req, res) => {
  try {
    const { _id } = req.query; 
    console.log(req.query);
    
    const findAdmin = await adminData.adminData.findOne({_id:_id})    
    if (!findAdmin) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.json(findAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const {objId } = req.query
    const updatedAmin = await adminData.adminData.findByIdAndUpdate({_id:objId}, req.body, {new: true})
    if (!updatedAmin) {
      res.status(404).json({
        message: "Admin not found",
      })
    }
    res.status(200).json({
      updatedAmin,
      message: "Admin Updated Successfully",
    })
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}





module.exports = {
  addAdmin,
  getAllUsers,
  getIdByUpdate,
  updateAdmin,
};
