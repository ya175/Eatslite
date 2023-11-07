const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "user is required"],
  },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: "Restaurant",
    required: [true, "restaurant is required"],
  },
  // orderItems: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: "OrderItems",
  //   required: [true, "order is required"],
  // },
  products: [
    {
      menuId: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  status: {
    type: String,
    required: true,
    default: "pending",
  },
  price: {
    type: Number,
    required: [true, "order must have a price"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: { type: Date },
});

orderSchema.pre(/^find/, function (next) {
  this.populate("user").populate("restaurant");
  next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;


