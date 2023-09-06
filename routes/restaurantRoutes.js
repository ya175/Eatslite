const express = require("express");

const restaurantController = require("../controllers/restaurantController");
const authController = require("./../controllers/AuthController");
const Router = express.Router();

Router.route("/")
  .post(restaurantController.createRestaurant)
  .get(authController.protect, restaurantController.getAllRestaurants);

Router.route("/:restaurantId")
  .get(restaurantController.getOneById)
  .patch(restaurantController.updateRestaurant);
module.exports = Router;
