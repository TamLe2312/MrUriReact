const connection = require("../../config/database");

const getCarts = (req, res) => {
  const sql =
    "SELECT products.product_name,products.selling_price,carts.quantity,carts.image,carts.id,carts.product_id FROM carts INNER JOIN products on products.id = carts.product_id";
  connection.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi máy chủ" });
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
      return res
        .status(200)
        .json({ message: "Thành công", results: transformedData });
    }
    return res.status(200).json({ message: "Thành công", results: [] });
  });
};

const getCartById = (req, res) => {
  const id = req.params.id;
  if (id) {
    const sql =
      "SELECT products.product_name,products.selling_price,carts.quantity,carts.image,carts.id,carts.product_id FROM carts INNER JOIN products on products.id = carts.product_id WHERE user_id = (?)";
    connection.query(sql, [id], (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi máy chủ" });
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
        return res
          .status(200)
          .json({ message: "Thành công", results: transformedData });
      }
      return res.status(200).json({ message: "Thành công", results: [] });
    });
  }
};

const addCart = (req, res) => {
  const { cart } = req.body;
  const sql = `SELECT * FROM carts WHERE product_id = ? AND user_id = ?`;
  connection.query(sql, [cart.product_id, cart.user_id], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
    if (data.length > 0) {
      const newQuantity = data[0].quantity + cart.quantity;
      const updateSql = `UPDATE carts SET quantity = ? WHERE product_id = ? AND user_id = ?`;
      connection.query(
        updateSql,
        [parseInt(newQuantity), cart.product_id, cart.user_id],
        (err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi máy chủ" });
          }
          const getSql = `SELECT products.product_name,products.selling_price,carts.quantity,carts.image,carts.id,carts.product_id FROM carts INNER JOIN products on products.id = carts.product_id `;
          connection.query(getSql, (err, data) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Lỗi máy chủ" });
            }
            const transformedData = data.map((item) => {
              const productName = item.product_name
                .replace(/_/g, " ")
                .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
              return {
                ...item,
                product_name: productName,
              };
            });
            return res
              .status(200)
              .json({ message: "Add Cart Success", results: transformedData });
          });
        }
      );
    } else {
      const insertSql = `INSERT INTO carts (user_id, product_id, quantity, image) VALUES (?, ?, ?, ?)`;
      connection.query(
        insertSql,
        [cart.user_id, cart.product_id, cart.quantity, cart.image],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi máy chủ" });
          }
          const getSql = `SELECT products.product_name,products.selling_price,carts.quantity,carts.image,carts.id FROM carts INNER JOIN products on products.id = carts.product_id `;
          connection.query(getSql, (err, data) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Lỗi máy chủ" });
            }
            const transformedData = data.map((item) => {
              const productName = item.product_name
                .replace(/_/g, " ")
                .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
              return {
                ...item,
                product_name: productName,
              };
            });
            return res
              .status(200)
              .json({ message: "Add Cart Success", results: transformedData });
          });
        }
      );
    }
  });
};

const deleteCart = (req, res) => {
  const id = req.params.id;
  if (id) {
    const sql = `SELECT * FROM carts WHERE id = ?`;
    connection.query(sql, [id], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }
      if (data.length > 0) {
        const deleteSql = `DELETE FROM carts where id = (?)`;
        connection.query(deleteSql, [id], (err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi máy chủ" });
          }
          const getSql = `SELECT products.product_name,products.selling_price,carts.quantity,carts.image,carts.id,carts.product_id FROM carts INNER JOIN products on products.id = carts.product_id `;
          connection.query(getSql, (err, data) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Lỗi máy chủ" });
            }
            const transformedData = data.map((item) => {
              const productName = item.product_name
                .replace(/_/g, " ")
                .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
              return {
                ...item,
                product_name: productName,
              };
            });
            return res.status(200).json({
              message: "Delete Cart Success",
              results: transformedData,
            });
          });
        });
      }
    });
  }
};

const changeQuantity = (req, res) => {
  const { user_id, cart } = req.body;
  if (user_id && cart) {
    connection.query(
      `UPDATE carts SET quantity = (?) WHERE id = (?)`,
      [cart.quantity, cart.id],
      (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        const getSql = `SELECT products.product_name,products.selling_price,carts.quantity,carts.image,carts.id,carts.product_id FROM carts INNER JOIN products on products.id = carts.product_id `;
        connection.query(getSql, (err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi máy chủ" });
          }
          const transformedData = data.map((item) => {
            const productName = item.product_name
              .replace(/_/g, " ")
              .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
            return {
              ...item,
              product_name: productName,
            };
          });
          return res.status(200).json({
            message: "Success",
            results: transformedData,
          });
        });
      }
    );
  }
};

const checkOut = (req, res) => {
  const {
    name,
    phoneNumber,
    address,
    provinces,
    districts,
    wards,
    products,
    userId,
    total,
    paymentMethod,
  } = req.body;
  if (
    name &&
    phoneNumber &&
    address &&
    provinces &&
    districts &&
    wards &&
    products &&
    userId &&
    total &&
    paymentMethod
  ) {
    const fullAddress = `${address},${wards},${districts},${provinces}`;
    if (paymentMethod === "cash") {
      connection.query(
        `INSERT INTO orders (user_id,address,pay,phone_number,total,status) VALUES (?,?,?,?,?,?)`,
        [userId, fullAddress, paymentMethod, phoneNumber, total, "pending"],
        (err, results, fields) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi máy chủ" });
          }
          if (results) {
            const lastId = results.insertId;
            let completed = 0;
            products.forEach((product) => {
              const parseProduct = JSON.parse(product);
              connection.query(
                `INSERT INTO order_details (order_id,product_id,quantity,price,img) VALUES (?,?,?,?,?)`,
                [
                  lastId,
                  parseProduct.product_id,
                  parseProduct.quantity,
                  parseProduct.selling_price,
                  parseProduct.image,
                ],
                (err, data) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Lỗi máy chủ" });
                  }
                  completed++;
                  if (completed === products.length) {
                    return res
                      .status(200)
                      .json({ message: "Check-out success" });
                  }
                }
              );
            });
          }
        }
      );
    }
  }
};

const clearCart = (req, res) => {
  const id = req.params.id;
  if (id) {
    const sql = "DELETE FROM carts WHERE user_id = (?)";
    connection.query(sql, [id], (err, results, fields) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }
      if (results) {
        return res.status(200).json({ message: "Thành công" });
      }
    });
  }
};

module.exports = {
  getCarts,
  getCartById,
  addCart,
  deleteCart,
  changeQuantity,
  checkOut,
  clearCart,
};
