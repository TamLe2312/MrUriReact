const connection = require("../../config/database");
let config = require("../../config/vnpay");
let querystring = require("qs");
let crypto = require("crypto");
const moment = require("moment");
const fs = require("fs");
const Mustache = require("mustache");
const mailer = require("../../utils/mailer");

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
    connection.query(
      `SELECT 
    products.product_name,
    products.id as product_id,
    carts.quantity,
    carts.image,
    carts.id,
    productDetail.id as product_detail_id,
    productDetail.selling_price,
    variation.name AS variation_name,
    variationOption.value AS variation_value 
FROM carts
INNER JOIN products ON carts.product_id = products.id
INNER JOIN productDetail ON carts.product_detail_id = productDetail.id
INNER JOIN productConfiguration ON productDetail.id = productConfiguration.product_detail_id
INNER JOIN variationOption ON productConfiguration.variation_option_id = variationOption.id
INNER JOIN variation ON variationOption.variation_id = variation.id
WHERE carts.user_id = (?)
ORDER BY carts.id, productDetail.id, variation.name
      `,
      [id],
      (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        if (data.length > 0) {
          const transformedData = data.map((item) => {
            const productName = item.product_name
              .replace(/_/g, " ")
              .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
            const variationName = item.variation_name
              .replace(/_/g, " ")
              .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
            const variationValue = item.variation_value
              .replace(/_/g, " ")
              .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
            return {
              ...item,
              product_name: productName,
              variation_name: variationName,
              variation_value: variationValue,
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

const addCart = (req, res) => {
  const { cart } = req.body;
  const sql = `SELECT * FROM carts WHERE product_id = ? AND user_id = ? AND product_detail_id = ?`;
  connection.query(
    sql,
    [cart.product_id, cart.user_id, cart.product_detail_id],
    (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }
      if (data.length > 0) {
        const newQuantity = data[0].quantity + cart.quantity;
        connection.query(
          `SELECT stock FROM productDetail WHERE id = (?) AND product_id = (?)`,
          [cart.product_detail_id, cart.product_id],
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
              const updateSql = `UPDATE carts SET quantity = ? WHERE product_id = ? AND user_id = ?  AND product_detail_id = ?`;
              connection.query(
                updateSql,
                [
                  parseInt(newQuantity),
                  cart.product_id,
                  cart.user_id,
                  cart.product_detail_id,
                ],
                (err, data) => {
                  if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Lỗi máy chủ" });
                  }
                  const getSql = `SELECT 
    products.product_name,
    carts.quantity,
    carts.image,
    carts.id,
    productDetail.selling_price,
    variation.name AS variation_name,
    variationOption.value AS variation_value 
FROM carts
INNER JOIN products ON carts.product_id = products.id
INNER JOIN productDetail ON carts.product_detail_id = productDetail.id
INNER JOIN productConfiguration ON productDetail.id = productConfiguration.product_detail_id
INNER JOIN variationOption ON productConfiguration.variation_option_id = variationOption.id
INNER JOIN variation ON variationOption.variation_id = variation.id
WHERE carts.user_id = (?)
ORDER BY carts.id, productDetail.id, variation.name`;
                  connection.query(getSql, [cart.user_id], (err, data) => {
                    if (err) {
                      console.error(err);
                      return res.status(500).json({ message: "Lỗi máy chủ" });
                    }
                    const transformedData = data.map((item) => {
                      const productName = item.product_name
                        .replace(/_/g, " ")
                        .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
                      const variationName = item.variation_name
                        .replace(/_/g, " ")
                        .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
                      const variationValue = item.variation_value
                        .replace(/_/g, " ")
                        .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
                      return {
                        ...item,
                        product_name: productName,
                        variation_name: variationName,
                        variation_value: variationValue,
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
        const insertSql = `INSERT INTO carts (user_id, product_id,product_detail_id, quantity, image) VALUES (?, ?, ?,?, ?)`;
        connection.query(
          insertSql,
          [
            cart.user_id,
            cart.product_id,
            cart.product_detail_id,
            cart.quantity,
            cart.image,
          ],
          (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Lỗi máy chủ" });
            }
            const getSql = `SELECT 
    products.product_name,
    carts.quantity,
    carts.image,
    carts.id,
    productDetail.selling_price,
    variation.name AS variation_name,
    variationOption.value AS variation_value 
FROM carts
INNER JOIN products ON carts.product_id = products.id
INNER JOIN productDetail ON carts.product_detail_id = productDetail.id
INNER JOIN productConfiguration ON productDetail.id = productConfiguration.product_detail_id
INNER JOIN variationOption ON productConfiguration.variation_option_id = variationOption.id
INNER JOIN variation ON variationOption.variation_id = variation.id
WHERE carts.user_id = (?)
ORDER BY carts.id, productDetail.id, variation.name`;
            connection.query(getSql, [cart.user_id], (err, data) => {
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
};

const deleteCart = (req, res) => {
  const { cart, userId } = req.body;
  if (cart && userId) {
    const sql = `SELECT * FROM carts WHERE id = ?`;
    connection.query(sql, [cart], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }
      if (data.length > 0) {
        const deleteSql = `DELETE FROM carts where id = (?)`;
        connection.query(deleteSql, [cart], (err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi máy chủ" });
          }
          const getSql = `SELECT products.product_name,
    carts.quantity,
    carts.image,
    carts.id,
    productDetail.selling_price,
    variation.name AS variation_name,
    variationOption.value AS variation_value 
FROM carts
INNER JOIN products ON carts.product_id = products.id
INNER JOIN productDetail ON carts.product_detail_id = productDetail.id
INNER JOIN productConfiguration ON productDetail.id = productConfiguration.product_detail_id
INNER JOIN variationOption ON productConfiguration.variation_option_id = variationOption.id
INNER JOIN variation ON variationOption.variation_id = variation.id
WHERE carts.user_id = (?)
ORDER BY carts.id, productDetail.id, variation.name`;
          connection.query(getSql, [userId], (err, data) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Lỗi máy chủ" });
            }
            const transformedData = data.map((item) => {
              const productName = item.product_name
                .replace(/_/g, " ")
                .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
              const variationName = item.variation_name
                .replace(/_/g, " ")
                .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
              const variationValue = item.variation_value
                .replace(/_/g, " ")
                .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
              return {
                ...item,
                product_name: productName,
                variation_name: variationName,
                variation_value: variationValue,
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
  const { userId, cart } = req.body;
  if (userId && cart) {
    connection.query(
      `UPDATE carts SET quantity = (?) WHERE id = (?)`,
      [cart.quantity, cart.id],
      (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        const getSql = `SELECT products.product_name,
    carts.quantity,
    carts.image,
    carts.id,
    productDetail.selling_price,
    variation.name AS variation_name,
    variationOption.value AS variation_value 
FROM carts
INNER JOIN products ON carts.product_id = products.id
INNER JOIN productDetail ON carts.product_detail_id = productDetail.id
INNER JOIN productConfiguration ON productDetail.id = productConfiguration.product_detail_id
INNER JOIN variationOption ON productConfiguration.variation_option_id = variationOption.id
INNER JOIN variation ON variationOption.variation_id = variation.id
WHERE carts.user_id = (?)
ORDER BY carts.id, productDetail.id, variation.name`;
        connection.query(getSql, [userId], (err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: "Lỗi máy chủ" });
          }
          const transformedData = data.map((item) => {
            const productName = item.product_name
              .replace(/_/g, " ")
              .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
            const variationName = item.variation_name
              .replace(/_/g, " ")
              .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
            const variationValue = item.variation_value
              .replace(/_/g, " ")
              .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
            return {
              ...item,
              product_name: productName,
              variation_name: variationName,
              variation_value: variationValue,
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
    phoneNumber,
    address,
    provinces,
    districts,
    wards,
    products,
    userId,
    total,
    shipping,
    paymentMethod,
  } = req.body;
  if (
    phoneNumber &&
    address &&
    provinces &&
    districts &&
    wards &&
    products &&
    userId &&
    total &&
    shipping &&
    paymentMethod
  ) {
    const fullAddress = `${address},${wards},${districts},${provinces}`;
    let totalSum = Number(total) + Number(shipping);
    if (paymentMethod == "cash") {
      connection.query(
        `INSERT INTO orders (user_id,address,pay,phone_number,total,status) VALUES (?,?,?,?,?,?)`,
        [userId, fullAddress, paymentMethod, phoneNumber, totalSum, "pending"],
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
                `INSERT INTO order_details (order_id,product_id,product_detail_id,quantity,price,img) VALUES (?,?,?,?,?,?)`,
                [
                  lastId,
                  parseProduct.product_id,
                  parseProduct.product_detail_id,
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
                  connection.query(
                    `UPDATE productDetail SET stock = stock - ?, bought = bought + ? WHERE id = ?`,
                    [
                      parseProduct.quantity,
                      parseProduct.quantity,
                      parseProduct.product_detail_id,
                    ],
                    (err, data) => {
                      if (err) {
                        console.error(err);
                        return res.status(500).json({ message: "Lỗi máy chủ" });
                      }
                    }
                  );
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
        [userId, fullAddress, paymentMethod, phoneNumber, totalSum, "pending"],
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
                `INSERT INTO order_details (order_id,product_id,product_detail_id,quantity,price,img) VALUES (?,?,?,?,?,?)`,
                [
                  lastId,
                  parseProduct.product_id,
                  parseProduct.product_detail_id,
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
                  connection.query(
                    `UPDATE productDetail SET stock = stock - ?, bought = bought + ? WHERE id = ?`,
                    [
                      parseProduct.quantity,
                      parseProduct.quantity,
                      parseProduct.product_detail_id,
                    ],
                    (err, data) => {
                      if (err) {
                        console.error(err);
                        return res.status(500).json({ message: "Lỗi máy chủ" });
                      }
                    }
                  );
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
        connection.query(
          `SELECT users.email, orders.total, orders.address, order_details.price, order_details.quantity, products.product_name
          FROM orders 
          INNER JOIN users ON orders.user_id = users.id 
          INNER JOIN order_details ON orders.id = order_details.order_id 
          INNER JOIN products ON order_details.product_id = products.id 
          WHERE orders.id = ?`,
          [orderId],
          (err, results, fields) => {
            if (err) {
              return res.status(500).json({ message: "Lỗi máy chủ" });
            }
            const orderDetails = {
              email: results[0].email,
              total: results[0].total,
              address: results[0].address,
              orderItems: [],
            };

            results.forEach((row) => {
              const productName = row.product_name
                .replace(/_/g, " ")
                .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
              const orderItem = {
                price: row.price,
                quantity: row.quantity,
                productName: productName,
              };
              orderDetails.orderItems.push(orderItem);
            });
            const filePath = "../backEnd/src/public/html/OrderInformation.html";
            fs.readFile(filePath, "utf8", (err, content) => {
              if (err) {
                console.error(`Đã xảy ra lỗi khi đọc file: ${err}`);
                return;
              }
              let data = {
                email: orderDetails.email,
                total: orderDetails.total,
                address: orderDetails.address,
                orderDetails: orderDetails.orderItems,
              };
              console.log(data);
              let htmlContent = Mustache.render(content, data);
              mailer.sendMail(data.email, "Order Information", htmlContent);
            });
          }
        );
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
