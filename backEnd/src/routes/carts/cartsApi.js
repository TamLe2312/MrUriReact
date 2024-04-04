const express = require("express");
const multer = require("multer");
const upload = multer();
const {
  getCarts,
  addCart,
  getCartById,
  changeQuantity,
  deleteCart,
} = require("../../controller/carts/carts");
const Router = express.Router();

Router.get("/", getCarts);
Router.get("/:id", getCartById);
Router.post("/changeQuantity", changeQuantity);
Router.post("/add", addCart);
Router.delete("/delete/:id", deleteCart);

module.exports = Router;
