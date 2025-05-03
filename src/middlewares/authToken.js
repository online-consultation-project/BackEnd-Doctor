const jwt = require("jsonwebtoken");
const adminModel = require("../models/admin.model");

const key = "r5sqdtfkgsa^RDT32l43276tasddxzjcnhisydg";

const generateToken = (data) => {
  const token = jwt.sign({ data }, key, { expiresIn: "1h" });
  return token;
};

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;


  if (!token) {
    return res.status(401).json({ Message: "user must be signIn.." });
  }
  const withoutBearer = token.split(" ")[1];
  console.log(withoutBearer);
  try {
    const payload = jwt.verify(withoutBearer, key);


    const checkUser = await adminModel.admin_data.findById(payload.data._id);
    console.log(checkUser);
    if (!checkUser)
      return res
        .status(404)
        .json({ Message: "user not found for this token..." });
    req.adminAuthData = checkUser;
    
    console.log(checkUser);
    
    next();
  } catch (error) {
    console.log(error);
    
    res.status(401).json({
      Error: error.message,
    });
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
