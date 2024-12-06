const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authToken");
const controller = require("../controllers/product.controller");
const { singleUpload } = require("../middlewares/multer");

router.use(verifyToken)

router
.route("/product")
.post(singleUpload, controller.createProduct)
.get(controller.getProduct)
.put(singleUpload,controller.updateProduct)

router
.route("/productgetdata")
.get(controller.getProductById)


module.exports = router;
