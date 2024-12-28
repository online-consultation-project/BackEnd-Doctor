const express = require("express");
const router = express.Router();
const zoomMeetingController = require("../controllers/onlineAppointment.controller");
const userVerifyToken = require("../middlewares/userAuthToken")
const SuperVerifyToken = require("../middlewares/authSuper")
const adminVerifyToken = require("../middlewares/authToken")


router.post("/create-meeting",userVerifyToken.verifyToken, zoomMeetingController.createMeeting);


/// foer user panel
router
.route("/onlineappointment")
.get(userVerifyToken.verifyToken,zoomMeetingController.getOnlineAppoint)

// super Admin
router
.route("/onlineappointment/super")
.get(SuperVerifyToken.verifyToken,zoomMeetingController.getAllAppointment)

//admin

router.get("/bydoctor",adminVerifyToken.verifyToken, zoomMeetingController.getAppointmentsByDoctor);

module.exports = router;
