const mongoose = require("mongoose");
const { v4 } = require("uuid");

const productSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    productName: {
      type: String,
    },
    productCategory: {
      type: String,
    },
    brandName: {
      type: String,
    },
    strength: {
      type: String,
    },
    price: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    stockQuantity: {
      type: Number,
    },
    expireDate: {
      type: Date,
    },
    usageInstruction: {
      type: String,
    },
    description: {
      type: String,
    },
    productFileName: {
      type: String,
    
    },
    filePath: {
      type: String,
    },
    fileType: {
      type: String,
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("Product", productSchema);

module.exports = { productModel };
