const express = require("express");
const router = express.Router();
const zoomMeetingController = require("../controllers/onlineAppointment.controller");
const userVerifyToken = require("../middlewares/userAuthToken")


router.post("/create-meeting",userVerifyToken.verifyToken, zoomMeetingController.createMeeting);








module.exports = router;
