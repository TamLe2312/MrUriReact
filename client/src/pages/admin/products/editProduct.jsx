import { Container, Grid, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./products.css";
import * as request from "../../../utilities/request";
import { v4 as uuidv4 } from "uuid";
import { APP_URL } from "../../../config/env";
import Select from "react-select";
import Validation from "../../../components/validation/validation";
import { toast } from "sonner";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState("information");
  const [images, setImages] = useState([]);
  const [imageDelete, setImageDelete] = useState([]);
  const [imageAdd, setImageAdd] = useState([]);
  const [product, setProduct] = useState({});
  const [options, setOptions] = useState([]);
  const [errors, setErrors] = useState({});

  const handleBack = () => {
    navigate("/dashboard/products");
  };

  const handleSwap = (mode) => {
    setMode(mode);
  };

  const handleChangeCategories = (selectedCategory) => {
    // console.log(selectedCategory);
    setProduct((prevData) => ({
      ...prevData,
      category_names: selectedCategory.map((category) => ({
        value: category.value,
        label: category.label,
      })),
    }));
  };

  const fetchData = async (id) => {
    try {
      const res = await request.getRequest(`products/view/${id}`);
      if (res.status === 200) {
        // console.log(res.data.results[0].category_names);
        fetchCategories(res.data.results[0].category_names);
        setProduct(res.data.results[0]);
        const imgs = res.data.results[0].images.split(",");
        setImages(imgs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (product.category_names) {
      fetchCategories(product.category_names);
    }
  }, [product.category_names]);

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const fetchCategories = async (categories) => {
    // console.log(categories);
    try {
      const res = await request.postRequest("categories/productView", {
        categories: categories,
      });
      // console.log(res);
      if (res.data.results.length > 0) {
        const newOptions = res.data.results
          .filter((category) => category.status === 1)
          .map((category) => ({
            value: category.value,
            label: category.label,
          }));
        setOptions(newOptions);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setProduct((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  const validate = () => {
    const errors = Validation(product, "editProduct");
    let isValid = true;
    setErrors(errors);

    if (!product.category_names) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        categories: "Category cannot be empty",
      }));
    }
    if (!images) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        images: "Images cannot be empty",
      }));
    }
    if (
      Object.keys(errors).length !== 0 ||
      !Object.values(product).every((value) => value !== "")
    ) {
      isValid = false;
    }

    return isValid;
  };
  const handleSubmit = async (type) => {
    if (type === "editInform") {
      const isValid = validate();
      if (isValid) {
        try {
          const res = await request.postRequest(`products/editInformation`, {
            id: product.id,
            product_name: product.product_name,
            stock: product.stock,
            product_description: product.product_description,
            category_names: product.category_names,
            selling_price: product.selling_price,
            imported_price: product.imported_price,
            status: product.status,
          });
          if (res.status === 200) {
            toast.success(res.data.message);
            navigate("/dashboard/products");
          }
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      // console.log(imageDelete);
      try {
        const formDatas = new FormData();
        imageDelete.forEach((image) => {
          formDatas.append("imageDelete", image);
        });
        imageAdd.forEach((image) => {
          formDatas.append("images", image.image);
        });
        formDatas.append("id", product.id);
        const res = await request.postRequest(`products/editImage`, formDatas);
        if (res.status === 200) {
          toast.success(res.data.message);
          navigate("/dashboard/products");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteImg = (image) => {
    if (!image.image) {
      const filteredImages = images.filter((img) => img !== image);
      const deletedImage = images.find((img) => img === image);
      setImages(filteredImages);
      setImageDelete([...imageDelete, deletedImage]);
    } else {
      const filteredImages = images.filter((img) => img !== image);
      setImages(filteredImages);
    }
  };

  const handleAdd = (e) => {
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
        image: files[i],
        url: URL.createObjectURL(files[i]),
      });
    }

    setImages([...images, ...newImageFiles]);
    setImageAdd([...images, ...newImageFiles]);
    e.target.value = null;
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <div className="handleAddContainer">
          <p>Product View</p>
          <button className="btn btn-success" onClick={handleBack}>
            Back
          </button>
        </div>
        <Grid container>
          <Grid item xs={12}>
            <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
              <div className="container productViewContainer">
                <div className="row">
                  <div className="col-md-2">
                    <ul>
                      <li
                        className={mode === "information" ? "active" : null}
                        onClick={() => handleSwap("information")}
                      >
                        Information
                      </li>
                      <li
                        className={mode === "images" ? "active" : null}
                        onClick={() => handleSwap("images")}
                      >
                        Images
                      </li>
                    </ul>
                  </div>
                  {mode === "information" ? (
                    product && (
                      <div className="col-md-10">
                        <div className="row">
                          <div className="col-md-4">
                            <label>ID</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={product.id}
                              name="id"
                              readOnly
                            />
                          </div>
                          <div className="col-md-4">
                            <label>Product name</label>
                            <input
                              type="text"
                              className={
                                errors.product_name
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              defaultValue={product.product_name}
                              name="product_name"
                              onChange={handleChange}
                            />
                            {errors.product_name && (
                              <div
                                id="validationServerBrandFeedback"
                                className="invalid-feedback"
                              >
                                {errors.product_name}
                              </div>
                            )}
                          </div>
                          <div className="col-md-4">
                            <label>Stock</label>
                            <input
                              type="text"
                              className={
                                errors.stock
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              defaultValue={product.stock}
                              name="stock"
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
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <label>Product description</label>
                            <textarea
                              className={
                                errors.product_description
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              defaultValue={product.product_description}
                              name="product_description"
                              onChange={handleChange}
                            ></textarea>
                            {errors.product_description && (
                              <div
                                id="validationServerBrandFeedback"
                                className="invalid-feedback"
                              >
                                {errors.product_description}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12 mt-2">
                            <label>Category</label>
                            <Select
                              isMulti
                              name="categories"
                              options={options}
                              value={
                                product.category_names &&
                                product.category_names.map((cat) => ({
                                  value: cat.value,
                                  label: cat.label,
                                }))
                              }
                              defaultValue={
                                product.category_names &&
                                product.category_names.map((cat) => ({
                                  value: cat.value,
                                  label: cat.label,
                                }))
                              }
                              className={
                                errors.categories
                                  ? "form-control is-invalid basic-multi-select"
                                  : "form-control basic-multi-select"
                              }
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
                        </div>
                        <div className="row">
                          <div className="col-md-3">
                            <label>Selling price</label>
                            <input
                              type="text"
                              className={
                                errors.selling_price
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              defaultValue={product.selling_price}
                              name="selling_price"
                              onChange={handleChange}
                            />
                            {errors.selling_price && (
                              <div
                                id="validationServerBrandFeedback"
                                className="invalid-feedback"
                              >
                                {errors.selling_price}
                              </div>
                            )}
                          </div>
                          <div className="col-md-3">
                            <label>Imported price</label>
                            <input
                              type="text"
                              className={
                                errors.imported_price
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              defaultValue={product.imported_price}
                              name="imported_price"
                              onChange={handleChange}
                            />
                            {errors.imported_price && (
                              <div
                                id="validationServerBrandFeedback"
                                className="invalid-feedback"
                              >
                                {errors.imported_price}
                              </div>
                            )}
                          </div>
                          <div className="col-md-3">
                            <label>Status</label>
                            <select
                              id="status"
                              className={
                                errors.status
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              onChange={handleChange}
                              name="status"
                              value={product.status}
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
                          <div className="col-md-3">
                            <label>Created at</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={product.created_at}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12 mt-2">
                            <button
                              className="btn btn-primary"
                              onClick={() => handleSubmit("editInform")}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="col-md-10">
                      <div className="row imageRowContainer">
                        {images && images.length > 0 ? (
                          <>
                            <div className="row">
                              <div className="col-md-12">
                                <div className="form-group imageInput">
                                  <label htmlFor="images">
                                    <FileUploadIcon />
                                    Upload Images
                                  </label>
                                  <input
                                    type="file"
                                    className={
                                      errors.images
                                        ? "form-control is-invalid"
                                        : "form-control"
                                    }
                                    id="images"
                                    name="images"
                                    multiple
                                    onChange={handleAdd}
                                  />
                                  {errors.images && (
                                    <div
                                      id="validationServerBrandFeedback"
                                      className="invalid-feedback"
                                    >
                                      {errors.images}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            {images.map((img) => {
                              return (
                                <div className="col-md-3" key={uuidv4()}>
                                  <div className="imageProductViewContainer">
                                    <img
                                      draggable="false"
                                      src={
                                        img.url
                                          ? img.url
                                          : APP_URL + "/public/uploads/" + img
                                      }
                                    />
                                    <DeleteIcon
                                      className="trashIcon"
                                      onClick={() => handleDeleteImg(img)}
                                    />
                                  </div>
                                </div>
                              );
                            })}

                            <div className="row">
                              <div className="col-md-12 mt-2">
                                <button
                                  className="btn btn-primary"
                                  onClick={() => handleSubmit("deleteImage")}
                                >
                                  Submit
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <p>Không có ảnh</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default EditProduct;
