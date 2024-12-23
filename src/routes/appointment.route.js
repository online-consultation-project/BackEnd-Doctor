const express = require('express');
const { createAppointment } = require('../controllers/apointment.controller');
const userVerifyToken = require('../middlewares/userAuthToken');
const adminVerifyToken = require("../middlewares/authToken")
const controller = require('../controllers/apointment.controller');

const router = express.Router();


router 
.route("/booking")
.post(userVerifyToken.verifyToken,controller.createAppointment)
// route for the get appointment booked message 
.get(userVerifyToken.verifyToken,controller.getConfirmationMessage)




router.get("/bydoctor/:doctorId",adminVerifyToken.verifyToken ,controller.getAppointmentsByDoctor);

// Route to update the status of an appointment
router.put("/statusupdate/:appointmentId/status", adminVerifyToken.verifyToken, controller.updateAppointmentStatus);


// route for only to get  accepted  appointments on  my patient page  
router
.route("/acceptbookings")
.get( adminVerifyToken.verifyToken,controller.getAcceptPatient)

module.exports = router;
