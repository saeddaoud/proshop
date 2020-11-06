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

//@route        POST /api/products
//@description  Create a product
//@access       Private/Amin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    user: req.user._id,
    price: 0,
    numReviews: 0,
    countInStock: 0,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    description: 'Sample description',
    category: 'Sample category',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

//@route        PUT /api/products/:id
//@description  Update a product
//@access       Private/Amin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    category,
    description,
    brand,
    countInStock,
    image,
  } = req.body;

  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name;
    product.price = price;
    product.category = category;
    product.description = description;
    product.countInStock = countInStock;
    product.image = image;
    product.brand = brand;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export {
  getProductById,
  getProducts,
  deleteProduct,
  createProduct,
  updateProduct,
};
