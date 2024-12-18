const express = require('express');
const { createAppointment } = require('../controllers/apointment.controller');
const userVerifyToken = require('../middlewares/userAuthToken');

const router = express.Router();


router.post('/booking', userVerifyToken.verifyToken,createAppointment);

module.exports = router;
