require("dotenv").config();

const VNP_TMNCODE = process.env.VNP_TMNCODE;
const VNP_HASHSECRET = process.env.VNP_HASHSECRET;
const VNP_URL = process.env.VNP_URL;
const VNP_API = process.env.VNP_API;
const VNP_RETURNURL = process.env.VNP_RETURNURL;
const APP_URL = process.env.APP_URL;

module.exports = {
  VNP_TMNCODE,
  VNP_HASHSECRET,
  VNP_URL,
  VNP_API,
  VNP_RETURNURL,
  APP_URL,
};
