const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const menueSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: "Restaurant",
    required: [true, "please enter the restaurant"],
  },
  name: {
    type: String,
    required: [true, "please enter the name"],
  },
  price: { type: Number, required: [true, "please enter the price"] },
  descreption: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date },
});

const Menue = mongoose.model("Menue", menueSchema);
module.exports = Menue;
