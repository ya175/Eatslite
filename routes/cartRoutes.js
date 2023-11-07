const AuthController = require("./../controllers/AuthController");
const cartController = require("./../controllers/cartController");
const express = require("express");

const Router = express.Router();
Router.use(AuthController.protect);

//CART
Router.route("/:restaurantId/:menuId").post(cartController.addFirstItemToCart);

Router.route("/:cartId")
  .get(cartController.findCartById)
  .patch(cartController.updateCart);

module.exports = Router;
