const express = require("express");
const {
  getProducts,
  addProducts,
  viewProducts,
  viewDetail,
  viewDetailImgs,
  getProductById,
  productViewById,
  relatedProducts,
  relatedProductsDetail,
  redirectCategory,
  editProduct,
  editImage,
  deleteProduct,
  searchProducts,
  viewProductsByCategory,
  featureProduct,
  getVariants,
  getStock,
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
Router.post("/product/:id", getProductById);
Router.get("/relatedProducts/:id", relatedProducts);
Router.get("/relatedProductsDetail/:id", relatedProductsDetail);
Router.get("/viewByCategory/:id", viewProductsByCategory);
Router.get("/view", viewProducts);
Router.post("/featureProduct", featureProduct);
Router.get("/view/:id", productViewById);
Router.get("/getVariant/:id", getVariants);
Router.get("/search/:value", searchProducts);
Router.get("/viewDetail/:id", viewDetail);
Router.get("/viewDetailImgs/:id", viewDetailImgs);
Router.get("/redirectCategory/:id", redirectCategory);
Router.post("/add", upload.array("images"), addProducts);
Router.post("/editInformation", upload.none(), editProduct);
Router.post("/delete", deleteProduct);
Router.get("/getStock", getStock);
Router.post("/editImage", upload.array("images"), editImage);

module.exports = Router;
