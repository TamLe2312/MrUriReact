import { Link, useParams, useNavigate } from "react-router-dom";
import "./shop.css";
import * as request from "../../../utilities/request";
import ImageTest from "../../../../public/images/fruite-item-5.jpg";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useContext, useEffect, useState } from "react";
import { APP_URL } from "../../../config/env";
import { UserContext } from "../../../context/userProvider";
import { CartContext } from "../../../context/cartProvider";
import { toast } from "sonner";

const Shop = () => {
  let { id } = useParams();
  const [products, setProducts] = useState();
  const { user } = useContext(UserContext);
  const { carts, dispatch } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddCart = async (product) => {
    if (user) {
      // console.log(product);
      const img = product.images[0];
      dispatch({
        type: "ADD_CART",
        payload: {
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
          image: img,
        },
      });
    } else {
      toast.error("You need to sign in first");
      navigate("/sign-in");
    }
  };
  const fetchData = async (id) => {
    try {
      const res = await request.getRequest(`categories/${id}`);
      if (res.status === 200) {
        const productsArray = res.data.results.map((product) => ({
          ...product,
          images: product.images.split(","),
        }));
        // console.log(productsArray);
        setProducts(productsArray);
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
      {/* Single Page Header start */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Shop</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">
            <Link to={"/"}>Home</Link>
          </li>
          <li className="breadcrumb-item active text-white">Shop</li>
        </ol>
      </div>
      {/* Single Page Header End */}

      {/* Fruits Shop Start*/}
      <div className="container-fluid fruite py-3 shopContainer">
        <div className="container py-3">
          <div className="row g-4">
            <div className="col-lg-12">
              <div className="row g-4 shopItemTopContainer">
                <div className="col-xl-3">
                  <div className="input-group w-100 mx-auto d-flex">
                    <input
                      type="search"
                      className="form-control p-2"
                      placeholder="keywords"
                      aria-describedby="search-icon-1"
                    />
                    <span id="search-icon-1" className="input-group-text p-2">
                      <SearchIcon />
                    </span>
                  </div>
                </div>
                <div className="col-6"></div>
                <div className="col-xl-3">
                  <div className="bg-light ps-3 py-3 rounded d-flex justify-content-between mb-4">
                    <label htmlFor="fruits">Sorting:</label>
                    <select
                      id="fruits"
                      name="fruitlist"
                      className="border-0 form-select-sm bg-light me-3"
                      form="fruitform"
                    >
                      <option value="default">Default</option>
                      <option value="lowToHigh">Price : Low to high</option>
                      <option value="highToLow">Price : High to low</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-lg-3">
                  <div className="row g-4">
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <h4>Categories</h4>
                        <ul className="list-unstyled fruite-categorie">
                          <li>
                            <div className="d-flex justify-content-between fruite-name">
                              <a href="#">
                                <i className="fas fa-apple-alt me-2"></i>Apples
                              </a>
                              <span>(3)</span>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex justify-content-between fruite-name">
                              <a href="#">
                                <i className="fas fa-apple-alt me-2"></i>Oranges
                              </a>
                              <span>(5)</span>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex justify-content-between fruite-name">
                              <a href="#">
                                <i className="fas fa-apple-alt me-2"></i>
                                Strawbery
                              </a>
                              <span>(2)</span>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex justify-content-between fruite-name">
                              <a href="#">
                                <i className="fas fa-apple-alt me-2"></i>Banana
                              </a>
                              <span>(8)</span>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex justify-content-between fruite-name">
                              <a href="#">
                                <i className="fas fa-apple-alt me-2"></i>Pumpkin
                              </a>
                              <span>(5)</span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <h4 className="mb-3">Featured products</h4>
                      <div className="d-flex align-items-center justify-content-start">
                        <div
                          className="rounded me-4"
                          style={{ width: "100px", height: "100px" }}
                        >
                          <img
                            src={ImageTest}
                            className="img-fluid rounded"
                            alt=""
                          />
                        </div>
                        <div>
                          <h6 className="mb-2">Big Banana</h6>
                          <div className="d-flex mb-2">
                            <h5 className="fw-bold me-2">2.99 $</h5>
                            <h5 className="text-danger text-decoration-line-through">
                              4.11 $
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-start">
                        <div
                          className="rounded me-4"
                          style={{ width: "100px", height: "100px" }}
                        >
                          <img
                            src={ImageTest}
                            className="img-fluid rounded"
                            alt=""
                          />
                        </div>
                        <div>
                          <h6 className="mb-2">Big Banana</h6>
                          <div className="d-flex mb-2">
                            <h5 className="fw-bold me-2">2.99 $</h5>
                            <h5 className="text-danger text-decoration-line-through">
                              4.11 $
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-start">
                        <div
                          className="rounded me-4"
                          style={{ width: "100px", height: "100px" }}
                        >
                          <img
                            src={ImageTest}
                            className="img-fluid rounded"
                            alt=""
                          />
                        </div>
                        <div>
                          <div className="d-flex mb-2">
                            <h5 className="fw-bold me-2">2.99 $</h5>
                            <h5 className="text-danger text-decoration-line-through">
                              4.11 $
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center my-2">
                        <a
                          href="#"
                          className="btn border border-secondary px-4 py-3 rounded-pill text-primary w-100"
                        >
                          Vew More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-9">
                  <div className="row g-4">
                    {products && products.length > 0 ? (
                      products.map((product) => {
                        return (
                          <div
                            className="col-md-6 col-lg-6 col-xl-4 productItem"
                            key={product.id}
                          >
                            <div className="rounded position-relative fruit-item">
                              <Link
                                to={`/product/${product.id}`}
                                style={{
                                  textDecoration: "none",
                                  color: "#000",
                                }}
                              >
                                <div className="product-img">
                                  <img
                                    src={
                                      APP_URL +
                                      "/public/uploads/" +
                                      product.images[0]
                                    }
                                    className="img-fluid rounded-top"
                                    alt={product.product_name}
                                  />
                                </div>
                              </Link>
                              <div className="p-4 border border-secondary border-top-0 rounded-bottom productInform">
                                <Link
                                  to={`/product/${product.id}`}
                                  style={{
                                    textDecoration: "none",
                                    color: "#000",
                                  }}
                                >
                                  <h5>{product.product_name}</h5>
                                </Link>
                                <div className="d-flex flex-column gap-2">
                                  <p className="text-dark fs-5 fw-bold mb-0">
                                    {product.selling_price} đ
                                  </p>
                                  <a
                                    className="btn border border-secondary rounded-pill px-3 text-primary"
                                    onClick={() => handleAddCart(product)}
                                  >
                                    <ShoppingCartIcon />
                                    Add to cart
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p>No products</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Fruits Shop End*/}
    </>
  );
};

export default Shop;
