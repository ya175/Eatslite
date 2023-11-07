const mongoose = require("mongoose");

//Cart

const cartSchema = new mongoose.Schema({
  // quantity: {
  //   type: Number,
  //   required: true,
  // },
  // menu: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Menu",
  // },
  totalPrice: { type: Number },
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: "Restaurant",
    required: [true, "user is required"],
  },
  products: [
    {
      menuId: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "user is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: { type: Date },
});

cartSchema.pre("find", async (next) => {
  //calcTotalPrice
  let totalPrice = 0;
  const items = this.products;
  for (const item of items) {
    const product = await Menu.findById(item.menuId);
    console.log(item.quantity);
    console.log(product);
    totalPrice += item.quantity * product.price;
  }
  this.totalPrice = totalPrice;
  await this.save();
  console.log(totalPrice);
  next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
