const AuthController = require("./../controllers/AuthController");
const paymentController = require("./../controllers/paymentController");
const express = require("express");

const Router = express.Router();

Router.use(AuthController.protect);

Router.get("/checkout_session/:orderId", paymentController.getCheckoutSession);

module.exports = Router;
