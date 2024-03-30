import "./homepage.css";
import Fruites from "../../../public/images/hero-img-1.png";
import { FaCarSide } from "react-icons/fa6";
import { MdOutlineSecurity } from "react-icons/md";
import { FaExchangeAlt, FaPhoneAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import axios from "axios";
import { useEffect, useState } from "react";
import ProductSkeleton from "../../components/skeleton/productSkeleton/productSkeleton";

const Homepage = () => {
  const [products, setProducts] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/products`);
      // console.log(res);
      setProducts(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchProducts();
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
              <div className="col-lg-8 text-end">
                <ul className="nav nav-pills d-inline-flex text-center mb-5">
                  <li className="nav-item">
                    <a
                      className="d-flex m-2 py-2 rounded-pill active"
                      data-bs-toggle="pill"
                      href="#tab-1"
                    >
                      <span className="text-dark" style={{ width: "130px" }}>
                        All Products
                      </span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="d-flex py-2 m-2 rounded-pill"
                      data-bs-toggle="pill"
                      href="#tab-2"
                    >
                      <span className="text-dark" style={{ width: "130px" }}>
                        Vegetables
                      </span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="d-flex m-2 py-2 rounded-pill"
                      data-bs-toggle="pill"
                      href="#tab-3"
                    >
                      <span className="text-dark" style={{ width: "130px" }}>
                        Fruits
                      </span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="d-flex m-2 py-2 rounded-pill"
                      data-bs-toggle="pill"
                      href="#tab-4"
                    >
                      <span className="text-dark" style={{ width: "130px" }}>
                        Bread
                      </span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="d-flex m-2 py-2 rounded-pill"
                      data-bs-toggle="pill"
                      href="#tab-5"
                    >
                      <span className="text-dark" style={{ width: "130px" }}>
                        Meat
                      </span>
                    </a>
                  </li>
                </ul>
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
                                <a
                                  href={`product/${product.id}`}
                                  style={{
                                    textDecoration: "none",
                                    color: "#000",
                                  }}
                                >
                                  <div className="product-img">
                                    <img
                                      src={product.image}
                                      className="img-fluid rounded-top"
                                      alt={product.productName}
                                    />
                                  </div>
                                </a>
                                <div
                                  className="text-white bg-secondary px-3 py-1 rounded position-absolute"
                                  style={{ top: "10px", left: "10px" }}
                                >
                                  Fruits
                                </div>
                                <div className="p-4 border border-secondary border-top-0 rounded-bottom productInform">
                                  <Link
                                    to={`product/${product.id}`}
                                    style={{
                                      textDecoration: "none",
                                      color: "#000",
                                    }}
                                  >
                                    <h5>{product.productName}</h5>
                                  </Link>
                                  <p>
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit sed do eiusmod tempor
                                    incididunt
                                  </p>
                                  <div className="d-flex flex-column gap-2">
                                    <p className="text-dark fs-5 fw-bold mb-0">
                                      {product.price} đ
                                    </p>
                                    <a
                                      href="#"
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
