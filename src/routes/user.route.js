const express = require("express")
const router = express.Router()
const controller = require("../controllers/user.controller")

router.post("/register", controller.userRegister)
router.post("/login", controller.userLogin)
router.post("/googleAuth", controller.userGoogleAuth)


module.exports = router