const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authSuper");
const controller = require("../controllers/product.controller");
const { singleUpload } = require("../middlewares/multer");
const userVerifytoken = require("../middlewares/userAuthToken")

router
.route("/product")
.post(singleUpload, verifyToken,controller.createProduct)
.get(controller.getProduct)
.put(singleUpload, verifyToken,controller.updateProduct)

router
.route("/productgetdata")
.get(controller.getProductById)

// delete a product by ID in superandmin panel

router.delete('/productdelete/:id', verifyToken, controller.deleteProductById);


//  USER PANEL


router
.route("/userproductdata")
.get(controller.getLimitedProduct)

// GET CATEGORY PRODUCT TO DISPLAY ON MEDICINE HOME

router
.route("/categoryproductforhome")
.get(controller.getProductCategoryForHome)

module.exports = router;
