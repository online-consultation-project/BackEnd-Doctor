const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin.controller");
const superVerifyToken  = require("../middlewares/authToken");

// router.use(verifyToken)

router
.route("/addadmin")
.post(controller.addAdmin)
.get(controller.getAllUsers)
.put(superVerifyToken.verifyToken,controller.updateAdmin)


router
.route("/getadmin")
.get(superVerifyToken.verifyToken,controller.getIdByUpdate);

module.exports = router;
