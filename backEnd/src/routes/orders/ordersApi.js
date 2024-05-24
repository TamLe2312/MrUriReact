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
  getChart,
  getOrderById,
  deleteOrderAdmin,
} = require("../../controller/orders/orders");
const Router = express.Router();

Router.get("/user/:id", getOrders);
Router.post("/getOrderById", getOrderById);
Router.get("/getAll", getAll);
Router.get("/chart", getChart);
Router.post("/edit/:id", editOrder);
Router.post("/editStatus", editStatus);
Router.post("/cancel", cancelOrder);
Router.post("/return", returnOrder);
Router.post("/delete", deleteOrder);
Router.post("/deleteAD/:id", deleteOrderAdmin);

module.exports = Router;
