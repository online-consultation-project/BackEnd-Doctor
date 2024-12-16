const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authSuper");
const controller = require("../controllers/product.controller");
const { singleUpload } = require("../middlewares/multer");
const userVerifytoken = require("../middlewares/userAuthToken")

router
.route("/product")
.post(singleUpload, controller.createProduct,verifyToken)
.get(controller.getProduct,verifyToken)
.put(singleUpload,controller.updateProduct,verifyToken)

router
.route("/productgetdata")
.get(controller.getProductById,verifyToken)



//  USER PANEL
router.use(userVerifytoken.verifyToken)

router
.route("/userproductdata")
.get(controller.getLimitedProduct)

// GET CATEGORY PRODUCT TO DISPLAY ON MEDICINE HOME

router
.route("/categoryproductforhome")
.get(controller.getProductCategoryForHome)

module.exports = router;
