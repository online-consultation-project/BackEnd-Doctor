const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin.controller");
const { verifyToken } = require("../middlewares/authToken");



router.route("/adminsigin").post(controller.AdminSignin)

router.use(verifyToken)

router
  .route("/addadmin")
  .post(controller.addAdmin)
  .get(controller.getAllUsers)
  .put( controller.updateAdmin);

router
  .route("/getadmin")
  .get( controller.getIdByUpdate);

router
.route("/getadminProfile")
.get(controller.getAdminData)

router
.route("/getslotforupdate")
.get(controller.getSlotByIdForUpdate)

router
.route("/slots")
.post(controller.createSlot)
.get(controller.getSlotById)
.put(controller.editSlots)


module.exports = router;

