const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin.controller");
const { verifyToken } = require("../middlewares/authToken");
const superVerifyToken = require("../middlewares/authSuper");

router.route("/adminsigin").post(controller.AdminSignin);

// super Admin

router
  .route("/addadmin")
  .post(controller.addAdmin)
  .get(controller.getAllUsers)
  .put(superVerifyToken.verifyToken, controller.updateAdmin);

router
  .route("/getadmin")
  .get(superVerifyToken.verifyToken, controller.getIdByUpdate);

// admin

router.use(verifyToken);

router
  .route("/profileadd")
  .post(controller.addAdmin)
  .get(controller.getAllUsers)
  .put(controller.updateAdmin);

router.route("/getprofile").get(controller.getIdByUpdate);

router.route("/getadminProfile").get(controller.getAdminData);

router.route("/getslotforupdate").get(controller.getSlotForUpdate);

router
  .route("/slots")
  .post(controller.createSlot)
  .get(controller.getSlotById) 

  .put(controller.editSlots);

module.exports = router;
