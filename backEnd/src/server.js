const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const usersApi = require("./routes/users/usersApi");
const cartsApi = require("./routes/carts/cartsApi");
const productsApi = require("./routes/products/productsApi");
const web = require("./routes/web");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 8888;

app.use("/", web);
app.use("/users", usersApi);
app.use("/carts", cartsApi);
app.use("/products", productsApi);

app.listen(port, () => {
  console.log("Listening");
});
