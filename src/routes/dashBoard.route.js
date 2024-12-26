const express = require("express");
const router = express.Router();
const controller = require("../controllers/dashBoard.controller");

// router.get("/revenue", controller.getMonthlyRevenue);
router.get("/users", controller.getDailyUsers);
router.get("/totalusers", controller.getTotalUsers);
router.get("/admins", controller.getTotalAdmins);
router.get("/appointment",controller.getTotalAppointments)
router.get("/getdailyappointment", controller.getDailyAppointment)
router.get("/getdailyrevenue", controller.getDailyRevenue)
router.get("/getdailyadmins", controller.getDailyAdmin)
router.get("/totalonlineappointment", controller.getTotalOnlinemeeting)

module.exports = router;
