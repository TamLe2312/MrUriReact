const connection = require("../../config/database");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const viewProducts = (req, res) => {
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
    products.id, products.product_name
`;
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
    }
  });
};

const viewProductsByCategory = (req, res) => {
  const id = parseInt(req.params.id);
  if (id === 1) {
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
GROUP BY 
    products.id, products.product_name
`;
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
      }
    });
  } else {
    const sql = `
    SELECT products.id,
    products.product_name,
    GROUP_CONCAT(DISTINCT images.image_name) AS images,
    GROUP_CONCAT(DISTINCT productDetail.selling_price) AS selling_price
FROM 
    products
INNER JOIN 
    images ON products.id = images.product_id
INNER JOIN 
    productDetail ON products.id = productDetail.product_id
INNER JOIN 
    productcategories ON products.id = productcategories.product_id
WHERE productcategories.category_id = (?)
GROUP BY 
    products.id`;
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
      }
    });
  }
};

const viewDetail = (req, res) => {
  const id = req.params.id;
  if (id) {
    const sql = `
      SELECT 
        products.id AS product_id,
        products.product_name,
        products.product_description,
        productDetail.id AS product_detail_id,
        productDetail.selling_price,
        productDetail.stock,
        variation.name AS variation_name,
        variationOption.value AS variation_value
      FROM 
        products
      INNER JOIN 
        productDetail ON products.id = productDetail.product_id
      INNER JOIN 
        productConfiguration ON productDetail.id = productConfiguration.product_detail_id
      INNER JOIN 
        variationOption ON productConfiguration.variation_option_id = variationOption.id
      INNER JOIN 
        variation ON variationOption.variation_id = variation.id
      WHERE 
        products.id = (?)
      ORDER BY 
        products.id, productDetail.id, variation.name;
    `;

    connection.query(sql, [id], (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }

      if (data.length > 0) {
        const productMap = {};
        data.forEach((item) => {
          const productId = item.product_id;
          if (!productMap[productId]) {
            productMap[productId] = {
              product_id: productId,
              product_name: item.product_name
                .replace(/_/g, " ")
                .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase()),
              product_description: item.product_description,
              variants: [],
            };
          }

          productMap[productId].variants.push({
            product_detail_id: item.product_detail_id,
            selling_price: item.selling_price,
            stock: item.stock,
            variation_name: item.variation_name
              .replace(/_/g, " ")
              .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase()),
            variation_value: item.variation_value,
          });
        });

        // Chuyển đổi productMap thành mảng
        const transformedData = Object.values(productMap);

        return res
          .status(200)
          .json({ message: "Thành công", results: transformedData });
      } else {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
    });
  } else {
    return res.status(400).json({ message: "Yêu cầu không hợp lệ" });
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
const featureProduct = (req, res) => {
  const { id, featureProduct } = req.body;
  if (id) {
    const sql = "UPDATE products SET flash_sale = (?) WHERE id = (?)";
    connection.query(sql, [featureProduct, id], (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }
      return res.status(200).json({ message: "Update flash sale success" });
    });
  }
};

const getProductById = (req, res) => {
  const id = req.params.id;
  if (id) {
    const sql = "SELECT stock FROM productDetail WHERE id = (?)";
    connection.query(sql, [id], (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }
      if (data.length > 0) {
        return res
          .status(200)
          .json({ message: "Thành công", results: data[0] });
      } else {
        return res.status(400).json({ message: "Sản phẩm không tồn tại" });
      }
    });
  }
};

