// const { generateToken } = require("../middlewares/authToken");
const superAdmin = require("../models/superAdmin.model");
const { passwordGenerator } = require("../utils/generator");
const { sendMailToUser} =require("../utils/mailSend")
const sendMail = require("../utils/changePassmail")
const bcrypt = require("bcrypt");
const generateToken = require("../middlewares/authSuper")

const signup = async (req,res) => {
  try {
    const { email, } = req.body;
    const existingEmail = await superAdmin.superAdmin.findOne({ email });
    if (existingEmail) {
      return res.status(404).json({ message: "Email already exists..." });
    }
    const password = passwordGenerator(8);
    const hash = await bcrypt.hash(password, 10);

    let data = {
      ...req.body,
      password: hash,
    };
    await superAdmin.superAdmin.create(data);
    await sendMailToUser(email,password);
    res.json({
      message: "Account created successfully",
    })
    
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


const signIn = async (req, res) => {
  try {
    const { email, password} = req.body
    const findEmail = await superAdmin.superAdmin.findOne({email})
    if (!findEmail) {
      return res.status(400).json({
        message: "Email not Registered",
      })
    }
    const findPassword = await bcrypt.compare(password, findEmail.password)
    if (!findPassword) {
      return res.status(400).json({
        message: "Invalid Password",
      })
    }
    const token = generateToken.generateToken(findEmail)
    console.log(token);
    
    res.json({
      token,
      findEmail,
      message: "Login Successfully",
    })
  } catch (error) {
    res.json({
      message: error.message
    })
  }
}


const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const { _id } = req.userData;
  
  try {
    const user = await superAdmin.superAdmin.findById(_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);


    user.password = hashedPassword;
    await user.save();

    const name = user.userName

    // Send email notification
    await sendMail({
      to: user.email,
      subject: "Password Changed",
      text: `Hello ${name},\n\nYour password has been successfully changed.\n\nIf you did not make this change, please contact support immediately.`,
    });

    res.status(200).json({ message: "Password updated successfully..." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = { signup, signIn, changePassword };

