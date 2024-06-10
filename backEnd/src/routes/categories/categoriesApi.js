const express = require("express");
const multer = require("multer");
const upload = multer();
const {
  getCategories,
  getParentCategories,
  deleteCategory,
  addCategory,
  getProducts,
  editCategory,
  relatedCategories,
  relatedCategoriesDetail,
  categoriesProductView,
  getProductCategories,
} = require("../../controller/categories/categories");

const Router = express.Router();

Router.get("/", getCategories);
Router.get("/productCategories", getProductCategories);
Router.post("/add", upload.none(), addCategory);
Router.get("/parent-categories", getParentCategories);
Router.delete("/delete/:id", deleteCategory);
Router.put("/edit/:id", upload.none(), editCategory);
Router.post("/products", getProducts);
Router.get("/relatedCategories/:id", relatedCategories);
Router.get("/relatedCategoriesDetail/", relatedCategoriesDetail);
Router.post("/productView", categoriesProductView);

module.exports = Router;
