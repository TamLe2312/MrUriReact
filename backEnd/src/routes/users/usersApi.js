const express = require("express");
const multer = require("multer");
const upload = multer();
const {
  getUsers,
  signIn,
  signUp,
  verifyToken,
} = require("../../controller/users/users");
const Router = express.Router();

Router.get("/", getUsers);
Router.post("/verifyToken", verifyToken);
Router.post("/sign-in", upload.none(), signIn);
Router.post("/sign-up", upload.none(), signUp);

module.exports = Router;
