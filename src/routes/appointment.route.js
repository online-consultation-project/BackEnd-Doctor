const express = require('express');
const { createAppointment } = require('../controllers/apointment.controller');
const userVerifyToken = require('../middlewares/userAuthToken');
const adminVerifyToken = require("../middlewares/authToken")
const controller = require('../controllers/apointment.controller');

const router = express.Router();


router.post('/booking', userVerifyToken.verifyToken,createAppointment);

router.get("/bydoctor/:doctorId",adminVerifyToken.verifyToken ,controller.getAppointmentsByDoctor);

// Route to update the status of an appointment
router.put("/statusupdate/:appointmentId/status", adminVerifyToken.verifyToken, controller.updateAppointmentStatus);

module.exports = router;
