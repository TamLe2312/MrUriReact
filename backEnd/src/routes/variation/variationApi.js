const express = require("express");
const multer = require("multer");
const {
  viewVariations,
  addVariation,
  deleteVariation,
  getVariationById,
  editVariation,
  viewVariationValues,
  addVariationValue,
  getVariationValueById,
} = require("../../controller/variation/variation");
const Router = express.Router();

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

Router.get("/", viewVariations);
Router.get("/value", viewVariationValues);
Router.post("/value/add", addVariationValue);
Router.post("/add", addVariation);
Router.post("/edit", editVariation);
Router.get("/value/getById/:id", getVariationValueById);
Router.get("/getById/:id", getVariationById);
Router.delete("/delete/:id", deleteVariation);

module.exports = Router;
