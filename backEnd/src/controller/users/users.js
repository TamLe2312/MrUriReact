const connection = require("../../config/database");

require("dotenv").config();

const getUsers = (req, res) => {
  const sql = "SELECT * FROM users";
  connection.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
    if (data.length > 0) {
      return res.status(200).json({ message: "Thành công", results: data });
    } else {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }
  });
};

module.exports = {
  getUsers,
};
