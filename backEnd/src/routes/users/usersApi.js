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
  deleteUser,
  addUser,
  editUser,
  editProfile,
  editPassword,
} = require("../../controller/users/users");
const Router = express.Router();

Router.get("/", getUsers);
Router.get("/user/:id", getUserById);
Router.post("/verifyToken", verifyToken);
Router.post("/add", addUser);
Router.post("/profile", editProfile);
Router.post("/profilePassword", editPassword);
Router.post("/edit", editUser);
Router.delete("/delete/:id", deleteUser);
Router.post("/sign-in", upload.none(), signIn);
Router.post("/sign-up", upload.none(), signUp);
Router.post("/forgot-password", upload.none(), forgotPassword);
Router.post("/verify-token", upload.none(), verifyTokenPassword);

module.exports = Router;
