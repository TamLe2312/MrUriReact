const connection = require("../../config/database");

require("dotenv").config();

const viewProducts = (req, res) => {
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
            .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());

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
    productCategories,
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
          if (
            Array.isArray(productCategories) &&
            productCategories.length > 1
          ) {
            productCategories.forEach((category) => {
              connection.query(
                "INSERT INTO productCategories (product_id,category_id) VALUES (?,?)",
                [lastId, category],
                function (err, results, fields) {
                  if (err) {
                    return res
                      .status(500)
                      .json({ error: "Có lỗi xảy ra xin thử lại sau" });
                  }
                }
              );
            });
          } else {
            connection.query(
              "INSERT INTO productCategories (product_id,category_id) VALUES (?,?)",
              [lastId, productCategories],
              function (err, results, fields) {
                if (err) {
                  return res
                    .status(500)
                    .json({ error: "Có lỗi xảy ra xin thử lại sau" });
                }
              }
            );
          }

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

const productViewById = (req, res) => {
  const id = req.params.id;
  if (id) {
    connection.query(
      `SELECT products.*, 
    (SELECT GROUP_CONCAT(images.image_name) FROM images WHERE products.id = images.product_id) AS images,
    (SELECT GROUP_CONCAT(categories.category_name) FROM categories INNER JOIN productCategories ON categories.id = productCategories.category_id WHERE products.id = productCategories.product_id) AS category_names
FROM products 
WHERE products.id = (?)
       `,
      [id],
      function (err, data) {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Có lỗi xảy ra xin thử lại sau" });
        }
        if (data.length > 0) {
          const transformedData = data.map((item) => {
            const productName = item.product_name
              .replace(/_/g, " ")
              .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
            const status = item.status
              .replace(/_/g, " ")
              .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
            const categoriesArray = item.category_names
              .split(",")
              .map((category) => {
                return category
                  .replace(/_/g, " ")
                  .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
              });

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
              category_names: categoriesArray,
            };
          });
          return res
            .status(200)
            .json({ message: "Success", results: transformedData });
        }
      }
    );
  }
};
const relatedProducts = (req, res) => {
  const id = req.params.id;
  if (id) {
    connection.query(
      `SELECT p.product_name,p.id,p.selling_price,GROUP_CONCAT(i.image_name) AS images
      FROM productCategories pc
      INNER JOIN categories c ON pc.category_id = c.id
      INNER JOIN products p ON pc.product_id = p.id
      INNER JOIN images i ON i.product_id = p.id
      WHERE c.category_slug = ?
      GROUP BY p.id
      ORDER BY RAND()
      LIMIT 3`,
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

            return {
              ...item,
              product_name: productName,
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

const relatedProductsDetail = (req, res) => {
  const id = req.params.id;
  if (id) {
    connection.query(
      `SELECT category_id FROM productCategories WHERE product_id = ?`,
      [id],
      (err, categories) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        let categoryIds;
        if (Array.isArray(categories) && categories.length > 0) {
          categoryIds = categories.map((category) => category.category_id);
        } else {
          categoryIds = [categories.category_id];
        }
        connection.query(
          `SELECT DISTINCT product_id FROM productCategories WHERE category_id IN (?) AND product_id != ?`,
          [categoryIds, id],
          (err, relatedProducts) => {
            if (err) {
              console.log(err);
              return res.status(500).json({ message: "Lỗi máy chủ" });
            }
            if (relatedProducts.length > 0) {
              const relatedProductIds = relatedProducts.map(
                (product) => product.product_id
              );
              connection.query(
                `SELECT  products.id,
                products.product_name,
                products.selling_price,
                products.status,
                GROUP_CONCAT(images.image_name) AS images FROM products 
                INNER JOIN images ON products.id = images.product_id 
                WHERE id IN (?)
                GROUP BY products.id
                LIMIT 5`,
                [relatedProductIds],
                (err, data) => {
                  if (err) {
                    console.log(err);
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
                    .json({ message: "Thành công", results: transformedData });
                }
              );
            } else {
              return res
                .status(400)
                .json({ message: "Không có sản phẩm liên quan" });
            }
          }
        );
      }
    );
  }
};

const redirectCategory = (req, res) => {
  const id = req.params.id;
  if (id) {
    connection.query(
      `SELECT categories.id,categories.category_name,categories.category_slug FROM productCategories 
    INNER JOIN categories ON categories.id = productCategories.category_id
    WHERE productCategories.product_id = (?)`,
      [id],
      (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        return res.status(200).json({ message: "Thành công", results: data });
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
  productViewById,
  relatedProducts,
  relatedProductsDetail,
  redirectCategory,
};
