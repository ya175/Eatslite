const express = require("express");

const restaurantController = require("./../controllers/restaurantController");
const authController = require("./../controllers/AuthController");
const Router = express.Router();

const images = require("./../utils/images");

// Router.use(authController.protect);

Router.route("/")
  .post(
    // authController.restrictedTo("admin"),
    images.uploadeImage,
    restaurantController.createRestaurant
  )
  .get(restaurantController.getAllRestaurants);

Router.route("/:restaurantId")
  .get(restaurantController.getOneById)
  .patch(
    authController.restrictedTo("admin"),
    restaurantController.updateRestaurant
  );
module.exports = Router;
