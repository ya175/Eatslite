const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const menuSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.ObjectId,
      ref: "Restaurant",
      required: [true, "please enter the restaurant"],
    },
    name: {
      type: String,
      required: [true, "please enter the name"],
    },

    image: {
      type: String,
    },
    price: { type: Number, required: [true, "please enter the price"] },
    descreption: {
      type: String,
    },
    priceStripeId: {
      type: String,
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date },
    image: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

menuSchema.pre(/^find/, function (next) {
  this.populate({
    path: "restaurant",
    select: "name ",
  });
  next();
});

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
// 300 redirect
