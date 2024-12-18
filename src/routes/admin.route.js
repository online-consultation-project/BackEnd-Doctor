const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin.controller");
const { verifyToken } = require("../middlewares/authToken");
const superVerifyToken = require("../middlewares/authSuper");
const singleUpload = require("../middlewares/multer");
const userVerifyToken = require("../middlewares/userAuthToken");

// super Admin

router
  .route("/addadmin")
  .post(controller.addAdmin)
  .get(controller.getAllUsers)
  .put(superVerifyToken.verifyToken, controller.updateAdmin);
router
  .route("/limitedgetadmin")
  .get(controller.getLimitedData);

router
  .route("/getadmin")
  .get(controller.getIdByUpdate);

// user

router
  .route("/neardoctors")
  .get(controller.fetchDocByLocation);

  
router
  .route("/getadmin/user")
  .get( controller.getIdByUpdate);

// admin

router.route("/adminsigin").post(controller.AdminSignin);
router.post("/reset-password", controller.resetPassword);

// router.use(verifyToken);

router
  .route("/profileadd")
  .put(singleUpload.singleUpload, controller.updateAdmin);

router.route("/getprofile").get(controller.getIdByUpdate);

router.route("/getadminProfile").get(controller.getAdminData);

router.route("/change-password").put(controller.changePassword);

module.exports = router;
