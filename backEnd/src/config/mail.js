require("dotenv").config();

const HOST = process.env.MAIL_HOST;
const PORT = process.env.MAIL_PORT;
const USERNAME = process.env.MAIL_USERNAME;
const PASSWORD = process.env.MAIL_PASSWORD;
const FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS;

module.exports = {
  HOST,
  PORT,
  USERNAME,
  PASSWORD,
  FROM_ADDRESS,
};
