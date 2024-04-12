const express = require("express");
const multer = require("multer");
const upload = multer();
const {
  getOrders,
  editOrder,
  cancelOrder,
  returnOrder,
  deleteOrder,
  getAll,
  editStatus,
} = require("../../controller/orders/orders");
const Router = express.Router();

Router.get("/user/:id", getOrders);
Router.get("/getAll", getAll);
Router.post("/edit/:id", editOrder);
Router.post("/editStatus", editStatus);
Router.post("/cancel", cancelOrder);
Router.post("/return", returnOrder);
Router.post("/delete", deleteOrder);

module.exports = Router;
