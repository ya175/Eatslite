const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./index");
const mongoose = require("mongoose");

const server = app.listen(process.env.PORT, (err) => {
  console.log(`listening on port${process.env.PORT}`);
});

mongoose
  .connect("mongodb://127.0.0.1:27017/eatsLite", {
    dbName: "eatsLite",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connections succifuly created");
  });
