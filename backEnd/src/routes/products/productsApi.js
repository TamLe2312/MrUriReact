const express = require("express");
const {
  getProducts,
  addProducts,
  viewProducts,
  viewDetail,
  viewDetailImgs,
  getProductById,
  productViewById,
} = require("../../controller/products/products");

const Router = express.Router();

const multer = require("multer");

//Upload Files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

Router.get("/", getProducts);
Router.get("/product/:id", getProductById);
Router.get("/view/:id", productViewById);
Router.get("/view", viewProducts);
Router.get("/viewDetail/:id", viewDetail);
Router.get("/viewDetailImgs/:id", viewDetailImgs);
Router.post("/add", upload.array("images"), addProducts);

module.exports = Router;
