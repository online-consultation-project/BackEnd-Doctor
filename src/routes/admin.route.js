const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin.controller");
const { verifyToken } = require("../middlewares/authToken");
const superVerifyToken = require("../middlewares/authSuper");
const singleUpload = require("../middlewares/multer")


// super Admin

router
  .route("/addadmin")
  .post(controller.addAdmin)
  .get(controller.getAllUsers)
  .put(superVerifyToken.verifyToken, controller.updateAdmin);
router
.route("/limitedgetadmin")
.get(superVerifyToken.verifyToken,controller.getLimitedData)

router
  .route("/getadmin")
  .get(superVerifyToken.verifyToken, controller.getIdByUpdate);

// admin

router.route("/adminsigin").post(controller.AdminSignin);


router.use(verifyToken);

router
  .route("/profileadd")
  .post(controller.addAdmin)
  .get(controller.getAllUsers)
  .put(singleUpload.singleUpload,controller.updateAdmin);

router.route("/getprofile").get(controller.getIdByUpdate);

router.route("/getadminProfile").get(controller.getAdminData);

router.route("/getslotforupdate").get(controller.getSlotByIdForUpdate);

router
  .route("/slots")
  .post(controller.createSlot)
  .get(controller.getSlotById) 
  .put(controller.editSlots);

module.exports = router;
