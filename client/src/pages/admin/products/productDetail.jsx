import { Container, Grid, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./products.css";
import * as request from "../../../utilities/request";
import { v4 as uuidv4 } from "uuid";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { APP_URL } from "../../../config/env";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Select from "react-select";
import { toast } from "sonner";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Validation from "../../../components/validation/validation";
const ProductDetail = () => {
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [mode, setMode] = useState("information");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [product, setProduct] = useState({});
  const [imageDelete, setImageDelete] = useState([]);
  const [imageAdd, setImageAdd] = useState([]);
  const [categories, setCategories] = useState("");
  const [optionsVariation, setOptionsVariation] = useState([]);
  const [options, setOptions] = useState([]);
  const initialFormData = {
    variation: "",
    variationO_id: "",
    variationValue: "",
    sellingPrice: 0,
    stock: 0,
    status: "stock",
  };

  const [formDataList, setFormDataList] = useState([]);
  const handleBack = () => {
    navigate("/dashboard/products");
  };

  const handleSwap = (mode) => {
    setMode(mode);
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
  /*   const validate = () => {
    let errors = {};
    let isValid = true;

    const errorsProduct = Validation(product, "editProduct");
    if (Object.keys(errorsProduct).length !== 0) {
      isValid = false;
      errors = { ...errors, ...errorsProduct };
    }

    if (!product.category_names) {
      errors.categories = "Category cannot be empty";
      isValid = false;
    }
    if (!images) {
      errors.images = "Images cannot be empty";
      isValid = false;
    }
    const variantErrors = formDataList.map((formData, index) => {
      const errors = Validation(formData, "variation");
      if (Object.keys(errors).length !== 0) {
        isValid = false;
      }
      return errors;
    });
    setErrors({ ...errors, variants: variantErrors });

    return isValid;
  }; */
  const handleSubmit = async (type) => {
    if (type === "editInform") {
      try {
        const formDatas = new FormData();
        formDatas.append("id", product.product_id);
        formDatas.append("product_name", product.product_name);
        formDatas.append("product_description", product.product_description);
        formDatas.append(
          "category_names",
          JSON.stringify(product.category_names)
        );
        formDataList.forEach((formData) => {
          formDatas.append("variations", JSON.stringify(formData));
        });
        const res = await request.postRequest(
          `products/editInformation`,
          formDatas
        );
        if (res.status === 200) {
          toast.success(res.data.message);
          navigate("/dashboard/products");
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const formDatas = new FormData();
        imageDelete.forEach((image) => {
          formDatas.append("imageDelete", image);
        });
        imageAdd.forEach((image) => {
          image.image && formDatas.append("images", image.image);
        });
        formDatas.append("id", product.product_id);
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
  const fetchCategories = async (category_names) => {
    try {
      const res = await request.postRequest("categories/productView", {
        category_names: category_names,
      });
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
  const fetchVariants = async (id) => {
    try {
      const res = await request.getRequest(`products/getVariant/${id}`);
      if (res.status === 200) {
        setFormDataList(res.data.results[0].variants);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const fetchData = async (id) => {
    setIsLoading(true);
    try {
      const res = await request.getRequest(`products/view/${id}`);
      // console.log(res);
      if (res.status === 200) {
        setProduct(res.data.results[0]);
        setImages(res.data.results[0].images);
        fetchCategories(res.data.results[0].category_names);
        fetchVariants(res.data.results[0].product_id);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const fetchVariation = async () => {
    try {
      const res = await request.getRequest("variation");
      if (res.data.results.length > 0) {
        setOptionsVariation(res.data.results);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleChangeVariant = (index, e) => {
    const { name, value } = e.target;
    const newFormDataList = [...formDataList];
    newFormDataList[index][name] = value;
    setFormDataList(newFormDataList);
  };
  const handleDeleteVariant = (index) => {
    const newFormDataList = [...formDataList];
    newFormDataList.splice(index, 1);
    setFormDataList(newFormDataList);
  };
  const addVariantContainer = () => {
    setFormDataList([...formDataList, { ...initialFormData }]);
  };
  const Log = () => {
    console.log(formDataList);
  };
  useEffect(() => {
    if (id) {
      fetchData(id);
    }
    fetchVariation();
  }, [id]);

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <div className="handleAddContainer">
          <p>Product View</p>
          <div className="handleButtonContainer">
            <button
              className={
                mode === "information" ? "btn btn-primary" : "btn btn-info"
              }
              onClick={() => handleSwap("information")}
            >
              Information
            </button>
            <button
              className={mode === "images" ? "btn btn-primary" : "btn btn-info"}
              onClick={() => handleSwap("images")}
            >
              Images
            </button>
            <button className="btn btn-success" onClick={handleBack}>
              Back
            </button>
          </div>
        </div>
        <Grid container>
          <Grid item xs={12}>
            <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
              <div className="container productViewContainer">
                <div className="row">
                  {mode === "information" ? (
                    product && (
                      <>
                        <div className="col-md-12">
                          <div className="row">
                            <div className="col-md-4">
                              <label>ID</label>
                              <input
                                type="text"
                                className="form-control"
                                value={product?.product_id}
                                readOnly
                              />
                            </div>
                            <div className="col-md-4">
                              <label>Product name</label>
                              <input
                                type="text"
                                className="form-control"
                                value={product?.product_name}
                              />
                            </div>
                            <div className="col-md-4">
                              <label>Created at</label>
                              <input
                                type="text"
                                className="form-control"
                                value={product?.created_at}
                                readOnly
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <label>Description</label>
                              <CKEditor
                                editor={ClassicEditor}
                                data={product?.product_description || ""}
                                onReady={(editor) => {
                                  editor.editing.view.change((writer) => {
                                    writer.setStyle(
                                      "height",
                                      "200px",
                                      editor.editing.view.document.getRoot()
                                    );
                                  });
                                }}
                                onChange={(event, editor) => {
                                  const data = editor.getData();
                                  setProduct((prevData) => ({
                                    ...prevData,
                                    product_description: data,
                                  }));
                                }}
                              />
                            </div>
                          </div>
                          {!isLoading && (
                            <div className="row">
                              <div className="col-md-12 mt-2">
                                <label>Category</label>
                                <Select
                                  isMulti
                                  name="categories"
                                  options={options}
                                  value={
                                    product.category_names &&
                                    product.category_names.length > 0 &&
                                    product.category_names.map((cat) => ({
                                      value: cat.value,
                                      label: cat.label,
                                    }))
                                  }
                                  defaultValue={
                                    product.category_names &&
                                    product.category_names.length > 0 &&
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
                          )}
                          <div className="row">
                            {formDataList &&
                              formDataList.map((formData, index) => {
                                return (
                                  <div
                                    className="variantViewContainer"
                                    key={index}
                                  >
                                    <DeleteOutlineIcon
                                      className="trashIcon"
                                      onClick={() => handleDeleteVariant(index)}
                                    />
                                    <div className="row">
                                      <div className="col-md-4">
                                        <label>Variation</label>
                                        <select
                                          id="variation"
                                          className={
                                            errors.variants &&
                                            errors.variants[index]?.variation
                                              ? "form-control is-invalid"
                                              : "form-control"
                                          }
                                          onChange={(e) =>
                                            handleChangeVariant(index, e)
                                          }
                                          name="variation"
                                          value={formData.variation}
                                        >
                                          <option value="">
                                            Select your variant
                                          </option>
                                          {optionsVariation &&
                                            optionsVariation.length > 0 &&
                                            optionsVariation.map((option) => (
                                              <option
                                                key={option.id}
                                                value={option.id}
                                              >
                                                {option.variationName}
                                              </option>
                                            ))}
                                        </select>
                                        {errors.variants &&
                                          errors.variants[index]?.variation && (
                                            <div className="invalid-feedback">
                                              {errors.variants[index].variation}
                                            </div>
                                          )}
                                      </div>

                                      <div className="col-md-4">
                                        <label>Variation Value</label>
                                        <input
                                          type="text"
                                          className={
                                            errors.variants &&
                                            errors.variants[index]
                                              ?.variationValue
                                              ? "form-control is-invalid"
                                              : "form-control"
                                          }
                                          id="variation_value"
                                          name="variation_value"
                                          value={formData.variation_value}
                                          onChange={(e) =>
                                            handleChangeVariant(index, e)
                                          }
                                        />
                                        {errors.variants &&
                                          errors.variants[index]
                                            ?.variationValue && (
                                            <div className="invalid-feedback">
                                              {
                                                errors.variants[index]
                                                  .variationValue
                                              }
                                            </div>
                                          )}
                                      </div>
                                      <div className="col-md-4">
                                        <label>Price</label>
                                        <input
                                          type="text"
                                          className={
                                            errors.variants &&
                                            errors.variants[index]?.sellingPrice
                                              ? "form-control is-invalid"
                                              : "form-control"
                                          }
                                          id="selling_price"
                                          name="selling_price"
                                          value={formData.selling_price}
                                          onChange={(e) =>
                                            handleChangeVariant(index, e)
                                          }
                                        />
                                        {errors.variants &&
                                          errors.variants[index]
                                            ?.sellingPrice && (
                                            <div className="invalid-feedback">
                                              {
                                                errors.variants[index]
                                                  .sellingPrice
                                              }
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-md-6">
                                        <label>Stock</label>
                                        <input
                                          type="text"
                                          className={
                                            errors.variants &&
                                            errors.variants[index]?.stock
                                              ? "form-control is-invalid"
                                              : "form-control"
                                          }
                                          id="stock"
                                          name="stock"
                                          value={formData.stock}
                                          onChange={(e) =>
                                            handleChangeVariant(index, e)
                                          }
                                        />
                                        {errors.variants &&
                                          errors.variants[index]?.stock && (
                                            <div className="invalid-feedback">
                                              {errors.variants[index].stock}
                                            </div>
                                          )}
                                      </div>

                                      <div className="col-md-6">
                                        <label>Status</label>
                                        <select
                                          id="status"
                                          className={
                                            errors.variants &&
                                            errors.variants[index]?.status
                                              ? "form-control is-invalid"
                                              : "form-control"
                                          }
                                          onChange={(e) =>
                                            handleChangeVariant(index, e)
                                          }
                                          name="status"
                                          value={formData.status}
                                        >
                                          <option value="stock">Stock</option>
                                          <option value="out_stock">
                                            Out Stock
                                          </option>
                                        </select>
                                        {errors.variants &&
                                          errors.variants[index]?.status && (
                                            <div className="invalid-feedback">
                                              {errors.variants[index].status}
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                          <button
                            className="btn mt-3 btn-success"
                            onClick={addVariantContainer}
                          >
                            Add
                          </button>
                          &nbsp;
                          {/*  <button
                            className="btn mt-3 btn-success"
                            onClick={Log}
                          >
                            Log
                          </button> */}
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
                      </>
                    )
                  ) : (
                    <div className="col-md-12">
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
                            <div className="row mt-3">
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
                            </div>
                            <div className="row mt-3">
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

export default ProductDetail;
