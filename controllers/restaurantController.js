const Restaurant = require("./../models/restaurantModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/AppError");

const sendRes = (res, statusCode, status, data) => {
  res.status(statusCode).json({
    length: data.length,
    status: status,
    data: data,
  });
};

exports.createRestaurant = catchAsync(async (req, res, next) => {
  const newRestaurant = await Restaurant.create(req.body);
  sendRes(res, 201, "success", newRestaurant);
});

exports.getAllRestaurants = catchAsync(async (req, res, next) => {
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

  let query = Restaurant.find(JSON.parse(queryStr));
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
  const restaurants = await query;
  sendRes(res, 200, "success", restaurants);
});

exports.updateRestaurant = catchAsync(async (req, res, next) => {
  console.log(req.params.restaurantId);
  const updtaedRestaurants = await Restaurant.findByIdAndUpdate(
    req.params.restaurantId,
    req.body,
    { new: true }
  );
  if (!updtaedRestaurants)
    return next(new AppError("no restaurant found", 404));
  sendRes(res, 200, "success", updtaedRestaurants);
});

exports.getOneById = catchAsync(async (req, res, next) => {
  Restaurant.findById;
  const restaurant = await Restaurant.findById(
    req.params.restaurantId
  ).populate("menu");
  console.log(restaurant);
  console.log(req.params.restaurantId);
  // .select('-_id');
  if (!restaurant) return next(new AppError("no restaurant found", 404));

  sendRes(res, 200, "success", restaurant);
});
