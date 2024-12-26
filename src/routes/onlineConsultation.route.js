const express = require("express");
const router = express.Router();
const zoomMeetingController = require("../controllers/onlineAppointment.controller");
const userVerifyToken = require("../middlewares/userAuthToken")


router.post("/create-meeting",userVerifyToken.verifyToken, zoomMeetingController.createMeeting);


/// foer user panel
router
.route("/onlineappointment")
.get(userVerifyToken.verifyToken,zoomMeetingController.getOnlineAppoint)





module.exports = router;
