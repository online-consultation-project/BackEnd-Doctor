const jwt = require("../middlewares/userAuthToken");
const { User } = require("../models/user.model");
const bcrypt = require("bcrypt");

const userRegister = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const findEmail = await User.findOne({ email });
        if (findEmail) {
            return res.status(400).json({
                message: "Email already exists."
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const data = {
            ...req.body,
            password: hashedPassword
        };
        await User.create(data);
        res.status(200).json({
            message: "User created successfully."
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const findEmail = await User.findOne({ email });
        if (!findEmail) {
            return res.status(400).json({
                message: "Email not registered."
            });
        }
        const validPassword = await bcrypt.compare(password, findEmail.password);
        if (!validPassword) {
            return res.status(400).json({
                message: "Invalid password."
            });
        }
        const token = await jwt.generateToken(findEmail);

        res.status(200).json({
            message: "User logged in successfully.",
            token,
            findEmail
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
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
            findEmail
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    userRegister,
    userLogin,
    userGoogleAuth
};
