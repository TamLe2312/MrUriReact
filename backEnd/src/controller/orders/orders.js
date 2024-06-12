const connection = require("../../config/database");
const moment = require("moment");

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

const getOrderById = (req, res) => {
  const { id, userId } = req.body;
  if (id && userId) {
    connection.query(
      `SELECT 
  orders.id,
  users.username,
  orders.address,
  orders.pay,
  orders.phone_number,
  orders.total,
  orders.status,
  orders.created_at,
  GROUP_CONCAT(
    JSON_OBJECT(
      'quantity', order_details.quantity,
      'price', order_details.price,
      'img', order_details.img,
      'product_name', products.product_name,
      'variation_name', variation.name,
      'variation_value', variationOption.value
    )
  ) AS order_details
FROM orders
INNER JOIN order_details ON order_details.order_id = orders.id
INNER JOIN productConfiguration ON order_details.product_detail_id = productConfiguration.product_detail_id
INNER JOIN variationOption ON productConfiguration.variation_option_id = variationOption.id
INNER JOIN variation ON variationOption.variation_id = variation.id
INNER JOIN users ON users.id = orders.user_id
INNER JOIN products ON products.id = order_details.product_id
WHERE orders.user_id = ? AND orders.id = ?
GROUP BY orders.id`,
      [userId, id],
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

            const orderDetails = JSON.parse(`[${item.order_details}]`).map(
              (detail) => {
                return {
                  ...detail,
                  product_name: detail.product_name
                    .replace(/_/g, " ")
                    .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase()),
                  variation_name: detail.variation_name
                    .replace(/_/g, " ")
                    .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase()),
                  variation_value: detail.variation_value
                    .replace(/_/g, " ")
                    .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase()),
                };
              }
            );

            return {
              ...item,
              pay: pay,
              created_at: createdAt,
              status: status,
              order_details: orderDetails,
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
const deleteOrderAdmin = (req, res) => {
  const id = req.params.id;
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
        console.log(data);
        const transformedData = data.map((item) => {
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
            created_at: createdAt,
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

const getChart = (req, res) => {
  let dataLast7Days = [];
  let dataLast12Months = [];

  const fetchDataLast7Days = new Promise((resolve, reject) => {
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const day = moment().subtract(i, "days").format("YYYY-MM-DD");
      connection.query(
        `SELECT SUM(total) AS total FROM orders WHERE DATE(created_at) = '${day}' AND status = 'confirm'`,
        (err, datas) => {
          if (err) {
            reject("Lỗi máy chủ");
          } else {
            dataLast7Days.push({ date: day, total: datas[0] });
            count++;
            if (count === 7) resolve();
          }
        }
      );
    }
  });

  const fetchDataLast12Months = new Promise((resolve, reject) => {
    let count = 0;
    for (let i = 0; i <= 11; i++) {
      const firstDayOfMonth = moment()
        .subtract(i, "months")
        .startOf("month")
        .format("YYYY-MM-DD");
      const lastDayOfMonth = moment()
        .subtract(i, "months")
        .endOf("month")
        .format("YYYY-MM-DD");
      const query = `SELECT SUM(total) AS total FROM orders WHERE DATE(created_at) BETWEEN '${firstDayOfMonth}' AND '${lastDayOfMonth}' AND status = 'confirm'`;
      connection.query(query, (err, datas) => {
        if (err) {
          reject("Lỗi máy chủ");
        } else {
          const monthlyData = datas[0];
          dataLast12Months.push({
            month: moment(firstDayOfMonth).format("MMMM"),
            year: moment(firstDayOfMonth).format("YYYY"),
            total: monthlyData,
          });
          count++;
          if (count === 12) resolve();
        }
      });
    }
  });

  Promise.all([fetchDataLast7Days, fetchDataLast12Months])
    .then(() => {
      return res.status(200).json({
        message: "Success",
        results: {
          dataLast7Days: dataLast7Days,
          dataLast12Months: dataLast12Months,
        },
      });
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
};
const getPie = async (req, res) => {
  let products;
  let total = 0;
  let totalSell = 0;

  const fetchCount = new Promise((resolve, reject) => {
    connection.query(
      `SELECT COUNT(id) AS total FROM products`,
      (err, productResult) => {
        if (err) {
          reject("Lỗi máy chủ khi đếm số lượng sản phẩm");
        } else {
          total = parseInt(productResult[0].total || 0);
          resolve();
        }
      }
    );
  });

  const fetchCountSell = new Promise((resolve, reject) => {
    connection.query(
      `SELECT SUM(bought) AS totalSell FROM productDetail`,
      (err, productResult) => {
        if (err) {
          reject("Lỗi máy chủ khi đếm số lượng sản phẩm");
        } else {
          totalSell = parseInt(productResult[0].totalSell || 0);
          resolve();
        }
      }
    );
  });
  const fetchProducts = new Promise((resolve, reject) => {
    connection.query(
      `SELECT c.id, COUNT(pc.product_id) AS total_products, c.category_name
    FROM categories c
    LEFT JOIN productCategories pc ON c.id = pc.category_id
    GROUP BY c.id
    HAVING total_products > 0`,
      (err, productResult) => {
        if (err) {
          reject("Lỗi máy chủ khi đếm số lượng sản phẩm");
        }
        const transformedData = productResult.map((item) => {
          const categoryName = item.category_name
            .replace(/_/g, " ")
            .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
          return {
            ...item,
            category_name: categoryName,
          };
        });
        products = transformedData;
        resolve();
      }
    );
  });

  Promise.all([fetchCount, fetchProducts, fetchCountSell])
    .then(() => {
      return res.status(200).json({
        message: "Success",
        results: {
          products: products,
          total: total,
          totalSell: totalSell,
        },
      });
    })
    .catch((error) => {
      return res.status(500).json({ message: error });
    });
};

module.exports = {
  getOrders,
  editOrder,
  cancelOrder,
  returnOrder,
  deleteOrder,
  getAll,
  editStatus,
  getChart,
  getPie,
  getOrderById,
  deleteOrderAdmin,
};
