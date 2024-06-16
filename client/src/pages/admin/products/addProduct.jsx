import { Container, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useContext, Component } from "react";
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
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const AddProduct = () => {
  const { editedProduct, isEdit, setEditedProduct, setIsEdit } =
    useContext(EditProductContext);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    selectedCategories: [],
  });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);
  const [optionsVariation, setOptionsVariation] = useState([]);

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
    let errors = {};
    let isValid = true;

    // Validate main form data
    const productErrors = Validation(formData, "products");
    if (Object.keys(productErrors).length !== 0) {
      isValid = false;
      errors = { ...errors, ...productErrors };
    }

    // Check if images are provided
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
  };
  const handleAdd = async () => {
    setErrors({});
    if (editedProduct) {
      try {
        await axios.put(
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
      // console.log(errors);
      // console.log(formData);
      if (isValid) {
        try {
          const formDatas = new FormData();
          formDatas.append("productName", formData.productName);
          formDatas.append("productDescription", formData.productDescription);
          formData.selectedCategories.forEach((category) => {
            formDatas.append("productCategories", category.value);
          });
          formDataList.forEach((formData) => {
            formDatas.append("variations", JSON.stringify(formData));
          });
          images.forEach((image) => {
            formDatas.append("images", image.image);
          });

          const response = await request.postRequest(`products/add`, formDatas);
          // console.log(response);
          if (response.status === 200) {
            toast.success(response.data.message);
            await socket.emit("add_product");
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
        // setOptions((prevOptions) => prevOptions.concat(newOptions));
        setOptions(newOptions);
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

  useEffect(() => {
    fetchCategories();
    fetchVariation();
  }, []);

  const initialFormData = {
    variation: "",
    variationValue: "",
    sellingPrice: "",
    stock: "",
    status: "stock",
  };

  const [formDataList, setFormDataList] = useState([{ ...initialFormData }]);

  const handleChangeVariant = (index, e) => {
    const { name, value } = e.target;
    const newFormDataList = [...formDataList];
    newFormDataList[index][name] = value;
    setFormDataList(newFormDataList);
  };

  const addVariantContainer = () => {
    setFormDataList([...formDataList, { ...initialFormData }]);
  };
  const Log = () => {
    console.log(formDataList);
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
                <CKEditor
                  editor={ClassicEditor}
                  data={formData.productDescription}
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
                    setFormData({ ...formData, productDescription: data });
                  }}
                />
                {errors.productDescription && (
                  <div
                    id="validationServerBrandFeedback"
                    className="invalid-feedback"
                  >
                    {errors.productDescription}
                  </div>
                )}
                {/*  <textarea
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
                )} */}
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

                {errors.selectedCategories && (
                  <div
                    id="validationServerBrandFeedback"
                    className="invalid-feedback"
                  >
                    {errors.selectedCategories}
                  </div>
                )}
              </div>
              {/*    <div className="variantContainer">
                <div className="row">
                  <div className="col-md-4">
                    <label>Variation</label>
                    <select
                      id="variation"
                      className={
                        errors.variation
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      onChange={handleChange}
                      name="variation"
                      value={formData.variation}
                    >
                      {errors.variation && (
                        <div
                          id="validationServerBrandFeedback"
                          className="invalid-feedback"
                        >
                          {errors.variation}
                        </div>
                      )}
                      <option value="">Select your variant</option>
                      {optionsVariation && optionsVariation.length > 0 && (
                        <>
                          {optionsVariation.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.variationName}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    {errors.variation && (
                      <div
                        id="validationServerBrandFeedback"
                        className="invalid-feedback"
                      >
                        {errors.variation}
                      </div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label>Variation Value</label>
                    <select
                      id="variationValue"
                      className={
                        errors.variationValue
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      onChange={handleChange}
                      name="variationValue"
                      value={formData.variationValue}
                    >
                      {errors.variationValue && (
                        <div
                          id="validationServerBrandFeedback"
                          className="invalid-feedback"
                        >
                          {errors.variationValue}
                        </div>
                      )}

                      {formData.variation ? (
                        optionsVariationValue &&
                        optionsVariationValue.length > 0 ? (
                          <>
                            <option value="">Select your value</option>
                            {optionsVariationValue.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.valueValid}
                              </option>
                            ))}
                          </>
                        ) : (
                          <option value="">
                            Don't have any value in variant
                          </option>
                        )
                      ) : (
                        <option value="0">Select variant first</option>
                      )}
                    </select>
                    {errors.variationValue && (
                      <div
                        id="validationServerBrandFeedback"
                        className="invalid-feedback"
                      >
                        {errors.variationValue}
                      </div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label>Price</label>
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
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label>Stock</label>
                    <input
                      type="text"
                      className={
                        errors.stock
                          ? "form-control is-invalid"
                          : "form-control"
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
                  <div className="col-md-6">
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
                </div>
              </div>
              <button className="btn mt-3 btn-success">Add</button> */}
              {formDataList.map((formData, index) => (
                <div className="variantContainer" key={index}>
                  <div className="row">
                    <div className="col-md-4">
                      <label>Variation</label>
                      <select
                        id="variation"
                        className={
                          errors.variants && errors.variants[index]?.variation
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        onChange={(e) => handleChangeVariant(index, e)}
                        name="variation"
                        value={formData.variation}
                      >
                        <option value="">Select your variant</option>
                        {optionsVariation &&
                          optionsVariation.length > 0 &&
                          optionsVariation.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.variationName}
                            </option>
                          ))}
                      </select>
                      {errors.variants && errors.variants[index]?.variation && (
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
                          errors.variants[index]?.variationValue
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        id="variationValue"
                        name="variationValue"
                        value={formData.variationValue}
                        onChange={(e) => handleChangeVariant(index, e)}
                      />
                      {errors.variants &&
                        errors.variants[index]?.variationValue && (
                          <div className="invalid-feedback">
                            {errors.variants[index].variationValue}
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
                        id="sellingPrice"
                        name="sellingPrice"
                        value={formData.sellingPrice}
                        onChange={(e) => handleChangeVariant(index, e)}
                      />
                      {errors.variants &&
                        errors.variants[index]?.sellingPrice && (
                          <div className="invalid-feedback">
                            {errors.variants[index].sellingPrice}
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
                          errors.variants && errors.variants[index]?.stock
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={(e) => handleChangeVariant(index, e)}
                      />
                      {errors.variants && errors.variants[index]?.stock && (
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
                          errors.variants && errors.variants[index]?.status
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        onChange={(e) => handleChangeVariant(index, e)}
                        name="status"
                        value={formData.status}
                      >
                        <option value="stock">Stock</option>
                        <option value="out_stock">Out Stock</option>
                      </select>
                      {errors.variants && errors.variants[index]?.status && (
                        <div className="invalid-feedback">
                          {errors.variants[index].status}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button
                className="btn mt-3 btn-success"
                onClick={addVariantContainer}
              >
                Add
              </button>
              {/*   <button className="btn mt-3 btn-success" onClick={Log}>
                Log
              </button> */}
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
                className={"btn" + (isEdit ? " btn-success" : " btn-primary")}
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
