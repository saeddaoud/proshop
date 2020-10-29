import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

//@route        POST /api/orders
//@description  Create a new order
//@access       Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order Items');
    return;
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

//@route        GET /api/orders/:id
//@description  Get order by id
//@access       Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  ); //add the username and email associalted with this order from the user model

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order no Found');
  }
});

export { addOrderItems, getOrderById };
