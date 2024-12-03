const express = require("express");
const router = express.Router();
const controller = require("../controllers/superAdmin.controller");

router.route("/signup").post(controller.signup);
router.route("/signin").post(controller.signIn)

module.exports = router;
