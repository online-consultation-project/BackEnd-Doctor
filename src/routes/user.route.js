const express = require("express")
const router = express.Router()
const controller = require("../controllers/user.controller")
const userVerifytoken = require("../middlewares/userAuthToken")
const singleUpload = require("../middlewares/multer")
const verifyToken = require("../middlewares/authSuper")

router.post("/register", controller.userRegister)
router.post("/login", controller.userLogin)
router.post("/googleAuth", controller.userGoogleAuth)


router.post("/contact",controller.addContactUsData)



router
.route("/getUserProfile")
.get(controller.getProfileData)
.put(singleUpload.singleUpload,controller.updateProfile,userVerifytoken.verifyToken)

router
.route("/getalluserdata")
.get(controller.getAllUsers,verifyToken.verifyToken)


router
  .route('/delete/:id')  
  .delete(verifyToken.verifyToken, controller.deleteUser);  


module.exports = router