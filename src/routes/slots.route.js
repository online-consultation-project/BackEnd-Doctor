const express = require('express');
const router = express.Router();
const { createSlots, getSlots, updateSlots } = require('../controllers/slots.Controller');
const verifyToken = require("../middlewares/authToken")
const userVerifyToken = require("../middlewares/userAuthToken")

router.post('/slots', verifyToken.verifyToken, createSlots);
router.get('/slots/:doctorId', verifyToken.verifyToken, getSlots);
router.put('/slots/:doctorId', verifyToken.verifyToken, updateSlots);

//user panel
router.get('/slots/user/:doctorId', userVerifyToken.verifyToken, getSlots);

module.exports = router