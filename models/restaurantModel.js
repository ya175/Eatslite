const mongoose = require("mongoose");
const Menu = require("./menuModel");

const restaurantSchema = new mongoose.Schema(
  {
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
    image: {
      type: String,
    },
    //child Refernecing  => insted use virtual poplulation
    // menues: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: Menue,
    //   },
    // ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// restaurantSchema.pre("save", () => {
//   if (!this.isModified)this.updtaed = Date.now();
// });

restaurantSchema.virtual("menu", {
  ref: "Menu",
  foreignField: "restaurant",
  localField: "_id",
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
