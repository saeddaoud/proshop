import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

//@route        GET /api/products
//@description  Fetch all products
//@access       public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

//@route        GET /api/products/:id
//@description  Fetch a product by id
//@access       public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

//@route        DELETE /api/products/:id
//@description  Delete product by id
//@access       Private/Amin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: 'Product has been removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export { getProductById, getProducts, deleteProduct };
