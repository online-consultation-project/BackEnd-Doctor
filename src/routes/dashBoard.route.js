const express = require("express");
const router = express.Router();
const controller = require("../controllers/dashBoard.controller");

router.get("/users", controller.getDailyUsers);
router.get("/totalusers", controller.getTotalUsers);
router.get("/admins", controller.getTotalAdmins);
router.get("/appointment", controller.getTotalAppointments);
router.get("/getdailyappointment", controller.getDailyAppointment);
router.get("/getdailyrevenue", controller.getDailyRevenue);
router.get("/getdailyadmins", controller.getDailyAdmin);
router.get("/totalonlineappointment", controller.getTotalOnlinemeeting);

////admin

// Route to get total revenue
router.get("/revenue", controller.getTotalRevenue);

// Route to get daily revenue
router.get("/revenue/perday", controller.getDailyRevenue);


router.get("/revenue/perday", controller.getForDailyRevenue);
router.get("/revenue/perweek", controller.getRevenuePerWeek);



module.exports = router;
