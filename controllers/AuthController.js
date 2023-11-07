const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const createToken = (userId) => {
  // console.log(process.env);
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000,
    // expiresIn: "90d",
  });
};
const createSendToken = (res, statusCode, user) => {
  const token = createToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      // Date.now() + 90 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV == "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  console.log("💥💥");
  console.log(token);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token: token,
    user: user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const newUser = await User.create({
    fName: req.body.fName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  console.log("signed-up");

  createSendToken(res, 200, newUser);
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1-check if email and password exist
  if (!email || !password)
    return next(new AppError("invalid email or password", 404));

  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  console.log(email);
  console.log(password);
  if (!user || !(await user.correctMyPassword(password, user.password)))
    return next(new AppError("invalid email or password", 404));
  //login user
  createSendToken(res, 200, user);
});

// exports.login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     //1-check if email and password exist
//     if (!email || !password)
//       return next(new AppError("invalid email or password", 404));

//     const user = await User.findOne({ email: req.body.email }).select(
//       "+password"
//     );
//     console.log(email);
//     console.log(password);
//     if (!user || !(await user.correctMyPassword(password, user.password)))
//       return next(new AppError("invalid email or password", 404));
//     //login user
//     createSendToken(res, 200, user);
//   } catch (err) {
//     next(new AppError("invalid email or password", 404));
//   }
// };

exports.protect = catchAsync(async (req, res, next) => {
  //get the token
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookie.jwt) {
    token = req.cookie.jwt;
  } else if (!token) return next(new AppError("you are not logged in"), 401);

  console.log(token);

  //verify Token
  //if the token was modified or has been expired
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  if (!decodedToken) return next(new AppError("you are not logdedin", 401));
  console.log("💨💨");
  console.log(decodedToken);
  //find user
  const currentUser = await User.findById(decodedToken.userId);
  if (!currentUser)
    return next(new AppError("this user is no more allowed", 401));
  console.log(currentUser);
  //check if password was updated

  req.user = currentUser;
  next();
});

exports.restrictedTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role))
      return next(new AppError("you are not allowed to do this action", 401));
    next();
  };
};
