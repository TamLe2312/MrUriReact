const connection = require("../../config/database");

require("dotenv").config();

const getOrders = (req, res) => {
  const id = req.params.id;
  if (id) {
    connection.query(
      `SELECT * FROM orders WHERE user_id = (?)`,
      [id],
      (err, data) => {
        if (err) {
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        if (data.length > 0) {
          const transformedData = data.map((item) => {
            const pay = item.pay
              .replace(/_/g, " ")
              .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
            const status = item.status
              .replace(/_/g, " ")
              .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());

            const createdAt = new Date(item.created_at).toLocaleDateString(
              "vi-VN",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            );
            return {
              ...item,
              pay: pay,
              created_at: createdAt,
              status: status,
            };
          });

          return res
            .status(200)
            .json({ message: "Thành công", results: transformedData });
        }
      }
    );
  }
};

const editOrder = (req, res) => {
  const id = req.params.id;
  const { address } = req.body;
  if (id && address) {
    connection.query(
      `UPDATE orders SET address = (?) WHERE id = (?)`,
      [address, id],
      (err, results, fields) => {
        if (err) {
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        if (results) {
          return res.status(200).json({ message: "Edit address success" });
        }
      }
    );
  }
};
const cancelOrder = (req, res) => {
  const { id } = req.body;
  if (id) {
    connection.query(
      `UPDATE orders SET status = (?) WHERE id = (?)`,
      ["cancel", id],
      (err, results, fields) => {
        if (err) {
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        if (results) {
          return res.status(200).json({ message: "Cancel success" });
        }
      }
    );
  }
};

const returnOrder = (req, res) => {
  const { id } = req.body;
  if (id) {
    connection.query(
      `UPDATE orders SET status = (?) WHERE id = (?)`,
      ["pending", id],
      (err, results, fields) => {
        if (err) {
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        if (results) {
          return res.status(200).json({ message: "Re-order success" });
        }
      }
    );
  }
};
const deleteOrder = (req, res) => {
  const { id } = req.body;
  if (id) {
    connection.query(
      `DELETE FROM orders WHERE id = (?)`,
      [id],
      (err, results, fields) => {
        if (err) {
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        if (results) {
          return res.status(200).json({ message: "Delete success" });
        }
      }
    );
  }
};

const getAll = (req, res) => {
  connection.query(
    `SELECT orders.*,users.username FROM orders INNER JOIN users ON users.id = orders.user_id`,
    (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }
      if (data.length > 0) {
        const transformedData = data.map((item) => {
          const pay = item.pay
            .replace(/_/g, " ")
            .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
          const status = item.status
            .replace(/_/g, " ")
            .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());

          const createdAt = new Date(item.created_at).toLocaleDateString(
            "vi-VN",
            {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }
          );
          return {
            ...item,
            pay: pay,
            created_at: createdAt,
            status_name: status,
          };
        });
        return res
          .status(200)
          .json({ message: "Thành công", results: transformedData });
      }
    }
  );
};

const editStatus = (req, res) => {
  const { id, status } = req.body;
  if (id && status) {
    connection.query(
      `UPDATE orders SET status = (?) WHERE id = (?)`,
      [status, id],
      (err, results, fields) => {
        if (err) {
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        if (results) {
          return res.status(200).json({ message: "Edit success" });
        }
      }
    );
  }
};

module.exports = {
  getOrders,
  editOrder,
  cancelOrder,
  returnOrder,
  deleteOrder,
  getAll,
  editStatus,
};
