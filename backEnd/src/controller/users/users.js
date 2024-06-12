const connection = require("../../config/database");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const path = require("path");
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
    const sql =
      "SELECT username,role,email,name,address,phone_number FROM users WHERE id = (?)";
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
const getSlide = (req, res) => {
  const sql = `
  SELECT sliders.*, categories.category_name 
  FROM sliders 
  INNER JOIN categories 
  ON categories.id = sliders.path
`;
  connection.query(sql, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
    if (data.length > 0) {
      const transformedData = data.map((item) => {
        const altValid = item.alt
          .replace(/_/g, " ")
          .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
        const categoryNameValid = item.category_name
          .replace(/_/g, " ")
          .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
        return {
          ...item,
          alt: altValid,
          category_name: categoryNameValid,
        };
      });
      return res
        .status(200)
        .json({ message: "Thành công", results: transformedData });
    }
  });
};
const getSlideById = (req, res) => {
  const id = req.params.id;
  if (id) {
    connection.query(
      `SELECT sliders.*, categories.category_slug FROM sliders INNER JOIN categories ON categories.id = sliders.path WHERE sliders.id = (?)`,
      [id],
      (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        if (data.length > 0) {
          const transformedData = data.map((item) => {
            const altValid = item.alt
              .replace(/_/g, " ")
              .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
            return {
              ...item,
              alt: altValid,
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
const addSlide = (req, res) => {
  const { alt, pathCat } = req.body;
  const file = req.file;
  if (alt && pathCat && file) {
    const altValid = alt.toLowerCase().replace(/\s+/g, "_");
    const fileName = file.filename;
    // console.log(fileName, altValid, path);
    connection.query(
      "INSERT INTO sliders (img,alt,path) VALUES (?,?,?)",
      [fileName, altValid, pathCat],
      function (err, result, fields) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        return res.status(200).json({ message: "Add success" });
      }
    );
  }
};
const editSlide = (req, res) => {
  const { id, alt, pathCat, urlImg } = req.body;
  if (id && alt && pathCat) {
    if (urlImg) {
      const altValid = alt.toLowerCase().replace(/\s+/g, "_");
      connection.query(
        "SELECT * FROM sliders WHERE alt = (?)",
        [altValid],
        function (err, data) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Lỗi máy chủ" });
          }
          if (data.length > 0) {
            return res.status(400).json({ message: "Alt was taken" });
          } else {
            connection.query(
              "UPDATE sliders SET alt = (?),img = (?),path=(?) WHERE id = (?)",
              [altValid, urlImg, pathCat, id],
              function (err, result, fields) {
                if (err) {
                  console.error(err);
                  return res.status(500).json({ error: "Lỗi máy chủ" });
                }
                return res.status(200).json({ message: "Update success" });
              }
            );
          }
        }
      );
    } else {
      const altValid = alt.toLowerCase().replace(/\s+/g, "_");
      connection.query(
        "SELECT * FROM sliders WHERE alt = ?",
        [altValid],
        function (err, data) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Lỗi máy chủ" });
          }
          if (data.length > 0) {
            return res.status(400).json({ message: "Alt was taken" });
          } else {
            connection.query(
              "SELECT img FROM sliders WHERE id = ?",
              [id],
              function (err, dataImg) {
                if (err) {
                  console.error(err);
                  return res.status(500).json({ error: "Lỗi máy chủ" });
                }
                const file = req.file.filename;
                const uploadDir = path.join(
                  __dirname,
                  "../../../../client/public/uploads"
                );
                const imgDelete = path.join(uploadDir, dataImg[0].img);

                connection.query(
                  "UPDATE sliders SET alt = ?, img = ?, path = ? WHERE id = ?",
                  [altValid, file, pathCat, id],
                  function (err, result, fields) {
                    if (err) {
                      console.error(err);
                      return res.status(500).json({ error: "Lỗi máy chủ" });
                    }
                    fs.access(imgDelete, fs.constants.F_OK, (err) => {
                      if (err) {
                        return res
                          .status(404)
                          .json({ error: "Tệp tin không tồn tại" });
                      }
                      fs.unlink(imgDelete, (error) => {
                        if (error) {
                          return res
                            .status(500)
                            .json({ error: "Lỗi khi xóa tệp tin" });
                        }
                        return res
                          .status(200)
                          .json({ message: "Update success" });
                      });
                    });
                  }
                );
              }
            );
          }
        }
      );
    }
  }
};
const deleteSlide = (req, res) => {
  const id = req.params.id;
  if (id) {
    connection.query(
      `SELECT img FROM sliders WHERE id = (?)`,
      [id],
      (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        if (data.length > 0) {
          const sql = "DELETE FROM sliders WHERE id = (?)";
          connection.query(sql, [id], (err, results, field) => {
            if (err) {
              return res.status(500).json({ message: "Lỗi máy chủ" });
            }
            if (results) {
              const uploadDir = path.join(
                __dirname,
                "../../../../client/public/uploads"
              );
              const filePath = path.join(uploadDir, data[0].img);
              fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                  return res
                    .status(404)
                    .json({ error: "Tệp tin không tồn tại" });
                }
                fs.unlink(filePath, (error) => {
                  if (error) {
                    return res
                      .status(500)
                      .json({ error: "Lỗi khi xóa tệp tin" });
                  }
                  return res.status(200).json({ message: "Delete Success" });
                });
              });
            }
          });
        }
      }
    );
  }
};
const handleLoginGoogle = (req, res) => {
  const { displayName, email, localId, photoUrl } = req.body.user;
  if (displayName && email && localId && photoUrl) {
    connection.query(
      `SELECT * FROM users WHERE username = (?)`,
      [localId],
      (err, data) => {
        if (err) {
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        if (data.length > 0) {
          return res.status(200).json({
            message: "Login Success",
            isGoogle: true,
            localId: localId,
          });
        } else {
          const myPlaintextPassword = localId;
          bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {
            if (!err) {
              connection.query(
                `INSERT INTO users (username,googleId,name,email,password,avatar) VALUES (?,?,?,?,?)`,
                [localId, localId, displayName, email, hash, photoUrl],
                (err, results) => {
                  if (err) {
                    return res.status(500).json({ message: "Lỗi máy chủ" });
                  }
                  return res.status(200).json({
                    message: "Login Success",
                    isGoogle: true,
                    localId: localId,
                  });
                }
              );
            }
          });
        }
      }
    );
  }
};
const verifyGoogle = (req, res) => {
  const { localId } = req.body;
  if (localId) {
    connection.query(
      "SELECT id,role FROM users WHERE username = ? OR googleId = (?)",
      [localId, localId],
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
  }
};
const addressForm = (req, res) => {
  const { address, phoneNumber, provinces, districts, wards, id } = req.body;
  if (address && phoneNumber && provinces && districts && wards) {
    const parsedProvinces = JSON.parse(provinces);
    const parsedDistricts = JSON.parse(districts);
    const parsedWards = JSON.parse(wards);
    connection.query(
      "SELECT * FROM addressInform WHERE user_id = (?)",
      [id],
      async function (err, data, fields) {
        if (err) {
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (data.length > 0) {
          connection.query(
            "UPDATE addressInform SET phone_number = (?),address = (?),province = (?),district = (?),ward = (?),district_id = (?),ward_code = (?) WHERE user_id = (?)",
            [
              phoneNumber,
              address,
              parsedProvinces.label,
              parsedDistricts.label,
              parsedWards.label,
              parsedDistricts.value,
              parsedWards.value,
              id,
            ],
            async function (err, results, fields) {
              if (err) {
                return res.status(500).json({ error: "Lỗi máy chủ" });
              }
              if (results) {
                return res.status(200).json({ message: "Add Success" });
              }
            }
          );
        } else {
          connection.query(
            "INSERT INTO addressInform (user_id,phone_number,address,province,district,ward,district_id,ward_code) VALUES (?,?,?,?,?,?,?,?)",
            [
              id,
              phoneNumber,
              address,
              parsedProvinces.label,
              parsedDistricts.label,
              parsedWards.label,
              parsedDistricts.value,
              parsedWards.value,
            ],
            async function (err, results, fields) {
              if (err) {
                return res.status(500).json({ error: "Lỗi máy chủ" });
              }
              if (results) {
                return res.status(200).json({ message: "Add Success" });
              }
            }
          );
        }
      }
    );
  }
};
const addComment = (req, res) => {
  const { userId, productId, rate, comment } = req.body;
  if (userId && productId && rate && comment) {
    connection.query(
      "INSERT INTO comments (user_id,product_id,comment,rate) VALUES (?,?,?,?)",
      [userId, productId, comment, rate],
      async function (err, results, fields) {
        if (err) {
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (results) {
          return res.status(200).json({ message: "Comment Success" });
        }
      }
    );
  }
};
const viewComment = (req, res) => {
  const id = req.params.id;
  if (id) {
    connection.query(
      `SELECT comments.id,comments.comment,comments.rate,users.username,comments.created_at FROM comments 
      INNER JOIN users ON comments.user_id = users.id
      INNER JOIN products ON comments.product_id = products.id
      WHERE products.id = (?)`,
      [id],
      async function (err, data, fields) {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (data.length > 0) {
          const transformedData = data.map((item) => {
            const usernameValid = item.username
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
              username: usernameValid,
              created_at: createdAt,
            };
          });
          return res
            .status(200)
            .json({ message: "Thành công", results: transformedData });
        } else {
          return res.status(200).json({ message: "Thành công", results: [] });
        }
      }
    );
  }
};

const isAddress = (req, res) => {
  const id = req.params.id;
  if (id) {
    connection.query(
      "SELECT * FROM addressInform WHERE user_id = (?)",
      [id],
      async function (err, data, fields) {
        if (err) {
          return res.status(500).json({ error: "Lỗi máy chủ" });
        }
        if (data.length > 0) {
          return res
            .status(200)
            .json({ message: "Thành công", results: data[0] });
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
  getSlide,
  getSlideById,
  addSlide,
  editSlide,
  deleteSlide,
  handleLoginGoogle,
  verifyGoogle,
  addressForm,
  addComment,
  viewComment,
  isAddress,
};
