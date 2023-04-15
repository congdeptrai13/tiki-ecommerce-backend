const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserController = require("./controllers/UserController");
const bodyParser = require('body-parser')

const { urlencoded } = require("body-parser");
const ProductController = require("./controllers/ProductController");
const OrderController = require("./controllers/OrderComponent");
require("dotenv").config();
mongoose.set('strictQuery', false);

const app = express();
const port = process.env.PORT || 3001
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//connect db
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connect db success")
  })
  .catch((err) => {
    console.log(err)
  })

//route
app.use("/api/user", UserController)
app.use("/api/product", ProductController)
app.use("/api/order", OrderController)
app.listen(port, () => {
  console.log(`example app listening on port ${port}`)
})