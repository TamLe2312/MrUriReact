const express = require("express");
const multer = require("multer");
const upload = multer();
const {
  getOrders,
  editOrder,
  cancelOrder,
  returnOrder,
  deleteOrder,
} = require("../../controller/orders/orders");
const Router = express.Router();

Router.get("/:id", getOrders);
Router.post("/edit/:id", editOrder);
Router.post("/cancel", cancelOrder);
Router.post("/return", returnOrder);
Router.post("/delete", deleteOrder);

module.exports = Router;
