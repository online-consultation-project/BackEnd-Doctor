const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authToken");
const controller = require("../controllers/product.controller");
const { singleUpload } = require("../middlewares/multer");

router.use(verifyToken)

router
.route("/product")
.post(singleUpload, controller.createProduct);

module.exports = router;
