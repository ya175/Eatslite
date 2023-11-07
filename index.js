const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");
const fileupload = require("express-fileupload");

//Router
const userRouter = require("./routes/userRoutes");
const restaurantRouter = require("./routes/restaurantRoutes");
const menuRouter = require("./routes/menuRoutes");
const orderRouter = require("./routes/orderRoutes");
const cartRouter = require("./routes/cartRoutes");
const paymentRouter = require("./routes/paymentRoutes");

var cors = require("cors");
app.use(fileupload({ useTempFiles: true }));

app.use(express.json()); //parse req.body
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/menus", menuRouter);
app.use("/api/orders", orderRouter);
app.use("/api/carts", cartRouter);
app.use("/api/payments", paymentRouter);

//handle unfound routes
app.all("*", (req, res, next) => {
  next(new AppError(`can not find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
