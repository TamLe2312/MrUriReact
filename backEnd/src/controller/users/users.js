const connection = require("../../config/database");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const fs = require("fs");
const Mustache = require("mustache");
const jwt = require("jsonwebtoken");
const mailer = require("../../utils/mailer");

require("dotenv").config();

const verifyToken = (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, "your_secret_key_here", (err, decoded) => {
      if (err) {
        return res.status(500).json({ message: "Invalid token" });
      }
      connection.query(
        "SELECT id,role FROM users WHERE id = ?",
        [decoded.userId],
        async function (err, results, fields) {
          if (err) {
            return res.status(500).json({ error: "Lỗi máy chủ" });
          }
          if (results.length > 0) {
            return res
              .status(200)
              .json({ mesage: "Success", results: results[0] });
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

const getUserById = (req, res) => {
  const id = req.params.id;
  if (id) {
    const sql = "SELECT username,role,email,name FROM users WHERE id = (?)";
    connection.query(sql, [id], (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }
      if (data.length > 0) {
        return res.status(200).json({ message: "Thành công", results: data });
      } else {
        return res.status(400).json({ message: "Người dùng không tồn tại" });
      }
    });
  }
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

const forgotPassword = (req, res) => {
  const { email } = req.body;
  console.log(email);
  if (email) {
    connection.query(
      "SELECT * FROM Users WHERE email = ?",
      [email],
      async function (err, results, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (results.length > 0) {
          bcrypt.hash(email, saltRounds, function (err, hash) {
            if (!err) {
              const filePath = "../backEnd/src/public/html/EmailTemplate.html";
              fs.readFile(filePath, "utf8", (err, content) => {
                if (err) {
                  console.error(`Đã xảy ra lỗi khi đọc file: ${err}`);
                  return;
                }
                let data = {
                  email: email,
                  action_url: `${process.env.APP_URL}/verify-token?email=${email}&token=${hash}`,
                };
                let htmlContent = Mustache.render(content, data);
                mailer.sendMail(
                  email,
                  "Forgot Password Notification",
                  htmlContent
                );
                connection.query(
                  "UPDATE Users SET forgetToken = ? WHERE email = ?",
                  [hash, email],
                  function (err, results, fields) {
                    if (err) {
                      console.error(err);
                      return res.status(500).json({ error: "Lỗi máy chủ" });
                    } else {
                      return res.status(200).json({ message: "Send Success" });
                    }
                  }
                );
              });
            }
          });
        } else {
          return res.status(400).json({ error: "Wrong email" });
        }
      }
    );
  }
};

const verifyTokenPassword = (req, res) => {
  const { password, email, token } = req.body;
  if (password && email && token) {
    connection.query(
      "SELECT * FROM Users WHERE forgetToken = ? AND email = ?",
      [token, email],
      async function (err, results, fields) {
        if (err) {
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (results.length > 0) {
          const match = await bcrypt.compare(email, results[0].forgetToken);
          if (match) {
            let TokenNew = email + "tamle23122004";
            bcrypt.hash(TokenNew, saltRounds, function (err, hash) {
              if (err) {
                return res.status(500).json({ error: "Lỗi máy chủ" });
              }
              connection.query(
                "UPDATE USERS SET forgetToken = ? WHERE email = ?",
                [hash, email],
                async function (err, results, fields) {
                  if (err) {
                    return res.status(500).json({ error: "Lỗi máy chủ" });
                  }
                  const myPlaintextPassword = password;
                  bcrypt.hash(
                    myPlaintextPassword,
                    saltRounds,
                    function (err, hash) {
                      if (err) {
                        return res.status(500).json({ error: "Lỗi máy chủ" });
                      }
                      connection.query(
                        "UPDATE USERS SET password = ? WHERE email = ?",
                        [hash, email],
                        async function (err, results, fields) {
                          if (err) {
                            return res
                              .status(500)
                              .json({ error: "Lỗi máy chủ" });
                          }
                          return res
                            .status(200)
                            .json({ message: "Change password success" });
                        }
                      );
                    }
                  );
                }
              );
            });
          } else {
            return res.status(400).json({ error: "Something went wrong" });
          }
        } else {
          return res.status(400).json({ error: "Wrong email" });
        }
      }
    );
  }
};

const addUser = (req, res) => {
  const { username, password, email, role } = req.body;
  if (username && password && email && role) {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (!err) {
        connection.query(
          "SELECT * FROM Users WHERE username = ? OR email = ?",
          [username, email],
          function (err, results, fields) {
            if (err) {
              return res.status(500).json({ error: "Lỗi máy chủ" });
            }
            if (results.length > 0) {
              return res
                .status(400)
                .json({ message: "Username or email was taken" });
            } else {
              const usernameValid = username.toLowerCase();
              const emailValid = email.toLowerCase();
              connection.query(
                "INSERT INTO Users (username, password, email,role) VALUES (?, ?, ?,?)",
                [usernameValid, hash, emailValid, role],
                function (err, results, fields) {
                  if (err) {
                    return res.status(500).json({ error: "Lỗi máy chủ" });
                  }
                  if (results) {
                    res.status(200).json({ message: "Create user success" });
                  }
                }
              );
            }
          }
        );
      }
    });
  }
};
const editUser = (req, res) => {
  const { username, role, email } = req.body;
  if (username && role && email) {
    const usernameValid = username.toLowerCase();
    const emailValid = email.toLowerCase();
    connection.query(
      "UPDATE Users SET username = (?),email = (?),role = (?) WHERE username = ? OR email = ?",
      [usernameValid, emailValid, role, username, email],
      function (err, results, fields) {
        if (err) {
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (results) {
          res.status(200).json({ message: "Edit user success" });
        }
      }
    );
  }
};

const deleteUser = (req, res) => {
  const id = req.params.id;
  if (id) {
    connection.query(
      `DELETE FROM users WHERE id = (?)`,
      [id],
      (err, results) => {
        if (err) {
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        if (results) {
          return res.status(200).json({ message: "Delete Success" });
        }
      }
    );
  }
};

const editProfile = (req, res) => {
  const { username, email, name, id } = req.body;
  if (username && email && name && id) {
    const usernameValid = username.toLowerCase();
    const emailValid = email.toLowerCase();
    if (name === "None") {
      connection.query(
        `UPDATE users SET username = (?),email = (?),name = (?) WHERE id = (?)`,
        [usernameValid, emailValid, null, id],
        (err, results) => {
          if (err) {
            return res.status(500).json({ message: "Lỗi máy chủ" });
          }
          if (results) {
            return res.status(200).json({ message: "Edit Success" });
          }
        }
      );
    } else {
      const nameValid = name.toLowerCase();
      connection.query(
        `UPDATE users SET username = (?),email = (?),name = (?) WHERE id = (?)`,
        [usernameValid, emailValid, nameValid, id],
        (err, results) => {
          if (err) {
            return res.status(500).json({ message: "Lỗi máy chủ" });
          }
          if (results) {
            return res.status(200).json({ message: "Edit Success" });
          }
        }
      );
    }
  }
};
const editPassword = (req, res) => {
  const { currentPassword, newPassword, id } = req.body;
  if (currentPassword && newPassword && id) {
    connection.query(
      `SELECT password FROM users WHERE id = (?)`,
      [id],
      async (err, data) => {
        if (err) {
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        if (data) {
          const match = await bcrypt.compare(currentPassword, data[0].password);
          if (match) {
            const myPlaintextPassword = newPassword;
            bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
              if (!err) {
                connection.query(
                  `UPDATE users SET password = (?) WHERE id = (?)`,
                  [hash, id],
                  (err, results) => {
                    if (err) {
                      return res.status(500).json({ message: "Lỗi máy chủ" });
                    }
                    if (results) {
                      return res.status(200).json({ message: "Edit Success" });
                    }
                  }
                );
              }
            });
          } else {
            return res.status(400).json({ message: "Password invalid" });
          }
        }
      }
    );
  }
};

module.exports = {
  verifyToken,
  getUsers,
  getUserById,
  signIn,
  signUp,
  forgotPassword,
  verifyTokenPassword,
  deleteUser,
  editUser,
  addUser,
  editProfile,
  editPassword,
};
