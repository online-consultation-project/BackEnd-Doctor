// const { generateToken } = require("../middlewares/authToken");
const superAdmin = require("../models/superAdmin.model");
const { passwordGenerator } = require("../utils/generator");
const { sendMailToUser} =require("../utils/mailSend")
const { generateToken } = require("../middlewares/authToken");
const bcrypt = require("bcrypt");

const signup = async (req,res) => {
  try {
    const { email, } = req.body;
    const existingEmail = await superAdmin.findOne({ email });
    if (existingEmail) {
      return res.status(404).json({ message: "Email already exists..." });
    }
    const password = passwordGenerator(8);
    const hash = await bcrypt.hash(password, 10);

    let data = {
      ...req.body,
      password: hash,
    };
    await superAdmin.create(data);
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
    const findEmail = await superAdmin.findOne({email})
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
    const token = generateToken(findEmail)
    res.json({
      token,
      message: "Login Successfully",
    })
  } catch (error) {
    res.json({
      message: error.message
    })
  }
}
module.exports = { signup, signIn };

