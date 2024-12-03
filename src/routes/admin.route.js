const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin.controller");
const { verifyToken } = require("../middlewares/authToken");

// router.use(verifyToken)

router
.route("/addadmin")
.post(controller.addAdmin)
.get(controller.getAllUsers)
.put(verifyToken,controller.updateAdmin)


router
.route("/getadmin")
.get(verifyToken,controller.getIdByUpdate);

module.exports = router;
