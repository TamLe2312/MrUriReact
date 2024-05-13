import { Container, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { EditProductContext } from "../../../context/editProductProvider";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import "./products.css";
import Validation from "../../../components/validation/validation";
import * as request from "../../../utilities/request";
import Select from "react-select";
import { SocketContext } from "../../../context/socketContext";

const AddProduct = () => {
  const { editedProduct, isEdit, setEditedProduct, setIsEdit } =
    useContext(EditProductContext);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    stock: "",
    importedPrice: "",
    sellingPrice: "",
    status: "stock",
    selectedCategories: [],
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);

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

  const handleChangeCategories = (selectedCategory) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedCategories: selectedCategory,
    }));
  };
  const handleImages = (e) => {
    const files = e.target.files;
    const newImageFiles = [];

    if (!files || files.length === 0) {
      toast.error("You must upload atleast one image");
      return;
    }
    for (let i = 0; i < files.length; i++) {
      if (!files[i].type.startsWith("image/")) {
        toast.error("You was upload wrong type of image");
        return;
      }

      const maxSizeInBytes = 10 * 1024 * 1024;
      if (files[i].size > maxSizeInBytes) {
        toast.error("Image too heavy");
        return;
      }
      newImageFiles.push({
        id: uuidv4(),
        image: files[i],
        url: URL.createObjectURL(files[i]),
      });
    }

    setImages([...images, ...newImageFiles]);
    e.target.value = null;
  };

  const handleDeleteImg = (img) => {
    // console.log(img);
    const updatedImages = images.filter((image) => image.id !== img.id);
    setImages(updatedImages);
  };

  const handleBack = () => {
    navigate("/dashboard/products");
  };

  const validate = () => {
    const errors = Validation(formData, "products");
    let isValid = true;
    setErrors(errors);

    if (!images) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        images: "Images cannot be empty",
      }));
    }
    if (
      Object.keys(errors).length !== 0 ||
      !Object.values(formData).every((value) => value !== "")
    ) {
      isValid = false;
    }

    return isValid;
  };

  const handleAdd = async () => {
    setErrors({});
    if (editedProduct) {
      try {
        const res = await axios.put(
          `http://localhost:3001/products/${formData.id}`,
          formData
        );
        // console.log(res);
        setIsEdit(false);
        setEditedProduct();
        toast.success("Edit Success");
        navigate("/dashboard/products");
      } catch (err) {
        console.error(err);
      }
    } else {
      const isValid = validate();
      // console.log(options);
      await socket.emit("add_product");
      if (isValid) {
        try {
          const formDatas = new FormData();
          formDatas.append("productName", formData.productName);
          formDatas.append("importedPrice", formData.importedPrice);
          formDatas.append("productDescription", formData.productDescription);
          formDatas.append("sellingPrice", formData.sellingPrice);
          formDatas.append("status", formData.status);
          formDatas.append("stock", formData.stock);
          formData.selectedCategories.forEach((category) => {
            formDatas.append("productCategories", category.value);
          });
          images.forEach((image) => {
            formDatas.append("images", image.image);
          });

          const response = await request.postRequest(`products/add`, formDatas);
          if (response.status === 200) {
            toast.success(response.data.message);
            navigate("/dashboard/products");
          }
        } catch (error) {
          console.error("Error adding post:", error);
          toast.error("Add Failed");
        }
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await request.getRequest("categories");
      if (res.data.results.length > 0) {
        const newOptions = res.data.results
          .filter((category) => category.status === 1)
          .map((category) => ({
            value: category.id,
            label: category.category_name,
          }));
        setOptions((prevOptions) => prevOptions.concat(newOptions));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
                  className={
                    errors.productName
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                />
                {errors.productName && (
                  <div
                    id="validationServerBrandFeedback"
                    className="invalid-feedback"
                  >
                    {errors.productName}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Product Description</label>
                <textarea
                  className={
                    errors.productDescription
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  id="productDescription"
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleChange}
                ></textarea>
                {errors.productDescription && (
                  <div
                    id="validationServerBrandFeedback"
                    className="invalid-feedback"
                  >
                    {errors.productDescription}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="text"
                  className={
                    errors.stock ? "form-control is-invalid" : "form-control"
                  }
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                />
                {errors.stock && (
                  <div
                    id="validationServerBrandFeedback"
                    className="invalid-feedback"
                  >
                    {errors.stock}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Imported Price</label>
                <input
                  type="text"
                  className={
                    errors.importedPrice
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  id="importedPrice"
                  name="importedPrice"
                  value={formData.importedPrice}
                  onChange={handleChange}
                />
                {errors.importedPrice && (
                  <div
                    id="validationServerBrandFeedback"
                    className="invalid-feedback"
                  >
                    {errors.importedPrice}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Selling Price</label>
                <input
                  type="text"
                  className={
                    errors.sellingPrice
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  id="sellingPrice"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                />
                {errors.sellingPrice && (
                  <div
                    id="validationServerBrandFeedback"
                    className="invalid-feedback"
                  >
                    {errors.sellingPrice}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  id="status"
                  className={
                    errors.status ? "form-control is-invalid" : "form-control"
                  }
                  onChange={handleChange}
                  name="status"
                  value={formData.status}
                >
                  <option value="stock">Stock</option>
                  <option value="out_stock">Out Stock</option>
                </select>
                {errors.status && (
                  <div
                    id="validationServerBrandFeedback"
                    className="invalid-feedback"
                  >
                    {errors.status}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>Categories</label>
                <Select
                  isMulti
                  name="categories"
                  options={options}
                  value={formData.selectedCategories}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={handleChangeCategories}
                />

                {errors.categories && (
                  <div
                    id="validationServerBrandFeedback"
                    className="invalid-feedback"
                  >
                    {errors.categories}
                  </div>
                )}
              </div>
              <div className="form-group imageInput">
                <label htmlFor="images">
                  <FileUploadIcon />
                  Upload Images
                </label>
                <input
                  type="file"
                  className={
                    errors.images ? "form-control is-invalid" : "form-control"
                  }
                  id="images"
                  name="images"
                  multiple
                  onChange={handleImages}
                />
                {errors.images && (
                  <div
                    id="validationServerBrandFeedback"
                    className="invalid-feedback"
                  >
                    {errors.images}
                  </div>
                )}
                <div className="imagesContainer">
                  {images &&
                    images.map((img) => {
                      return (
                        <div className="image-item" key={img.id}>
                          <img src={img.url} />
                          <DeleteOutlineIcon
                            className="trashIcon"
                            onClick={() => handleDeleteImg(img)}
                          />
                        </div>
                      );
                    })}
                  {/*    {Array(10)
                    .fill(0)
                    .map((_, i) => (
                      <div className="image-item" key={i}>
                        <img
                          src="https://i.pinimg.com/564x/97/5a/af/975aafad1490f9b6a2a0dc29365ac7ae.jpg"
                          alt=""
                        />
                        <DeleteOutlineIcon className="trashIcon" />
                      </div>
                    ))} */}
                </div>
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
