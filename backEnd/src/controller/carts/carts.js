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
          .replace(/\b\w/g, (c) => c.toUpperCase());
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
            .replace(/\b\w/g, (c) => c.toUpperCase());
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
                .replace(/\b\w/g, (c) => c.toUpperCase());
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
                .replace(/\b\w/g, (c) => c.toUpperCase());
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
                .replace(/\b\w/g, (c) => c.toUpperCase());
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
              .replace(/\b\w/g, (c) => c.toUpperCase());
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

module.exports = {
  getCarts,
  getCartById,
  addCart,
  deleteCart,
  changeQuantity,
};
