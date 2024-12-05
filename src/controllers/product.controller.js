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

const getProduct = async (req, res,) => {
  try {
    let findProduct = await productModel.find();
    // if (findProduct.length === 0) {
    //   res.status(404).json({message: "No product found"});
    // }
    findProduct = [
      ...findProduct
    ]
    console.log(findProduct);
    
    res.status(200).json({
      findProduct,
    })
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}



module.exports = {
    createProduct,
    getProduct
} 