const Order = require("./../models/orderModel");
const Menu = require("../models/menuModel");
const Cart = require("../models/cartModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const sendRes = (res, statusCode, status, data) => {
  res.status(statusCode).json({
    status: status,
    data: data,
  });
};

exports.placeOrder = catchAsync(async (req, res, next) => {
  //find cart
  const cartId = req.params.cartId;
  const cart = await Cart.findById(cartId);

  console.log(cart);

  const newOrder = await Order.create({
    price: cart.totalPrice,
    products: cart.products,
    user: cart.user,
    restaurant: cart.restaurant,
  });
  console.log();

  sendRes(res, 201, "success", newOrder);
});
exports.findOneOrderbID = catchAsync(async (req, res, next) => {
  const orderId = req.params.orderId;
  const order = await Order.findById(orderId);
  if (!order) return next(new AppError("not found", 401));
  sendRes(res, 200, "success", order);
});