const addProducts = (req, res) => {
  const { productName, productDescription, productCategories, variations } =
    req.body;
  const files = req.files;
  if (productName && productDescription && variations && files) {
    const productNameValid = productName.toLowerCase().replace(/\s+/g, "_");
    connection.query(
      "INSERT INTO products (product_name,product_description) VALUES (?,?)",
      [productNameValid, productDescription],
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
                    console.error(err);
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
                  console.error(err);
                  return res
                    .status(500)
                    .json({ error: "Có lỗi xảy ra xin thử lại sau" });
                }
              }
            );
          }
          if (Array.isArray(variations) && variations.length > 1) {
            const parsedVariations = variations.map((variation) =>
              JSON.parse(variation)
            );
            parsedVariations.forEach((variation) => {
              connection.query(
                "INSERT INTO productDetail (product_id,selling_price,stock,status) VALUES (?,?,?,?)",
                [
                  lastId,
                  variation.sellingPrice,
                  variation.stock,
                  variation.status,
                ],
                function (err, results, fields) {
                  if (err) {
                    console.error(err);
                    return res
                      .status(500)
                      .json({ error: "Có lỗi xảy ra xin thử lại sau" });
                  }
                  if (results) {
                    const lastIdProductDetail = results.insertId;
                    connection.query(
                      "INSERT INTO variationOption (variation_id,value) VALUES (?,?)",
                      [variation.variation, variation.variationValue],
                      function (err, resultsVariationOption, fields) {
                        if (err) {
                          return res.status(500).json({
                            error: "Có lỗi xảy ra xin thử lại sau",
                          });
                        }
                        if (resultsVariationOption) {
                          const lastIdVariationOption =
                            resultsVariationOption.insertId;
                          connection.query(
                            "INSERT INTO productConfiguration (product_detail_id,variation_option_id) VALUES (?,?)",
                            [lastIdProductDetail, lastIdVariationOption],
                            function (err, results, fields) {
                              if (err) {
                                console.error(err);
                                return res.status(500).json({
                                  error: "Có lỗi xảy ra xin thử lại sau",
                                });
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            });
          } else {
            const parsedVariations = JSON.parse(variations);
            connection.query(
              "INSERT INTO productDetail (product_id,selling_price,stock,status) VALUES (?,?,?,?)",
              [
                lastId,
                parsedVariations.sellingPrice,
                parsedVariations.stock,
                parsedVariations.status,
              ],
              function (err, results, fields) {
                if (err) {
                  console.error(err);
                  return res
                    .status(500)
                    .json({ error: "Có lỗi xảy ra xin thử lại sau" });
                }
                if (results) {
                  const lastIdProductDetail = results.insertId;
                  connection.query(
                    "INSERT INTO variationOption (variation_id,value) VALUES (?,?)",
                    [
                      parsedVariations.variation,
                      parsedVariations.variationValue,
                    ],
                    function (err, resultsVariationOption, fields) {
                      if (err) {
                        console.error(err);
                        return res.status(500).json({
                          error: "Có lỗi xảy ra xin thử lại sau",
                        });
                      }
                      if (resultsVariationOption) {
                        const lastIdVariationOption =
                          resultsVariationOption.insertId;
                        connection.query(
                          "INSERT INTO productConfiguration (product_detail_id,variation_option_id) VALUES (?,?)",
                          [lastIdProductDetail, lastIdVariationOption],
                          function (err, results, fields) {
                            if (err) {
                              console.error(err);
                              return res.status(500).json({
                                error: "Có lỗi xảy ra xin thử lại sau",
                              });
                            }
                          }
                        );
                      }
                    }
                  );
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
        (SELECT GROUP_CONCAT(CONCAT(categories.category_name, ':', categories.id)) FROM categories INNER JOIN productCategories ON categories.id = productCategories.category_id WHERE products.id = productCategories.product_id) AS category_names
      FROM products 
      LEFT JOIN productCategories ON products.id = productCategories.product_id
      LEFT JOIN categories ON productCategories.category_id = categories.id
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
                const [categoryName, categoryId] = category.split(":");
                return {
                  label: categoryName
                    .replace(/_/g, " ")
                    .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase()),
                  value: parseInt(categoryId),
                };
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
  } else {
    connection.query(
      `SELECT products.*, 
        (SELECT GROUP_CONCAT(images.image_name) FROM images WHERE products.id = images.product_id) AS images,
        (SELECT GROUP_CONCAT(CONCAT(categories.category_name, ':', categories.id)) FROM categories INNER JOIN productCategories ON categories.id = productCategories.category_id WHERE products.id = productCategories.product_id) AS category_names
      FROM products 
      LEFT JOIN productCategories ON products.id = productCategories.product_id
      LEFT JOIN categories ON productCategories.category_id = categories.id`,
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
                const [categoryName, categoryId] = category.split(":");
                return {
                  label: categoryName
                    .replace(/_/g, " ")
                    .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase()),
                  value: parseInt(categoryId),
                };
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
      `SELECT 
      p.product_name,
      p.id,
      GROUP_CONCAT(DISTINCT pd.selling_price) AS selling_price,
      GROUP_CONCAT(i.image_name) AS images
      FROM productCategories pc
      INNER JOIN categories c ON pc.category_id = c.id
      INNER JOIN products p ON pc.product_id = p.id
      INNER JOIN images i ON i.product_id = p.id
      INNER JOIN productDetail pd ON p.id = pd.product_id
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
                `SELECT 
                products.id,
                products.product_name,
                GROUP_CONCAT(DISTINCT images.image_name) AS images,
                GROUP_CONCAT(DISTINCT productDetail.selling_price) AS selling_price
                FROM products
                INNER JOIN images ON products.id = images.product_id
                INNER JOIN productDetail ON products.id = productDetail.product_id 
                WHERE products.id IN (?)
                GROUP BY products.id LIMIT 5;`,
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
const editProduct = (req, res) => {
  const {
    id,
    product_name,
    product_description,
    stock,
    category_names,
    selling_price,
    imported_price,
    status,
  } = req.body;
  if (
    id &&
    product_name &&
    product_description &&
    stock &&
    category_names &&
    selling_price &&
    imported_price &&
    status
  ) {
    // Lấy danh sách id của các danh mục mới
    const newCategoryIds = category_names.map((category) => category.value);

    // Lấy danh sách id của các danh mục hiện tại trong productCategories
    connection.query(
      `SELECT category_id FROM productCategories WHERE product_id = ?`,
      [id],
      (err, currentCategories) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }

        // Lấy danh sách id của các danh mục hiện tại
        const currentCategoryIds = currentCategories.map(
          (item) => item.category_id
        );

        // Tìm danh mục cần thêm (có trong category_names mới nhưng không có trong danh sách hiện tại)
        const categoriesToAdd = newCategoryIds.filter(
          (categoryId) => !currentCategoryIds.includes(categoryId)
        );

        // Tìm danh mục cần xóa (có trong danh sách hiện tại nhưng không có trong category_names mới)
        const categoriesToDelete = currentCategoryIds.filter(
          (categoryId) => !newCategoryIds.includes(categoryId)
        );

        // Thêm các danh mục mới vào bảng productCategories
        if (categoriesToAdd.length > 0) {
          const addQuery = `INSERT INTO productCategories (product_id, category_id) VALUES ?`;
          const addValues = categoriesToAdd.map((categoryId) => [
            id,
            categoryId,
          ]);
          connection.query(addQuery, [addValues], (err, addResults) => {
            if (err) {
              console.log(err);
              return res
                .status(500)
                .json({ message: "Lỗi máy chủ khi thêm danh mục" });
            }
          });
        }

        // Xóa các danh mục không còn nằm trong category_names mới
        if (categoriesToDelete.length > 0) {
          const deleteQuery = `DELETE FROM productCategories WHERE product_id = ? AND category_id IN (?)`;
          connection.query(
            deleteQuery,
            [id, categoriesToDelete],
            (err, deleteResults) => {
              if (err) {
                console.log(err);
                return res
                  .status(500)
                  .json({ message: "Lỗi máy chủ khi xóa danh mục" });
              }
            }
          );
        }
        const productNameValid = product_name
          .toLowerCase()
          .replace(/\s+/g, "_");
        const stockValid = parseInt(stock);
        const sellingPriceValid = parseFloat(selling_price);
        const importedPriceValid = parseFloat(imported_price);
        connection.query(
          `UPDATE products SET product_name = (?),product_description = (?),stock = (?),selling_price = (?),imported_price = (?),status = (?) WHERE id = (?)`,
          [
            productNameValid,
            product_description,
            stockValid,
            sellingPriceValid,
            importedPriceValid,
            status,
            id,
          ],
          (err, results) => {
            if (err) {
              console.log(err);
              return res.status(500).json({ message: "Lỗi máy chủ" });
            }
            if (results) {
              return res.status(200).json({ message: "Edit success" });
            }
          }
        );
      }
    );
  }
};

const editImage = (req, res) => {
  const { imageDelete, id } = req.body;
  const files = req.files;
  const uploadDir = path.join(__dirname, "../../../../client/public/uploads");
  if (imageDelete && imageDelete.length > 0) {
    if (Array.isArray(imageDelete) && imageDelete.length > 1) {
      const deletedFilePaths = imageDelete.map((fileName) =>
        path.join(uploadDir, fileName)
      );
      Promise.all(
        deletedFilePaths.map((filePath) => {
          return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
        })
      );
      imageDelete.forEach((fileName) => {
        connection.query(
          "DELETE FROM `images` WHERE image_name = (?)",
          [fileName],
          function (err, results, fields) {
            if (err) {
              return res.status(500).json({ error: "Lỗi máy chủ" });
            }
          }
        );
      });
    } else {
      const deletedFilePaths = path.join(uploadDir, imageDelete);
      connection.query(
        "DELETE FROM `images` WHERE image_name = (?)",
        [imageDelete],
        function (err, results, fields) {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ error: "Có lỗi xảy ra xin thử lại sau" });
          }
          fs.access(deletedFilePaths, fs.constants.F_OK, (err) => {
            if (err) {
              console.log(err);
              return res.status(404).json({ error: "Tệp tin không tồn tại" });
            }
            fs.unlink(deletedFilePaths, (error) => {
              if (error) {
                return res.status(500).json({ error: "Lỗi khi xóa tệp tin" });
              }
            });
          });
        }
      );
    }
  }
  if (files) {
    let completed = 0;
    files.forEach((file) => {
      const fileName = file.filename;
      connection.query(
        "INSERT INTO images (image_name,product_id) VALUES (?,?)",
        [fileName, id],
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
                .json({ message: "Add image successfully" });
            }
          }
        }
      );
    });
  }
};
const deleteProduct = (req, res) => {
  const { id } = req.body;
  if (id) {
    connection.query(
      "SELECT image_name FROM images WHERE product_id = (?)",
      [id],
      function (err, data) {
        if (err) {
          return res
            .status(500)
            .json({ error: "Có lỗi xảy ra xin thử lại sau" });
        }
        if (data.length > 0) {
          const uploadDir = path.join(
            __dirname,
            "../../../../client/public/uploads"
          );
          const deletedFilePaths = data.map((fileName) =>
            path.join(uploadDir, fileName.image_name)
          );
          deletedFilePaths.forEach((filePath) => {
            fs.access(filePath, fs.constants.F_OK, (err) => {
              if (err) {
                console.log(err);
                return res.status(404).json({ error: "Tệp tin không tồn tại" });
              }
              fs.unlink(filePath, (error) => {
                if (error) {
                  return res.status(500).json({ error: "Lỗi khi xóa tệp tin" });
                }
              });
            });
          });
          data.forEach((fileName) => {
            connection.query(
              "DELETE FROM `images` WHERE image_name = (?)",
              [fileName.image_name],
              async function (err, results, fields) {
                if (err) {
                  return res.status(500).json({ error: "Lỗi máy chủ" });
                }
              }
            );
          });
          connection.query(
            "DELETE FROM products WHERE id = (?)",
            [id],
            function (err, results, fields) {
              if (err) {
                return res
                  .status(500)
                  .json({ error: "Có lỗi xảy ra xin thử lại sau" });
              }
              return res.status(200).json({ message: "Delete success" });
            }
          );
        }
      }
    );
  }
};
const searchProducts = (req, res) => {
  const search = req.params.value;
  if (search) {
    connection.query(
      `SELECT products.id,
        products.product_name,
        products.selling_price,
        products.status,
        GROUP_CONCAT(images.image_name) AS images 
      FROM products 
      INNER JOIN images ON products.id = images.product_id 
      WHERE products.product_name LIKE ?
      GROUP BY products.id`,
      [`%${search}%`],
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
            return {
              ...item,
              product_name: productName,
            };
          });

          return res
            .status(200)
            .json({ message: "Thành công", results: transformedData });
        } else {
          return res.status(400).json({ message: "Thất bại", results: [] });
        }
      }
    );
  } else {
    return res.status(400).json({ message: "Không có search", results: [] });
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
  editProduct,
  featureProduct,
  editImage,
  deleteProduct,
  searchProducts,
  viewProductsByCategory,
};
