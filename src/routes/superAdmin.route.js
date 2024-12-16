const express = require("express");
const router = express.Router();
const controller = require("../controllers/superAdmin.controller");
const VerifyToken = require("../middlewares/authSuper")

router.route("/signup").post(controller.signup);
router.route("/signin").post(controller.signIn)
router.put("/change-password",VerifyToken.verifyToken,controller.changePassword)

module.exports = router;
