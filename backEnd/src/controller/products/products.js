const connection = require("../../config/database");

require("dotenv").config();

const viewProducts = (req, res) => {
  const sql = `SELECT products.id,
    products.product_name,
    products.selling_price,
    products.status,
    GROUP_CONCAT(images.image_name) AS images FROM products INNER JOIN images ON products.id = images.product_id 
    GROUP BY
    products.id;`;
  connection.query(sql, (err, data) => {
    if (err) {
      console.error(err);
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
    } else {
      return res.status(400).json({ message: "Sản phẩm không tồn tại" });
    }
  });
};

const viewDetail = (req, res) => {
  const id = req.params.id;
  if (id) {
    const sql = `SELECT id,
    product_name,
    selling_price,
    product_description,
    stock,
    status FROM products
    WHERE id = (?)`;
    connection.query(sql, [id], (err, data) => {
      if (err) {
        console.error(err);
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
      } else {
        return res.status(400).json({ message: "Sản phẩm không tồn tại" });
      }
    });
  }
};

const viewDetailImgs = (req, res) => {
  const id = req.params.id;
  if (id) {
    const sql = `SELECT image_name FROM images WHERE product_id = (?)`;
    connection.query(sql, [id], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }
      if (data.length > 0) {
        return res.status(200).json({ message: "Thành công", results: data });
      } else {
        return res.status(400).json({ message: "Image list không tồn tại" });
      }
    });
  }
};
const getProducts = (req, res) => {
  const sql = "SELECT * FROM products";
  connection.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
    if (data.length > 0) {
      const transformedData = data.map((item) => {
        const productName = item.product_name
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        const status = item.status
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

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
          product_name: productName,
          created_at: createdAt,
          status: status,
        };
      });

      return res
        .status(200)
        .json({ message: "Thành công", results: transformedData });
    } else {
      return res.status(200).json({ message: "Sản phẩm không tồn tại" });
    }
  });
};

const getProductById = (req, res) => {
  const id = req.params.id;
  if (id) {
    const sql = "SELECT * FROM products WHERE id = (?)";
    connection.query(sql, [id], (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }
      if (data.length > 0) {
        const transformedData = data.map((item) => {
          const productName = item.product_name
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          const status = item.status
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

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
            product_name: productName,
            created_at: createdAt,
            status: status,
          };
        });

        return res
          .status(200)
          .json({ message: "Thành công", results: transformedData[0] });
      } else {
        return res.status(400).json({ message: "Sản phẩm không tồn tại" });
      }
    });
  }
};

const addProducts = (req, res) => {
  const {
    productName,
    productDescription,
    importedPrice,
    sellingPrice,
    status,
    stock,
  } = req.body;
  const files = req.files;
  if (
    productName &&
    productDescription &&
    importedPrice &&
    sellingPrice &&
    status &&
    stock &&
    files
  ) {
    const productNameValid = productName.toLowerCase().replace(/\s+/g, "_");
    const stockValid = parseInt(stock);
    const sellingPriceValid = parseFloat(sellingPrice);
    const importedPriceValid = parseFloat(importedPrice);
    connection.query(
      "INSERT INTO products (product_name,product_description,stock,selling_price,imported_price,status) VALUES (?,?,?,?,?,?)",
      [
        productNameValid,
        productDescription,
        stockValid,
        sellingPriceValid,
        importedPriceValid,
        status,
      ],
      function (err, results, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (results) {
          const lastId = results.insertId;
          let completed = 0;
          files.forEach((file) => {
            const fileName = file.filename;
            connection.query(
              "INSERT INTO images (image_name,product_id) VALUES (?,?)",
              [fileName, lastId],
              function (err, results, fields) {
                completed++;
                if (err) {
                  return res
                    .status(500)
                    .json({ error: "Có lỗi xảy ra xin thử lại sau" });
                } else {
                  if (completed == files.length) {
                    return res
                      .status(200)
                      .json({ message: "Add product successfully" });
                  }
                }
              }
            );
          });
        }
      }
    );
  }
};
module.exports = {
  getProducts,
  getProductById,
  addProducts,
  viewProducts,
  viewDetail,
  viewDetailImgs,
};
