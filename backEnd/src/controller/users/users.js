const connection = require("../../config/database");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

require("dotenv").config();

const verifyToken = (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, "your_secret_key_here", (err, decoded) => {
      if (err) {
        return res.status(500).json({ message: "Invalid token" });
      }
      connection.query(
        "SELECT * FROM users WHERE id = ?",
        [decoded.userId],
        async function (err, results, fields) {
          if (err) {
            return res.status(500).json({ error: "Lỗi máy chủ" });
          }
          if (results.length > 0) {
            return res
              .status(200)
              .json({ mesage: "Success", results: results[0].role });
          }
        }
      );
    });
  }
};

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

const signIn = (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    connection.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async function (err, results, fields) {
        if (err) {
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        if (results.length > 0) {
          const match = await bcrypt.compare(password, results[0].password);
          if (match) {
            const token = jwt.sign(
              { userId: results[0].id, username: results[0].username },
              "your_secret_key_here",
              { expiresIn: "1h" }
            );
            return res.json({ message: "Login Success", results: { token } });
          } else {
            return res
              .status(400)
              .json({ message: "Wrong username or password" });
          }
        } else {
          return res
            .status(400)
            .json({ message: "Wrong username or password" });
        }
      }
    );
  }
};

const signUp = (req, res) => {
  const { username, email, password } = req.body;
  if (username && email && password) {
    connection.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email],
      function (err, results, fields) {
        if (err) {
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        if (results.length > 0) {
          return res
            .status(400)
            .json({ message: "Username or email was used" });
        }
        const myPlaintextPassword = password;
        bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
          if (!err) {
            connection.query(
              "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
              [username, hash, email],
              function (err, results, fields) {
                if (err) {
                  return res.status(500).json({ message: "Lỗi máy chủ" });
                }
                res.status(200).json({ message: "Sign up success" });
              }
            );
          }
        });
      }
    );
  }
};

module.exports = {
  verifyToken,
  getUsers,
  signIn,
  signUp,
};
