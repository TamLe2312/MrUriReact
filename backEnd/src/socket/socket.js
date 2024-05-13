const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const connection = require("../config/database");

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("a new connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;
  io.emit("getOnlineUser", Object.keys(userSocketMap));

  socket.on("add_product", async () => {
    try {
      const products = await fetchProducts();
      io.emit("update_products", products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  });
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUser", Object.keys(userSocketMap));
  });
});

const fetchProducts = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT products.id,
      products.product_name,
      products.selling_price,
      products.status,
      GROUP_CONCAT(images.image_name) AS images FROM products INNER JOIN images ON products.id = images.product_id 
      GROUP BY
      products.id`;
    connection.query(sql, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      if (data.length > 0) {
        const transformedData = data.map((item) => {
          const productName = item.product_name
            .replace(/_/g, " ")
            .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());

          return {
            ...item,
            product_name: productName,
          };
        });
        resolve(transformedData);
      } else {
        reject("No products found");
      }
    });
  });
};

module.exports = { app, io, server };
