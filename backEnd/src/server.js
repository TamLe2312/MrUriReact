const cors = require("cors");
const bodyParser = require("body-parser");
const usersApi = require("./routes/users/usersApi");
const cartsApi = require("./routes/carts/cartsApi");
const categoriesApi = require("./routes/categories/categoriesApi");
const productsApi = require("./routes/products/productsApi");
const ordersApi = require("./routes/orders/ordersApi");
const web = require("./routes/web");

const { app, server } = require("./socket/socket");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 8888;

app.use("/", web);
app.use("/users", usersApi);
app.use("/categories", categoriesApi);
app.use("/carts", cartsApi);
app.use("/products", productsApi);
app.use("/orders", ordersApi);

server.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});
