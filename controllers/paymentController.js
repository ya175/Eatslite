const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const AppError = require("../utils/AppError");
const Menu = require("../models/menuModel");
const Order = require("./../models/orderModel");
const Cart = require("../models/cartModel");
const catchAsync = require("../utils/catchAsync");

exports.addStripeProduct = catchAsync(async (req, res, next) => {
  req.stripe_product = await stripe.products.create({
    name: req.body.name,
    default_price_data: {
      unit_amount: req.body.price * 100,
      currency: "usd",
      recurring: {
        interval: "month",
      },
    },
    expand: ["default_price"],
  });

  next();
});

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1- find  order
  const order = await Order.findById(req.params.orderId);
  const products = order.products;
  //2-build line items
  let line_items = [];
  for (const product of products) {
    // 2-1find menu
    const menu = await Menu.findById(product.menuId);
    //2-2 build line items
    line_items.push({
      price: menu.priceStripeId,
      quantity: product.quantity,
    });

    console.log(product);
  }
  console.log(line_items);

  // 3-create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/)`,
    cancel_url: `${req.protocol}://${req.get("host")}/`,
    customer_email: req.user.email,
    client_reference_id: req.params.orderId,
    line_items: line_items,

    mode: "subscription", // !!? "subscription payment one time
  });

  // 4-send res
  res.status(200).json({
    status: "success",
    session,
  });
});
