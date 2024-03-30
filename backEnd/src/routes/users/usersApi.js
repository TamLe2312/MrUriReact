const express = require("express");
const { getUsers } = require("../../controller/users/users");

const Router = express.Router();

Router.get("/", getUsers);

module.exports = Router;
