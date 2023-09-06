const AppError = require("./../utils/AppError");
const Menue = require("./../models/menueModel");
const catchAsync = require("./../utils/catchAsync");
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
  const newMenue = await Menue.create(req.body);

  sendRes(res, 200, "success", newMenue);
});

exports.getOneMenubyID = catchAsync(async (req, res, next) => {
  const menue = await Menue.findById(req.params.menueId);
  if (!menue) return next(new AppError("no menue found", 404));
  sendRes(res, 200, "success", menue);
});

exports.getAll = catchAsync(async (req, res, next) => {
  const menues = await Menue.find();
  if (!menues) return next(new AppError("no menues found", 404));
  sendRes(res, 200, "success", menues);
});

exports.updateMenue = catchAsync(async (req, res, next) => {
  if (!req.params.menueId)
    return next(new AppError("You must provide the menue id"));

  const updatedMenue = await Menue.findByIdAndUpdate(
    req.params.menueId,
    req.body,
    {
      new: true,
    }
  );

  if (!updatedMenue) return next(new AppError("this mneue is not found", 404));
  sendRes(res, 200, "success", updatedMenue);
});
