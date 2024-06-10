const express = require("express");
const multer = require("multer");
const upload = multer();
const {
  getCarts,
  addCart,
  getCartById,
  changeQuantity,
  deleteCart,
  checkOut,
  clearCart,
  vnpayReturn,
} = require("../../controller/carts/carts");
const Router = express.Router();

Router.get("/", getCarts);
Router.get("/cart/:id", getCartById);
Router.post("/changeQuantity", changeQuantity);
Router.post("/add", addCart);
Router.post("/check-out", upload.none(), checkOut);
Router.post("/vnpay-return", upload.none(), vnpayReturn);
Router.post("/delete", deleteCart);
Router.delete("/clear/:id", clearCart);

module.exports = Router;
