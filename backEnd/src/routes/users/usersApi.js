const express = require("express");
const multer = require("multer");
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
  getSlide,
  addSlide,
  deleteSlide,
  getSlideById,
  editSlide,
  handleLoginGoogle,
  verifyGoogle,
  addressForm,
  addComment,
  viewComment,
  isAddress,
  viewCommentById,
  deleteComment,
} = require("../../controller/users/users");
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

Router.get("/", getUsers);
Router.get("/user/:id", getUserById);
Router.get("/getAddress/:id", isAddress);
Router.get("/slider", getSlide);
Router.post("/google", handleLoginGoogle);
Router.post("/verifyGoogle", verifyGoogle);
Router.post("/address", upload.none(), addressForm);
Router.get("/getSlide/:id", getSlideById);
Router.post("/edit/slide", upload.single("image"), editSlide);
Router.delete("/deleteSlide/:id", deleteSlide);
Router.post("/addSlide", upload.single("image"), addSlide);
Router.post("/verifyToken", verifyToken);
Router.post("/add", addUser);
Router.post("/comment", addComment);
Router.get("/comment/:id", viewCommentById);
Router.delete("/deleteComment/:id", deleteComment);
Router.get("/viewComment/:id", viewComment);
Router.post("/profile", editProfile);
Router.post("/profilePassword", editPassword);
Router.post("/edit", editUser);
Router.delete("/delete/:id", deleteUser);
Router.post("/sign-in", upload.none(), signIn);
Router.post("/sign-up", upload.none(), signUp);
Router.post("/forgot-password", upload.none(), forgotPassword);
Router.post("/verify-token", upload.none(), verifyTokenPassword);

module.exports = Router;
