const express = require("express")
const router = express.Router()
const controller = require("../controllers/user.controller")
const userVerifytoken = require("../middlewares/userAuthToken")
const singleUpload = require("../middlewares/multer")


router.post("/register", controller.userRegister)
router.post("/login", controller.userLogin)
router.post("/googleAuth", controller.userGoogleAuth)


router.post("/contact",controller.addContactUsData)


router.use(userVerifytoken.verifyToken)
router
.route("/getUserProfile")
.get(controller.getProfileData)
.put(singleUpload.singleUpload,controller.updateProfile)

module.exports = router