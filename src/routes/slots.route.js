const express = require('express');
const router = express.Router();
const { createSlots, getSlots, updateSlots, userGetSlots } = require('../controllers/slots.Controller');
const verifyToken = require("../middlewares/authToken")
const superVerifyToken = require("../middlewares/authSuper")

router.post('/slots', verifyToken.verifyToken, createSlots);
router.get('/slots', verifyToken.verifyToken, getSlots);
router.put('/slots', verifyToken.verifyToken, updateSlots);

//user panel
router.get('/slots/user/:doctorId', userGetSlots);

//superadmin

router.get('/slots/super', superVerifyToken.verifyToken, getSlots);

module.exports = router