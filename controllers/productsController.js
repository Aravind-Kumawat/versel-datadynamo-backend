import Product from "../models/Product.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.vendor.vendorId });
    res.status(200).json(products);
  } catch (error) {
    console.log("Error in getAllProducts", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      vendor: req.vendor.vendorId,
    });
    if (!product) return res.status(404).json({ message: "Product not found!" });
    res.status(200).json(product);
  } catch (error) {
    console.log("Error in getProductById!", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { productName, price,costPrice, supplier } = req.body;
    const product = await Product.findOne({
      productName,
      vendor: req.vendor.vendorId,
    });
    if (product) {
      product.quantity += 1;
      const savedProduct = await product.save();
      return res.status(201).json({message: "Product created successfully!",savedProduct});
    } else {
      const product = new Product({
        productName,
        price,
        costPrice,
        supplier,
        vendor: req.vendor.vendorId,
      });
      product.quantity += 1;
      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    }
  } catch (error) {
    console.log("Error in createProduct!", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productName, quantity, price, costPrice, supplier } = req.body;
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, vendor: req.vendor.vendorId },
      { productName, quantity, price, supplier }
    );
    if (!product) return res.status(404).json({ message: "Product not found!" });
    res.status(200).json({message: "Product updated successfully!", product});
  } catch (error) {
    console.log("Error in updateProduct!", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      vendor: req.vendor.vendorId,
    });
    if (!product) return res.status(404).json({ message: "Product not found!" });
    res.status(200).json("Product deleted successfully!");
  } catch (error) {
    console.log("Error in deleteProduct!", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
