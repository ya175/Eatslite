const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");

//Router
const userRouter = require("./routes/userRoutes");
const restaurantRouter = require("./routes/restaurantRoutes");
const menueRouter = require("./routes/menueRoutes");

app.use(express.json()); //parse req.body

app.use("/api/users", userRouter);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/menues", menueRouter);
//handle unfound routes
app.all("*", (req, res, next) => {
  next(new AppError(`can not find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
