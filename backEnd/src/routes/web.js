const express = require("express");
const { getHomepage } = require("../controller/homeController");
const Router = express.Router();

Router.get("/", getHomepage);

module.exports = Router;
