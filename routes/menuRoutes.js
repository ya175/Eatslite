const express = require("express");
const Router = express.Router();

const menuController = require("../controllers/menuController");
const AuthController = require("../controllers/AuthController");
const paymentController = require("../controllers/paymentController");

const images = require("../utils/images");
Router.route("/").get(menuController.getAll);

Router.use(AuthController.protect);

Router.route("/:restaurantId").post(
  AuthController.restrictedTo("admin"),
  images.uploadeImage,
  paymentController.addStripeProduct,
  menuController.createMenue
);
Router.route("/:menuId")
  .get(menuController.getOneMenubyID)
  .patch(AuthController.restrictedTo("admin"), menuController.updateMenue)
  .delete(AuthController.restrictedTo("admin"), menuController.deleteMenue);

module.exports = Router;
