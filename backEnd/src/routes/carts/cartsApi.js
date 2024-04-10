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
} = require("../../controller/carts/carts");
const Router = express.Router();

Router.get("/", getCarts);
Router.get("/:id", getCartById);
Router.post("/changeQuantity", changeQuantity);
Router.post("/add", addCart);
Router.post("/check-out", upload.none(), checkOut);
Router.delete("/delete/:id", deleteCart);
Router.delete("/clear/:id", clearCart);

module.exports = Router;
