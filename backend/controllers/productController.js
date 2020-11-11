import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

//@route        GET /api/products
//@description  Fetch all products
//@access       public
const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const products = await Product.find({ ...keyword });

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

//@route        POST /api/products/:id/reviews
//@description  Create a product review
//@access       Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Already Reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, cur) => acc + cur.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201);
    res.json({ message: 'Review Added' });
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
  createProductReview,
};
