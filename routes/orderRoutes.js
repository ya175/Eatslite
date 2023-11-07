const AuthController = require("./../controllers/AuthController");
const orderController = require("./../controllers/orderController");
const paymentController = require("./../controllers/paymentController");
const express = require("express");

const Router = express.Router();
Router.use(AuthController.protect);

//orders
Router.route("/:cartId").post(orderController.placeOrder);
Router.route("/:orderId").get(orderController.findOneOrderbID);

module.exports = Router;
