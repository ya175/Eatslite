const mongoose = require("mongoose");
const Menue = require("./menueModel");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  descreption: { type: String },
  //   location: {type:String},
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: { type: Date },
});

// restaurantSchema.pre("save", () => {
//   if (!this.isModified)this.updtaed = Date.now();
// });

restaurantSchema.virtual("menue", {
  ref: "Menue",
  localField: "_id",
  foreignField: "restaurant",
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
