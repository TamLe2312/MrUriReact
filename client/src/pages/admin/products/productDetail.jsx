import { Container, Grid, Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./products.css";
import * as request from "../../../utilities/request";
import { v4 as uuidv4 } from "uuid";
import { APP_URL } from "../../../config/env";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState("information");
  const [images, setImages] = useState([]);
  const [product, setProduct] = useState({});
  const [categories, setCategories] = useState("");

  const handleBack = () => {
    navigate("/dashboard/products");
  };

  const handleSwap = (mode) => {
    setMode(mode);
  };

  const fetchData = async (id) => {
    try {
      const res = await request.getRequest(`products/view/${id}`);
      if (res.status === 200) {
        const categories = res.data.results[0].category_names
          .map((category) => category.name)
          .join(",");
        setCategories(categories);
        setProduct(res.data.results[0]);
        const imgs = res.data.results[0].images.split(",");
        setImages(imgs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

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
                              readOnly
                            />
                          </div>
                          <div className="col-md-4">
                            <label>Product name</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={product.product_name}
                              readOnly
                            />
                          </div>
                          <div className="col-md-4">
                            <label>Stock</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={product.stock}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <label>Stock</label>
                            <textarea
                              className="form-control"
                              readOnly
                              defaultValue={product.product_description}
                            ></textarea>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-3">
                            <label>Selling price</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={product.selling_price}
                              readOnly
                            />
                          </div>
                          <div className="col-md-3">
                            <label>Imported price</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={product.imported_price}
                              readOnly
                            />
                          </div>
                          <div className="col-md-3">
                            <label>Status</label>
                            <input
                              type="text"
                              className="form-control"
                              defaultValue={product.status}
                              readOnly
                            />
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
                            <p className="mb-0">
                              Categories: {categories && categories}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="col-md-10">
                      <div className="row imageRowContainer">
                        {images && images.length > 0 ? (
                          images.map((img) => {
                            return (
                              <div className="col-md-3" key={uuidv4()}>
                                <div className="imageProductViewContainer">
                                  <img
                                    draggable="false"
                                    src={APP_URL + "/public/uploads/" + img}
                                  />
                                </div>
                              </div>
                            );
                          })
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
