const jwt = require("jsonwebtoken");
const signin = require("../models/superAdmin.model");

const key = "r5sqdtfkgsa^RDT32l43276tasddxzjcnhisydg"

const generateToken = (data) => {
    const token = jwt.sign({ data }, key, { expiresIn: '1h' });
    return token;
};


const verifyToken = async (req, res, next) => {
    
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ Message: "user must be signIn.." })
    };
    const withoutBearer = token.split(' ')[1];
    try {
        const payload = jwt.verify(withoutBearer, key);

        const checkUser = await signin.findById(payload.data._id);
        if (!checkUser) return res.status(404).json({ Message: "user not found for this token..." });
        req.userData = checkUser; next();
    } catch (error) {
        res.status(401).json({
            Error: error.message
        })
    }
};


module.exports = {
    generateToken,
    verifyToken
};