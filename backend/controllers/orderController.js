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

//@route        PUT /api/orders/:id/pay
//@description  Update order by id to paid
//@access       Private
const orderUpdateToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    // order.paymentResult = {
    //   id: req.body.id,
    //   status: req.body.status,
    //   update_time: req.body.update_time,
    //   email_address: req.body.payer.email_address,
    // };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order no Found');
  }
});

//@route        PUT /api/orders/:id/deliver
//@description  Update order by id to delivered
//@access       Private/Admin
const orderUpdateToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order no Found');
  }
});

//@route        GET /api/orders/myorders
//@description  Get logged in user's orders
//@access       Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  res.json(orders);
});

//@route        GET /api/orders
//@description  Get all orders
//@access       Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');

  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  orderUpdateToPaid,
  orderUpdateToDelivered,
  getMyOrders,
  getOrders,
};
