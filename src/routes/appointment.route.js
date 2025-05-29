const express = require('express');
const { createAppointment } = require('../controllers/apointment.controller');
const userVerifyToken = require('../middlewares/userAuthToken');
const adminVerifyToken = require("../middlewares/authToken")
const controller = require('../controllers/apointment.controller');
const superVerifyToken = require('../middlewares/authSuper')

const router = express.Router();

// super admin

router
.route("/fetchallappointment")
.get(superVerifyToken.verifyToken,controller.getAllAppointment)

router
.route("/fetchallappointmentchart")
.get(controller.getAllAppointment)

// user

router 
.route("/booking")
.post(userVerifyToken.verifyToken,controller.createAppointment)
// route for the get appointment booked message 
.get(userVerifyToken.verifyToken,controller.getConfirmationMessage)


//checkappointment get on user panel

router
.route("/offlineappointment")
.get(userVerifyToken.verifyToken,controller.getOfflineAppoint)


// admin

router.get("/bydoctor",adminVerifyToken.verifyToken ,controller.getAppointmentsByDoctor);

// Route to update the status of an appointment
router.put("/statusupdate/:appointmentId/status", adminVerifyToken.verifyToken, controller.updateAppointmentStatus);


// route for only to get  accepted  appointments on  my patient page  
router
.route("/acceptbookings")
.get( adminVerifyToken.verifyToken,controller.getAcceptPatient)


// Route to fetch patients for a specific doctor using query parameters
router
.route("/dashboard")
.get(controller.getForAdminDashBoard)

module.exports = router;
