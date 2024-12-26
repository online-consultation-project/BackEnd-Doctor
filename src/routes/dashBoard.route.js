const express = require("express");
const router = express.Router();
const controller = require("../controllers/dashBoard.controller");

// router.get("/revenue", controller.getMonthlyRevenue);
router.get("/users", controller.getDailyUsers);
router.get("/totalusers", controller.getTotalUsers);
router.get("/admins", controller.getTotalAdmins);
router.get("/appointment",controller.getTotalAppointments)

module.exports = router;
