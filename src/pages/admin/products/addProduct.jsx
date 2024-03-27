import { Container, Grid, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useEditedProduct } from "../../../context";

const AddProduct = () => {
  const { editedProduct, isEdit, setEditedProduct, setIsEdit } =
    useEditedProduct();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    image: "",
    stock: "",
    price: "",
  });

  useEffect(() => {
    if (editedProduct && isEdit) {
      setFormData({
        id: editedProduct.id || "",
        productName: editedProduct.productName || "",
        image: editedProduct.image || "",
        stock: editedProduct.stock || "",
        price: editedProduct.price || "",
      });
    }
  }, [editedProduct, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBack = () => {
    setIsEdit(false);
    setEditedProduct();
    navigate("/dashboard/products");
  };
  const handleAdd = async () => {
    if (editedProduct) {
      try {
        const res = await axios.put(
          `http://localhost:3001/products/${formData.id}`,
          formData
        );
        console.log(res);
        setIsEdit(false);
        setEditedProduct();
        toast.success("Edit Success");
        navigate("/dashboard/products");
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3001/products",
          formData
        );
        if (response.status === 201) {
          toast.success("Add Success");
          navigate("/dashboard/products");
        }
      } catch (error) {
        console.error("Error adding post:", error);
        toast.error("Add Failed");
      }
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <div className="handleAddContainer">
          <p>Products</p>
          <button className="btn btn-success" onClick={handleBack}>
            Back
          </button>
        </div>
        <Grid container>
          <Grid item xs={12}>
            <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Image</label>
                <input
                  type="text"
                  className="form-control"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="text"
                  className="form-control"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="text"
                  className="form-control"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              <button
                className={
                  "btn mt-3" + (isEdit ? " btn-success" : " btn-primary")
                }
                onClick={handleAdd}
              >
                {isEdit ? "Edit" : "Submit"}
              </button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AddProduct;
