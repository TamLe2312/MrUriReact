const connection = require("../../config/database");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const viewVariations = (req, res) => {
  const sql = `SELECT * FROM variation`;
  connection.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
    if (data.length > 0) {
      const transformedData = data.map((item) => {
        const variationName = item.name
          .replace(/_/g, " ")
          .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());

        return {
          ...item,
          variationName: variationName,
        };
      });
      return res
        .status(200)
        .json({ message: "Thành công", results: transformedData });
    }
  });
};
const viewVariationValues = (req, res) => {
  const sql = `SELECT variationOption.id,variation.name,variationOption.value FROM variationOption
  INNER JOIN variation ON variationOption.variation_id = variation.id`;
  connection.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
    if (data.length > 0) {
      const transformedData = data.map((item) => {
        const variationName = item.name
          .replace(/_/g, " ")
          .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());
        const valueValid = item.value
          .replace(/_/g, " ")
          .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());

        return {
          ...item,
          variationName: variationName,
          valueValid: valueValid,
        };
      });
      return res
        .status(200)
        .json({ message: "Thành công", results: transformedData });
    }
  });
};
const addVariation = (req, res) => {
  const { name } = req.body;
  if (name) {
    const nameValid = name.toLowerCase().replace(/\s+/g, "_");
    connection.query(
      `INSERT INTO variation (name) VALUES (?)`,
      [nameValid],
      (err, data) => {
        if (err) {
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        return res.status(200).json({ message: "Add Success" });
      }
    );
  }
};
const addVariationValue = (req, res) => {
  const { variation, value } = req.body;
  if (variation && value) {
    const valueValid = value.toLowerCase().replace(/\s+/g, "_");
    connection.query(
      `INSERT INTO variationOption (variation_id,value) VALUES (?,?)`,
      [variation, valueValid],
      (err, data) => {
        if (err) {
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        return res.status(200).json({ message: "Add Success" });
      }
    );
  }
};
const getVariationById = (req, res) => {
  const id = req.params.id;
  if (id) {
    const sql = "SELECT * FROM variation WHERE id = (?)";
    connection.query(sql, [id], (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }
      if (data.length > 0) {
        const transformedData = data.map((item) => {
          const variationName = item.name
            .replace(/_/g, " ")
            .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());

          return {
            ...item,
            variationName: variationName,
          };
        });
        return res
          .status(200)
          .json({ message: "Thành công", results: transformedData });
      }
    });
  }
};
const getVariationValueById = (req, res) => {
  const id = req.params.id;
  if (id) {
    const sql = "SELECT * FROM variationOption WHERE id = (?)";
    connection.query(sql, [id], (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi máy chủ" });
      }
      if (data.length > 0) {
        const transformedData = data.map((item) => {
          const valueValid = item.value
            .replace(/_/g, " ")
            .replace(/(?:^|\s)\S/g, (c) => c.toUpperCase());

          return {
            ...item,
            valueValid: valueValid,
          };
        });
        return res
          .status(200)
          .json({ message: "Thành công", results: transformedData });
      }
    });
  }
};
const editVariation = (req, res) => {
  const { name, id } = req.body;
  if (name && id) {
    connection.query(
      `UPDATE variation SET name = (?) WHERE id = (?)`,
      [name, id],
      (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        return res.status(200).json({ message: "Edit Success" });
      }
    );
  }
};
const deleteVariation = (req, res) => {
  const id = req.params.id;
  if (id) {
    connection.query(
      `DELETE FROM variation WHERE id = (?)`,
      [id],
      (err, data) => {
        if (err) {
          return res.status(500).json({ message: "Lỗi máy chủ" });
        }
        return res.status(200).json({ message: "Delete Success" });
      }
    );
  }
};

module.exports = {
  viewVariations,
  viewVariationValues,
  addVariation,
  addVariationValue,
  getVariationById,
  getVariationValueById,
  deleteVariation,
  editVariation,
};
