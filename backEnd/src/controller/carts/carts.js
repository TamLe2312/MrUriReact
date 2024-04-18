const connection = require("../../config/database");
let config = require("../../config/vnpay");
let querystring = require("qs");
let crypto = require("crypto");
const moment = require("moment");
const { url } = require("inspector");

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
      connection.query(
        `SELECT stock FROM products WHERE id = (?)`,
        [cart.product_id],
        (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi máy chủ" });
          }
          const productStock = results[0].stock;
          if (newQuantity > productStock) {
            return res.status(400).json({
              message: "Cant add over stock quantity product",
            });
          } else {
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
                  return res.status(200).json({
                    message: "Add Cart Success",
                    results: transformedData,
                  });
                });
              }
            );
          }
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
    if (paymentMethod == "cash") {
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
            let productsArray;
            if (Array.isArray(products) && products.length > 0) {
              productsArray = products.map((product) => product);
            } else {
              productsArray = [products];
            }
            productsArray.forEach((product) => {
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
                  if (completed === productsArray.length) {
                    let APP_URL = config.APP_URL;
                    return res.status(200).json({
                      message: "Check-out success",
                      url: APP_URL + "/check-out/success",
                    });
                  }
                }
              );
            });
          }
        }
      );
    } else {
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
            process.env.TZ = "Asia/Ho_Chi_Minh";

            let date = new Date();
            let createDate = moment(date).format("YYYYMMDDHHmmss");

            let ipAddr =
              req.headers["x-forwarded-for"] ||
              req.connection.remoteAddress ||
              req.socket.remoteAddress ||
              req.connection.socket.remoteAddress;
            let tmnCode = config.VNP_TMNCODE;
            let secretKey = config.VNP_HASHSECRET;
            let vnpUrl = config.VNP_URL;
            let returnUrl = config.VNP_RETURNURL;
            let orderId = lastId;
            let amount = req.body.total;

            let bankCode = "NCB";

            let currCode = "VND";
            let vnp_Params = {};
            vnp_Params["vnp_Version"] = "2.1.0";
            vnp_Params["vnp_Command"] = "pay";
            vnp_Params["vnp_TmnCode"] = tmnCode;
            vnp_Params["vnp_Locale"] = "vn";
            vnp_Params["vnp_CurrCode"] = currCode;
            vnp_Params["vnp_TxnRef"] = orderId;
            vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
            vnp_Params["vnp_OrderType"] = "other";
            vnp_Params["vnp_Amount"] = amount * 100;
            vnp_Params["vnp_ReturnUrl"] = returnUrl;
            vnp_Params["vnp_IpAddr"] = ipAddr;
            vnp_Params["vnp_CreateDate"] = createDate;
            if (bankCode !== null && bankCode !== "") {
              vnp_Params["vnp_BankCode"] = bankCode;
            }

            vnp_Params = sortObject(vnp_Params);

            let signData = querystring.stringify(vnp_Params, { encode: false });
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac
              .update(new Buffer(signData, "utf-8"))
              .digest("hex");
            vnp_Params["vnp_SecureHash"] = signed;
            vnpUrl +=
              "?" + querystring.stringify(vnp_Params, { encode: false });
            let completed = 0;
            let productsArray;
            if (Array.isArray(products) && products.length > 0) {
              productsArray = products.map((product) => product);
            } else {
              productsArray = [products];
            }
            productsArray.forEach((product) => {
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
                  if (completed === productsArray.length) {
                    return res
                      .status(200)
                      .json({ message: "Check-out success", url: vnpUrl });
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

const vnpayReturn = (req, res) => {
  const { orderId } = req.body;
  if (orderId) {
    connection.query(
      `UPDATE orders SET status = (?) WHERE id = (?)`,
      ["confirm", orderId],
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        return res.status(200).json({ message: "Thành công" });
      }
    );
  }
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = {
  getCarts,
  getCartById,
  addCart,
  deleteCart,
  changeQuantity,
  checkOut,
  clearCart,
  vnpayReturn,
};
