// const { generateToken } = require("../middlewares/authToken");
const superAdmin = require("../models/superAdmin.model");
const { passwordGenerator } = require("../utils/generator");
const { sendMailToUser} =require("../utils/mailSend")
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
module.exports = { signup, signIn };

