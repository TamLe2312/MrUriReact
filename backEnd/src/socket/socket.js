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

let activeUsers = [];
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  const userExists = activeUsers.some((user) => user.userId === userId);
  if (!userExists) {
    activeUsers.push({
      userId: userId,
      socketId: socket.id,
    });
    console.log("a new connected", activeUsers);
  }

  io.emit("getOnlineUser", activeUsers);

  socket.on("add_product", async () => {
    try {
      const products = await fetchFS();
      io.emit("update_products", products);
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("add_address", async (data) => {
    const { userId, address, phoneNumber, provinces, districts, wards } = data;
    try {
      const addressComplete = await fetchAddress(userId);
      const user = activeUsers.find((user) => user.userId == userId);
      if (user) {
        io.to(user.socketId).emit("update_address", {
          addressComplete,
          address: address,
          phoneNumber: phoneNumber,
          provinces: provinces,
          districts: districts,
          districts: districts,
          wards: wards,
        });
      }
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("delete_product", async () => {
    try {
      const products = await fetchFS();
      io.emit("update_products", products);
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("add_slider", async () => {
    try {
      const sliders = await fetchSliders();
      io.emit("update_slider", sliders);
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("edit_slider", async () => {
    try {
      const sliders = await fetchSliders();
      io.emit("update_slider", sliders);
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("delete_slider", async () => {
    try {
      const sliders = await fetchSliders();
      io.emit("update_slider", sliders);
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("fs_product", async () => {
    try {
      const products = await fetchFS();
      io.emit("update_fs", products);
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    const index = activeUsers.findIndex((user) => user.socketId === socket.id);
    if (index !== -1) {
      activeUsers.splice(index, 1);
    }
    io.emit("getOnlineUser", activeUsers);
  });
});

const fetchFS = (req, res) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
    products.id,
    products.product_name,
    GROUP_CONCAT(DISTINCT images.image_name) AS images,
    GROUP_CONCAT(DISTINCT productDetail.selling_price) AS selling_price
FROM 
    products
INNER JOIN 
    images ON products.id = images.product_id
INNER JOIN 
    productDetail ON products.id = productDetail.product_id
WHERE 
    products.flash_sale = 1
GROUP BY 
    products.id, products.product_name`;
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
        resolve([]);
      }
    });
  });
};
const fetchAddress = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM addressInform WHERE user_id = (?)`;
    connection.query(sql, [id], (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      if (data.length > 0) {
        resolve(data[0]);
      } else {
        resolve([]);
      }
    });
  });
};
const fetchSliders = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT sliders.*, categories.category_slug 
  FROM sliders 
  INNER JOIN categories 
  ON categories.id = sliders.path`;
    connection.query(sql, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      if (data.length > 0) {
        const transformedData = data.map((item) => {
          const altValid = item.alt
            .replace(/_/g, " ")
            .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
          return {
            ...item,
            alt: altValid,
          };
        });
        resolve(transformedData);
      } else {
        resolve([]);
      }
    });
  });
};

module.exports = { app, io, server };
