import "./homepage.css";
import Fruites from "../../../public/images/hero-img-1.png";
import { FaCarSide } from "react-icons/fa6";
import { MdOutlineSecurity } from "react-icons/md";
import { FaExchangeAlt, FaPhoneAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import * as request from "../../utilities/request";
import { useContext, useEffect, useState } from "react";
import ProductSkeleton from "../../components/skeleton/productSkeleton/productSkeleton";
import { UserContext } from "../../context/userProvider";
import { APP_URL } from "../../config/env";
import { toast } from "sonner";
import { CartContext } from "../../context/cartProvider";
import { SocketContext } from "../../context/socketContext";

const Homepage = () => {
  const [products, setProducts] = useState();
  const { socket } = useContext(SocketContext);
  const [isLoading, setIsLoading] = useState(true);
  const { user, handleSet } = useContext(UserContext);
  const navigate = useNavigate();
  const { carts, dispatch } = useContext(CartContext);
  let a = 0;

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

  const fetchProducts = async () => {
    try {
      const res = await request.getRequest("products/view");
      const productsArray = res.data.results.map((product) => ({
        ...product,
        images: product.images.split(","),
      }));
      // console.log(productsArray);
      setProducts(productsArray);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchUser = async (token) => {
    try {
      const res = await request.postRequest("users/verifyToken", { token });
      if (res.status === 200) {
        // console.log(res);
        // setUser(res.data.results);
        handleSet(res.data.results);
      }
    } catch (err) {
      if (err.response.status === 500) {
        localStorage.removeItem("token");
      }
      console.error(err);
    }
  };
  useEffect(() => {
    if (socket) {
      socket.on("update_products", (products) => {
        const productsArray = products.map((product) => ({
          ...product,
          images: product.images.split(","),
        }));
        setProducts(productsArray);
      });
    }
  }, [socket]);

  useEffect(() => {
    fetchProducts();
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      handleSet(null);
    }
  }, []);
  return (
    <>
      {/* <!-- Hero Start --> */}
      <div className="container-fluid py-5 mb-5 hero-header">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-md-12 col-lg-7">
              <h4 className="mb-3 text-secondary">100% Organic Foods</h4>
              <h1 className="mb-5 display-3 text-primary">
                Organic Veggies & Fruits Foods
              </h1>
              <div className="position-relative mx-auto">
                <input
                  className="form-control border-2 border-secondary w-75 py-3 px-4 rounded-pill"
                  type="number"
                  placeholder="Search"
                />
                <button
                  type="submit"
                  className="btn btn-primary border-2 border-secondary py-3 px-4 position-absolute rounded-pill text-white h-100"
                  style={{ top: 0, right: "25%" }}
                >
                  Submit Now
                </button>
              </div>
            </div>
            <div className="col-md-12 col-lg-5">
              <div
                id="carouselId"
                className="carousel slide position-relative"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner" role="listbox">
                  <div className="carousel-item active rounded">
                    <img
                      src={Fruites}
                      className="img-fluid w-100 h-100 bg-secondary rounded"
                      alt="First slide"
                    />
                    <a href="#" className="btn px-4 py-2 text-white rounded">
                      Fruites
                    </a>
                  </div>
                  <div className="carousel-item rounded">
                    <img
                      src="img/hero-img-2.jpg"
                      className="img-fluid w-100 h-100 rounded"
                      alt="Second slide"
                    />
                    <a href="#" className="btn px-4 py-2 text-white rounded">
                      Vesitables
                    </a>
                  </div>
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselId"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselId"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Hero End --> */}

      {/* // <!-- Featurs Section Start --> */}
      <div className="container-fluid featurs py-5">
        <div className="container py-5">
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="featurs-item text-center rounded bg-light p-4">
                <div className="featurs-icon btn-square rounded-circle mb-5 mx-auto">
                  <FaCarSide id="featureIcons" />
                </div>
                <div className="featurs-content text-center">
                  <h5>Free Shipping</h5>
                  <p className="mb-0">Free on order over $300</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="featurs-item text-center rounded bg-light p-4">
                <div className="featurs-icon btn-square rounded-circle mb-5 mx-auto">
                  <MdOutlineSecurity id="featureIcons" />
                </div>
                <div className="featurs-content text-center">
                  <h5>Security Payment</h5>
                  <p className="mb-0">100% security payment</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="featurs-item text-center rounded bg-light p-4">
                <div className="featurs-icon btn-square rounded-circle mb-5 mx-auto">
                  <FaExchangeAlt id="featureIcons" />
                </div>
                <div className="featurs-content text-center">
                  <h5>30 Day Return</h5>
                  <p className="mb-0">30 day money guarantee</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="featurs-item text-center rounded bg-light p-4">
                <div className="featurs-icon btn-square rounded-circle mb-5 mx-auto">
                  <FaPhoneAlt id="featureIcons" />
                </div>
                <div className="featurs-content text-center">
                  <h5>24/7 Support</h5>
                  <p className="mb-0">Support every time fast</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* // <!-- Featurs Section End --> */}

      {/* // <!-- Fruits Shop Start--> */}
      <div className="container-fluid fruite py-5">
        <div className="container py-5">
          <div className="tab-className text-center">
            <div className="row g-4">
              <div className="col-lg-4 text-start">
                <h1>Our Organic Products</h1>
              </div>
            </div>
            <div className="tab-content productsContainer">
              <div id="tab-1" className="tab-pane fade show p-0 active">
                <div className="container">
                  <div className="row">
                    {isLoading
                      ? Array(8)
                          .fill(0)
                          .map((_, i) => (
                            <div className="col-md-3 productItem" key={i}>
                              <div className="rounded position-relative fruit-item">
                                <ProductSkeleton />
                              </div>
                            </div>
                          ))
                      : products &&
                        products.map((product) => {
                          return (
                            <div
                              className="col-md-3 productItem"
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
                                      onClick={() => handleAddCart(product)}
                                      className="btn border border-secondary rounded-pill px-3 text-primary"
                                    >
                                      <ShoppingCartIcon />
                                      Add to cart
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Fruits Shop End--> */}
    </>
  );
};

export default Homepage;
