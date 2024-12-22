const express = require("express")
const router = express.Router()
const controller = require("../controllers/user.controller")
const userVerifytoken = require("../middlewares/userAuthToken")
const singleUpload = require("../middlewares/multer")
const verifyToken = require("../middlewares/authSuper")

router.post("/register", controller.userRegister)
router.post("/login", controller.userLogin)
router.post("/googleAuth", controller.userGoogleAuth)
router.post("/reset-password", controller.resetPassword)


router.post("/contact",controller.addContactUsData)



router
.route("/getUserProfile")
.get(controller.getProfileData)
.put(singleUpload.singleUpload, userVerifytoken.verifyToken ,controller.updateProfile)

router
.route("/getalluserdata")
.get(verifyToken.verifyToken,controller.getAllUsers)


router
  .route('/delete/:id')  
  .delete(verifyToken.verifyToken, controller.deleteUser);  


// user reviews post 

  router.route("/reviews")
  .post(userVerifytoken.verifyToken,controller.SubmitReview)
  .get(controller.getReviews)

module.exports = router