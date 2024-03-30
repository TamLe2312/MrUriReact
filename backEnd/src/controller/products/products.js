const connection = require("../../config/database");

require("dotenv").config();

const getProducts = (req, res) => {
  const sql = "SELECT * FROM products";
  connection.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
    if (data.length > 0) {
      return res.status(200).json({ message: "Thành công", results: data });
    } else {
      return res.status(400).json({ message: "Sản phẩm không tồn tại" });
    }
  });
};

const addProducts = (req, res) => {
  const { formDatas } = req.body;
  const files = req.files;
  if (formDatas && files) {
  }
};
module.exports = {
  getProducts,
  addProducts,
};
