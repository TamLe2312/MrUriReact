const express = require("express");
const cors = require("cors");
const usersApi = require("./routes/users/usersApi");
const productsApi = require("./routes/products/productsApi");
const web = require("./routes/web");

const app = express();
app.use(cors());

const port = process.env.PORT || 8888;

app.use("/", web);
app.use("/users", usersApi);
app.use("/products", productsApi);

app.listen(port, () => {
  console.log("Listening");
});
