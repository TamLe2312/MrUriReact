const express = require("express");
const multer = require("multer");
const upload = multer();
const {
  getUsers,
  signIn,
  signUp,
  verifyToken,
  getUserById,
  forgotPassword,
  verifyTokenPassword,
} = require("../../controller/users/users");
const Router = express.Router();

Router.get("/", getUsers);
Router.get("/user/:id", getUserById);
Router.post("/verifyToken", verifyToken);
Router.post("/sign-in", upload.none(), signIn);
Router.post("/sign-up", upload.none(), signUp);
Router.post("/forgot-password", upload.none(), forgotPassword);
Router.post("/verify-token", upload.none(), verifyTokenPassword);

module.exports = Router;
