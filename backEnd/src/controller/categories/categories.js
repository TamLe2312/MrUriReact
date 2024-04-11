const connection = require("../../config/database");

require("dotenv").config();

const getCategories = (req, res) => {
  connection.query(
    `
    SELECT c.*, p.category_name AS parent_category_name
    FROM categories c
    LEFT JOIN categories p ON c.parent_category = p.id
  `,
    (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }
      if (data.length > 0) {
        const transformedData = data.map((item) => {
          const categoryName = item.category_name
            .replace(/_/g, " ")
            .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
          const parentCategoryName = item.parent_category_name
            ? item.parent_category_name
                .replace(/_/g, " ")
                .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase())
            : null;
          return {
            ...item,
            category_name: categoryName,
            parent_category_name: parentCategoryName,
          };
        });
        return res
          .status(200)
          .json({ message: "Success", results: transformedData });
      } else {
        return res.status(200).json({ message: "Success", results: [] });
      }
    }
  );
};

const getParentCategories = (req, res) => {
  connection.query(`SELECT id,category_name FROM categories`, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
    if (data.length > 0) {
      const transformedData = data.map((item) => {
        const categoryName = item.category_name
          .replace(/_/g, " ")
          .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());

        return {
          ...item,
          category_name: categoryName,
        };
      });
      return res
        .status(200)
        .json({ message: "Success", results: transformedData });
    }
  });
};

const addCategory = (req, res) => {
  const { categoryName, categorySlug, categoryParent, status } = req.body;
  if (categoryName && categorySlug && categoryParent && status) {
    const categoryNameValid = categoryName.toLowerCase().replace(/\s+/g, "_");
    let categoryExists = false;

    connection.query(`SELECT category_name FROM categories`, (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }
      if (data.length > 0) {
        data.forEach((child) => {
          if (child.category_name === categoryNameValid) {
            categoryExists = true;
          }
        });
      }
      if (categoryExists) {
        return res.status(400).json({ message: "Category name had exist" });
      } else {
        connection.query(
          `INSERT INTO categories (category_name,category_slug,parent_category,status) VALUES (?,?,?,?)`,
          [categoryNameValid, categorySlug, categoryParent, status],
          (err, data) => {
            if (err) {
              return res.status(500).json({ message: "Lỗi máy chủ" });
            }
            return res.status(200).json({ message: "Add Success" });
          }
        );
      }
    });
  }
};

const deleteCategory = (req, res) => {
  const id = req.params.id;
  if (id) {
    const deleteCategoryChild = (categoryId) => {
      connection.query(
        `SELECT id FROM categories WHERE parent_category = (?)`,
        [categoryId],
        (err, childIds) => {
          if (err) {
            return res.status(500).json({ message: "Lỗi máy chủ" });
          }
          if (childIds.length > 0) {
            childIds.forEach((child) => {
              deleteCategoryChild(child.id);
            });
          }
          connection.query(
            `DELETE FROM categories WHERE id = (?)`,
            [categoryId],
            (err, data) => {
              if (err) {
                return res.status(500).json({ message: "Lỗi máy chủ" });
              }
            }
          );
        }
      );
    };
    deleteCategoryChild(id);
    return res.status(200).json({ message: "Delete Success" });
  } else {
    return res.status(400).json({ message: "Thiếu ID" });
  }
};

const getProducts = (req, res) => {
  const { slug, sortType } = req.body;
  if (slug && sortType) {
    let orderByClause = "";
    switch (sortType) {
      case "default":
        orderByClause = "ORDER BY products.id";
        break;
      case "lowToHigh":
        orderByClause = "ORDER BY products.selling_price ASC";
        break;
      case "highToLow":
        orderByClause = "ORDER BY products.selling_price DESC";
        break;
      default:
        return res.status(400).json({ message: "Loại sắp xếp không hợp lệ" });
    }
    connection.query(
      `SELECT products.id,
      products.product_name,
      products.selling_price,
      products.status,
      GROUP_CONCAT(images.image_name) AS images
      FROM productCategories
      INNER JOIN categories ON productCategories.category_id = categories.id
      INNER JOIN products ON productCategories.product_id = products.id
      INNER JOIN images ON products.id = images.product_id 
      WHERE categories.category_slug = (?)
      GROUP BY products.id
      ${orderByClause}`,
      [slug],
      (err, data) => {
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
          return res.status(404).json({ message: "Không có sản phẩm nào" });
        }
      }
    );
  }
};

const editCategory = (req, res) => {
  const { categoryName, categorySlug, categoryParent, status } = req.body;
  const id = req.params.id;
  if (categoryName && categorySlug && categoryParent && status && id) {
    const categoryNameValid = categoryName.toLowerCase().replace(/\s+/g, "_");
    let categoryExists = false;
    connection.query(`SELECT category_name FROM categories`, (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }
      if (data.length > 0) {
        data.forEach((child) => {
          if (child.category_name === categoryNameValid) {
            categoryExists = true;
          }
        });
      }
      if (categoryExists) {
        return res.status(400).json({ message: "Category name had exist" });
      } else {
        connection.query(
          `UPDATE categories SET category_name = (?),category_slug = (?),parent_category = (?),status = (?) WHERE id = (?)`,
          [categoryNameValid, categorySlug, categoryParent, status, id],
          (err, data) => {
            if (err) {
              console.log(err);
              return res.status(500).json({ message: "Lỗi máy chủ" });
            }
            return res.status(200).json({ message: "Edit Success" });
          }
        );
      }
    });
  }
};
const relatedCategories = (req, res) => {
  const id = req.params.id;
  if (id) {
    connection.query(
      `SELECT c.id, COUNT(pc.product_id) AS total_products,c.category_name,c.category_slug
      FROM categories c
      LEFT JOIN productCategories pc ON c.id = pc.category_id
      WHERE c.category_slug != ?
      GROUP BY c.id
      ORDER BY RAND()
      LIMIT 5`,
      [id],
      (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        if (data.length > 0) {
          const transformedData = data.map((item) => {
            const categoryName = item.category_name
              .replace(/_/g, " ")
              .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
            return {
              ...item,
              category_name: categoryName,
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

const relatedCategoriesDetail = (req, res) => {
  connection.query(
    `SELECT c.id, COUNT(pc.product_id) AS total_products,c.category_name,c.category_slug
      FROM categories c
      LEFT JOIN productCategories pc ON c.id = pc.category_id
      GROUP BY c.id
      ORDER BY RAND()
      LIMIT 5`,
    (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }
      if (data.length > 0) {
        const transformedData = data.map((item) => {
          const categoryName = item.category_name
            .replace(/_/g, " ")
            .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
          return {
            ...item,
            category_name: categoryName,
          };
        });
        return res
          .status(200)
          .json({ message: "Success", results: transformedData });
      }
    }
  );
};

module.exports = {
  getCategories,
  getParentCategories,
  deleteCategory,
  addCategory,
  getProducts,
  editCategory,
  relatedCategories,
  relatedCategoriesDetail,
};
