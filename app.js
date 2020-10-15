const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const Index_route = require("./src/index");
const bodyParser = require("body-parser");
//const hbs = require("hbs");

const app = express();
//Database Connection
mongoose.connect(
  "mongodb+srv://Hyperquest:HyperquestServer@hyperquest-db.7k7z1.mongodb.net/Hyperquest?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected");
});

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
app.use("/", Index_route);

//app.set("views", path.join(__dirname, "src/views"));
//app.set("view engine", "hbs");

app.listen(5000, () => {
  console.log("Server is running on port 5000...");
});

module.exports = app;
