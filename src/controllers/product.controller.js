const { productModel } = require("../models/product.model");
const fs = require("fs");

const createProduct = async (req, res) => {
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

const getProduct = async (req, res) => {
  try {
    let findProduct = await productModel.find();
    findProduct = [...findProduct];
    // console.log(findProduct);

    res.status(200).json({
      findProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};



const getProductById = async (req, res) => {
  try {
    const { _id } = req.query
    console.log(_id);
    
    let findProduct = await productModel.findById({_id:_id});
    if (!findProduct) {
      res.status().json({ message: "Product not found" });
    }
    console.log(findProduct);
    
    res.status(200).json({findProduct})
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}

const updateProduct = async (req, res) => {
  try {
    let { _id } = req.query;
    let newFile = req.file;
    
    let data = {
      ...req.body,
    };
    console.log(data);
    
    if (newFile) {
      const oldFile = await productModel.findById({_id:_id});
      console.log(oldFile);
      
      if (!oldFile) {
        return res.status(404).json({ message: "Data Not Found" });
      }
      fs.unlinkSync(`${oldFile.filePath}`);

      data.productFileName = newFile.filename;
      data.filePath = newFile.path;
      data.fileType = newFile.mimetype;
    }

    const updateProduct = await productModel.findByIdAndUpdate({_id:_id}, data, {new: true})
    res.json({
      updateProduct,
      message: "Product updated successfully",
    })

  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  getProductById,
};
