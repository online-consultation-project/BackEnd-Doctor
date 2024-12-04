const { productModel } = require("../models/product.model");

const createProduct = async (req, res,) => {
  try {
    const file = req.file;
    console.log(file);
    
    let data = req.body;
    if (file) {
      data = {
        ...data,
        productFileName: file.filename,
        filePath: file.path,
        fileType: file.mimetype,
        fileOriginalName: file.originalFileName,
      };
    }
    console.log(data);
    
    const product = await productModel.create(data);
    console.log(product);

    res.status(200).json({
      product,
      message: "Product created successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};



module.exports = {
    createProduct,
} 