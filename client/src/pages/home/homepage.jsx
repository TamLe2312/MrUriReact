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
import { truncateText } from "../../helper/helper";
import { toast } from "sonner";
import { CartContext } from "../../context/cartProvider";
import { SocketContext } from "../../context/socketContext";
import Slider from "../../components/slider/slider";

const Homepage = () => {
  const [products, setProducts] = useState();
  const { socket } = useContext(SocketContext);
  const [isLoading, setIsLoading] = useState(true);
  const { user, handleSet } = useContext(UserContext);
  const navigate = useNavigate();
  const { carts, dispatch } = useContext(CartContext);

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
        product_name: truncateText(product.product_name, 15),
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
        setIsLoading(true);
        if (products.length > 0) {
          const productsArray = products.map((product) => ({
            ...product,
            images: product.images.split(","),
            product_name: truncateText(product.product_name, 15),
          }));
          setIsLoading(false);
          setProducts(productsArray);
        } else {
          setProducts([]);
        }
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
        <Slider />
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
