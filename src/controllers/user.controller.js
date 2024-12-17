const jwt = require("../middlewares/userAuthToken");
const { User, Contact } = require("../models/user.model");
const bcrypt = require("bcrypt");

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

module.exports = {
  userRegister,
  userLogin,
  userGoogleAuth,
  addContactUsData,
};
