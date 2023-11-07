const Order = require("./../models/orderModel");
const Cart = require("../models/cartModel");
const Menu = require("../models/menuModel");

const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const sendRes = (res, statusCode, status, data) => {
  res.status(statusCode).json({
    status: status,
    data: data,
  });
};
//create
exports.addFirstItemToCart = catchAsync(async (req, res, next) => {
  const menu = await Menu.findById(req.params.menuId);
  const cart = await Cart.create({
    user: req.user.id,
    restaurant: req.params.restaurantId,
    products: [{ menuId: req.params.menuId, quantity: req.body.quantity }],
    totalPrice: req.body.quantity * menu.price,
  });

  sendRes(res, 201, "success", cart);
});
exports.findCartById = catchAsync(async (req, res, next) => {
  const cartId = req.params.cartId;
  const cart = await Cart.findById(cartId);
  if (!cart) {
    // return next(new AppError("not found", 401)); //??
    res.status(401).json({
      message: "cart not found",
      status: "success",
    });
  }
  sendRes(res, 201, "success", cart);
});

exports.deleteCart = catchAsync(async (req, res, next) => {
  await Cart.findByIdAndDelete(req.params.cartId);
  res.status(204).json({
    message: "Cart deleted successfully",
  });
});

//UPDATE MULTIPLE ITEMS
exports.updateCart = catchAsync(async (req, res, next) => {
  const cartId = req.params.cartId;
  const { items } = req.body; //array of products
  //find cart
  const cart = await Cart.findById(cartId);
  if (!cart) return next(new AppError("your cart is empty yet", 401));

  //find product
  for (const item of items) {
    const menuDoc = await Menu.findById(item.menuId);

    const productIndex = cart.products.findIndex(
      (menu) => menu.menuId === item.menuId
    );
    // 1- not existed and user need to add it  =>product index===-1

    // 2- existed and you need to remove it => productindex!==-1 && item.quantity===0

    // 3- existed an user just need to update the quantity increase or decrease  productindex!==-1 && item.quantity!==0

    //  1- updating cart cases => PRODUCT NOT EXISTEd === ADD NEW PRODUCT TO THE CART
    if (productIndex === -1) {
      cart.products.push({ menuId: item.menuId, quantity: item.quantity });
      console.log(cart.totalPrice);
      cart.totalPrice += item.quantity * menuDoc.price;
      console.log(cart.totalPrice);
    }
    //  1- updating cart cases => update item quantity
    else if (productIndex !== -1 && item.quantity === 0) {
      //delete th item from the array ///
      cart.totalPrice -= cart.products[productIndex].quantity * menuDoc.price; //-
      cart.products.splice(productIndex, 1);
      if (cart.products.length === 0) {
        await Cart.findByIdAndDelete(cartId);
        res.status(201).json({
          status: "success",
        });
      } else {
        cart.totalPrice -= cart.products[productIndex].quantity * menuDoc.price; //-
        cart.products[productIndex].quantity = item.quantity; //new quantity
        cart.totalPrice += item.quantity * menuDoc.price; // add new price of this item
      }
    }

    await cart.save();
    sendRes(res, 201, "success", cart);
  }
});
