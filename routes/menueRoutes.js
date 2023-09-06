const express = require("express");
const Router = express.Router();

const menueController = require("./../controllers/menueController");
const AuthController = require("./../controllers/AuthController");

Router.route("/:restaurantId").post(
  AuthController.protect,
  AuthController.restrictedTo("admin"),
  menueController.createMenue
);
Router.route("/:menueId")
  .get(menueController.getOneMenubyID)
  .patch(menueController.updateMenue);

Router.route("/").get(menueController.getAll);

module.exports = Router;
