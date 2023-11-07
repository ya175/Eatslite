const AppError = require("../utils/AppError");
const Menu = require("../models/menuModel");
const catchAsync = require("../utils/catchAsync");
const sendRes = (res, statusCode, status, data) => {
  res.status(statusCode).json({
    status: status,
    data: data,
  });
};

exports.createMenue = catchAsync(async (req, res, next) => {
  if (!req.params.restaurantId)
    return next(new AppError("restaurant id is required", 400));
  req.body.restaurant = req.params.restaurantId;
  console.log(req.body.restaurant);
  req.body.priceStripeId = req.stripe_product.default_price.id;

  const newMenue = await Menu.create(req.body);

  sendRes(res, 200, "success", newMenue);
});

exports.getOneMenubyID = catchAsync(async (req, res, next) => {
  const menu = await Menu.findById(req.params.menuId);
  if (!menu) return next(new AppError("no menu found", 404));
  sendRes(res, 200, "success", menu);
});

exports.getAll = catchAsync(async (req, res, next) => {
  const menues = await Menu.find();
  if (!menues) return next(new AppError("no menues found", 404));
  console.log(menues);

  //build the query

  //-------FILTER--------
  console.log("💥💥💥");
  const querObj = { ...req.query };
  console.log(querObj);
  const excludedFields = ["page", "limit", "sort"];

  excludedFields.forEach((el) => delete querObj[el]);
  console.log(querObj);
  let queryStr = JSON.stringify(querObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  console.log(queryStr);

  let query = Menu.find(JSON.parse(queryStr));
  //---------SORT-----
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    console.log(sortBy);
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // console.log(sortBy);

  //------LIMIT FIELDS projection => select only some fields and execlude others----
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields); //query.select('name price')
  } else {
    query = query.select("-__v  -createdAt");
  }

  // pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 20;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  if (req.query.page) {
    const docNum = await Restaurant.countDocuments();
    if (skip > docNum) return next(new AppError("not found ", 404));
  }
  //------execute query-----
  const menus = await query;
  sendRes(res, 200, "success", menus);
});

// exports.getAll = catchAsync(async (req, res, next) => {
//   const menues = await Menu.find();
//   if (!menues) return next(new AppError("no menues found", 404));
//   console.log(menues);
//   sendRes(res, 200, "success", menues);
// });

exports.updateMenue = catchAsync(async (req, res, next) => {
  if (!req.params.menueId)
    return next(new AppError("You must provide the menu id"));

  const updatedMenue = await Menu.findByIdAndUpdate(
    req.params.menueId,
    req.body,
    {
      new: true,
    }
  );

  if (!updatedMenue) return next(new AppError("this mneue is not found", 404));
  sendRes(res, 200, "success", updatedMenue);
});

exports.deleteMenue = catchAsync(async (req, res, next) => {
  if (!req.params.menueId)
    return next(new AppError("You must provide the id", 404));
  const deletedMenue = await Menu.findOneAndDelete(req.params.menueId);
  res.status(201).json({
    status: "success",
  });
});
