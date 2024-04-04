import { Link, useNavigate, useParams } from "react-router-dom";
import "./productDetail.css";
import imgFetures from "../../../../public/images/featur-1.jpg";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useContext, useEffect, useState } from "react";
import * as request from "../../../utilities/request";
import { APP_URL } from "../../../config/env";
import { toast } from "sonner";
import { CartContext } from "../../../context/cartProvider";
import { UserContext } from "../../../context/userProvider";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState();
  const [images, setImages] = useState([]);
  const [viewImg, setViewImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { user } = useContext(UserContext);
  const { carts, dispatch } = useContext(CartContext);
  const handleView = (index) => {
    setViewImg(index);
  };

  const handleQuantity = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      setQuantity(newValue);
    }
  };
  const handleAddCart = () => {
    if (user) {
      const img = images[0].image_name;
      dispatch({
        type: "ADD_CART",
        payload: {
          user_id: user.id,
          product_id: product.id,
          quantity: quantity,
          image: img,
        },
      });
    } else {
      toast.error("You need to sign in first");
      navigate("/sign-in");
    }
  };
  const handleInteract = (number) => {
    setQuantity((prevQuantity) => {
      if (prevQuantity <= 1 && number === -1) {
        return prevQuantity;
      }
      if (prevQuantity >= 100 && number === 1) {
        return prevQuantity;
      }
      return prevQuantity + number;
    });
  };

  const fetchProduct = async (id) => {
    try {
      const productDetail = await request.getRequest(
        `products/viewDetail/${id}`
      );
      setProduct(productDetail.data.results[0]);
      const imgs = await request.getRequest(`products/viewDetailImgs/${id}`);
      // console.log(imgs.data.results);
      setImages(imgs.data.results);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchProduct(id);
  }, [id]);
  return (
    <>
      {/* <!-- Single Page Header start --> */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Shop Detail</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active text-white">Product Detail</li>
        </ol>
      </div>
      {/* <!-- Single Page Header End --> */}

      {/* <!-- Single Product Start --> */}
      <div className="container-fluid py-5 mt-5 productDetailContainer">
        <div className="container py-5">
          <div className="row g-4 mb-5">
            <div className="col-lg-8 col-xl-9 productDetailLeft">
              <div className="row g-4">
                <div className="col-lg-6">
                  {images.length > 0 && (
                    <div className="row">
                      <div className="product_image_list col-md-2">
                        {images.map((img, index) => {
                          return (
                            <img
                              key={index}
                              src={
                                APP_URL + "/public/uploads/" + img.image_name
                              }
                              alt=""
                              draggable={false}
                              className={
                                index === viewImg
                                  ? "product_image_list_selected"
                                  : null
                              }
                              onClick={() => handleView(index)}
                            />
                          );
                        })}
                      </div>
                      <div className="col-md-10 product_image_main">
                        <img
                          src={
                            APP_URL +
                            "/public/uploads/" +
                            images[viewImg].image_name
                          }
                          alt=""
                          draggable={false}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-lg-6">
                  <h4 className="fw-bold mb-3">
                    {product && product.product_name
                      ? product.product_name
                      : "Không có"}
                  </h4>
                  {/* <p className="mb-3">Category: Vegetables</p> */}
                  <h5 className="fw-bold mb-3">
                    {product && product.selling_price
                      ? product.selling_price
                      : "Không có"}
                    đ
                  </h5>
                  <p className="mb-4">
                    {product && product.product_description
                      ? product.product_description
                      : "Không có"}
                  </p>
                  <div className="input-quantity-container">
                    <div className="input-group-btn">
                      <button
                        className="btn btn-sm btn-minus rounded-circle bg-light border"
                        onClick={() => handleInteract(-1)}
                      >
                        <RemoveIcon />
                      </button>
                    </div>
                    <input
                      type="text"
                      name="quantity"
                      value={quantity}
                      onChange={handleQuantity}
                    />
                    <div className="input-group-btn">
                      <button
                        className="btn btn-sm btn-plus rounded-circle bg-light border"
                        onClick={() => handleInteract(1)}
                      >
                        <AddIcon />
                      </button>
                    </div>
                  </div>
                  <button
                    className="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary"
                    onClick={handleAddCart}
                  >
                    <i className="fa fa-shopping-bag me-2 text-primary"></i>
                    Add to cart
                  </button>
                </div>
                <div className="col-lg-12">
                  <nav>
                    <div className="nav nav-tabs mb-3">
                      <button
                        className="nav-link active border-white border-bottom-0"
                        type="button"
                        role="tab"
                        id="nav-about-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-about"
                        aria-controls="nav-about"
                        aria-selected="true"
                      >
                        Description
                      </button>
                    </div>
                  </nav>
                  <div className="tab-content mb-5">
                    <div
                      className="tab-pane active"
                      id="nav-about"
                      role="tabpanel"
                      aria-labelledby="nav-about-tab"
                    >
                      <p>
                        {product && product.product_description
                          ? product.product_description
                          : "Không có"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-xl-3 productDetailRight">
              <div className="row g-4 fruite">
                <div className="col-lg-12">
                  <div className="mb-4">
                    <h4>Categories</h4>
                    <ul className="list-unstyled productCategories">
                      <li>
                        <div className="d-flex justify-content-between fruite-name">
                          <a href="#">Apples</a>
                          <span>(3)</span>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex justify-content-between fruite-name">
                          <a href="#">Oranges</a>
                          <span>(5)</span>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex justify-content-between fruite-name">
                          <a href="#">Strawbery</a>
                          <span>(2)</span>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex justify-content-between fruite-name">
                          <a href="#">Banana</a>
                          <span>(8)</span>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex justify-content-between fruite-name">
                          <a href="#">Pumpkin</a>
                          <span>(5)</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-12">
                  <h4 className="mb-4">Featured products</h4>
                  {Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        className="d-flex align-items-center justify-content-start"
                        key={index}
                      >
                        <div
                          className="rounded"
                          style={{ width: "100px", height: "100px" }}
                        >
                          <img
                            src={imgFetures}
                            className="img-fluid rounded"
                            alt="Image"
                          />
                        </div>
                        <div>
                          <h6 className="mb-2">Big Banana</h6>
                          <div className="d-flex mb-2">
                            <h5 className="fw-bold me-2">2.99 $</h5>
                          </div>
                        </div>
                      </div>
                    ))}

                  <div className="d-flex justify-content-center my-4">
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
          </div>
          <h1 className="fw-bold mb-0">Related products</h1>
          {/* <div className="vesitable">
            <div className="owl-carousel vegetable-carousel justify-content-center">
              <div className="border border-primary rounded position-relative vesitable-item">
                <div className="vesitable-img">
                  <img
                    src="img/vegetable-item-6.jpg"
                    className="img-fluid w-100 rounded-top"
                    alt=""
                  />
                </div>
                <div
                  className="text-white bg-primary px-3 py-1 rounded position-absolute"
                  style={{ top: "10px", right: "10px" }}
                >
                  Vegetable
                </div>
                <div className="p-4 pb-0 rounded-bottom">
                  <h4>Parsely</h4>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit sed
                    do eiusmod te incididunt
                  </p>
                  <div className="d-flex justify-content-between flex-lg-wrap">
                    <p className="text-dark fs-5 fw-bold">$4.99 / kg</p>
                    <a
                      href="#"
                      className="btn border border-secondary rounded-pill px-3 py-1 mb-4 text-primary"
                    >
                      <i className="fa fa-shopping-bag me-2 text-primary"></i>
                      Add to cart
                    </a>
                  </div>
                </div>
              </div>
              <div className="border border-primary rounded position-relative vesitable-item">
                <div className="vesitable-img">
                  <img
                    src="img/vegetable-item-1.jpg"
                    className="img-fluid w-100 rounded-top"
                    alt=""
                  />
                </div>
                <div
                  className="text-white bg-primary px-3 py-1 rounded position-absolute"
                  style={{ top: "10px", right: "10px" }}
                >
                  Vegetable
                </div>
                <div className="p-4 pb-0 rounded-bottom">
                  <h4>Parsely</h4>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit sed
                    do eiusmod te incididunt
                  </p>
                  <div className="d-flex justify-content-between flex-lg-wrap">
                    <p className="text-dark fs-5 fw-bold">$4.99 / kg</p>
                    <a
                      href="#"
                      className="btn border border-secondary rounded-pill px-3 py-1 mb-4 text-primary"
                    >
                      <i className="fa fa-shopping-bag me-2 text-primary"></i>
                      Add to cart
                    </a>
                  </div>
                </div>
              </div>
              <div className="border border-primary rounded position-relative vesitable-item">
                <div className="vesitable-img">
                  <img
                    src="img/vegetable-item-3.png"
                    className="img-fluid w-100 rounded-top bg-light"
                    alt=""
                  />
                </div>
                <div
                  className="text-white bg-primary px-3 py-1 rounded position-absolute"
                  style={{ top: "10px", right: "10px" }}
                >
                  Vegetable
                </div>
                <div className="p-4 pb-0 rounded-bottom">
                  <h4>Banana</h4>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit sed
                    do eiusmod te incididunt
                  </p>
                  <div className="d-flex justify-content-between flex-lg-wrap">
                    <p className="text-dark fs-5 fw-bold">$7.99 / kg</p>
                    <a
                      href="#"
                      className="btn border border-secondary rounded-pill px-3 py-1 mb-4 text-primary"
                    >
                      <i className="fa fa-shopping-bag me-2 text-primary"></i>
                      Add to cart
                    </a>
                  </div>
                </div>
              </div>
              <div className="border border-primary rounded position-relative vesitable-item">
                <div className="vesitable-img">
                  <img
                    src="img/vegetable-item-4.jpg"
                    className="img-fluid w-100 rounded-top"
                    alt=""
                  />
                </div>
                <div
                  className="text-white bg-primary px-3 py-1 rounded position-absolute"
                  style={{ top: "10px", right: "10px" }}
                >
                  Vegetable
                </div>
                <div className="p-4 pb-0 rounded-bottom">
                  <h4>Bell Papper</h4>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit sed
                    do eiusmod te incididunt
                  </p>
                  <div className="d-flex justify-content-between flex-lg-wrap">
                    <p className="text-dark fs-5 fw-bold">$7.99 / kg</p>
                    <a
                      href="#"
                      className="btn border border-secondary rounded-pill px-3 py-1 mb-4 text-primary"
                    >
                      <i className="fa fa-shopping-bag me-2 text-primary"></i>
                      Add to cart
                    </a>
                  </div>
                </div>
              </div>
              <div className="border border-primary rounded position-relative vesitable-item">
                <div className="vesitable-img">
                  <img
                    src="img/vegetable-item-5.jpg"
                    className="img-fluid w-100 rounded-top"
                    alt=""
                  />
                </div>
                <div
                  className="text-white bg-primary px-3 py-1 rounded position-absolute"
                  style={{ top: "10px", right: "10px" }}
                >
                  Vegetable
                </div>
                <div className="p-4 pb-0 rounded-bottom">
                  <h4>Potatoes</h4>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit sed
                    do eiusmod te incididunt
                  </p>
                  <div className="d-flex justify-content-between flex-lg-wrap">
                    <p className="text-dark fs-5 fw-bold">$7.99 / kg</p>
                    <a
                      href="#"
                      className="btn border border-secondary rounded-pill px-3 py-1 mb-4 text-primary"
                    >
                      <i className="fa fa-shopping-bag me-2 text-primary"></i>
                      Add to cart
                    </a>
                  </div>
                </div>
              </div>
              <div className="border border-primary rounded position-relative vesitable-item">
                <div className="vesitable-img">
                  <img
                    src="img/vegetable-item-6.jpg"
                    className="img-fluid w-100 rounded-top"
                    alt=""
                  />
                </div>
                <div
                  className="text-white bg-primary px-3 py-1 rounded position-absolute"
                  style={{ top: "10px", right: "10px" }}
                >
                  Vegetable
                </div>
                <div className="p-4 pb-0 rounded-bottom">
                  <h4>Parsely</h4>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit sed
                    do eiusmod te incididunt
                  </p>
                  <div className="d-flex justify-content-between flex-lg-wrap">
                    <p className="text-dark fs-5 fw-bold">$7.99 / kg</p>
                    <a
                      href="#"
                      className="btn border border-secondary rounded-pill px-3 py-1 mb-4 text-primary"
                    >
                      <i className="fa fa-shopping-bag me-2 text-primary"></i>
                      Add to cart
                    </a>
                  </div>
                </div>
              </div>
              <div className="border border-primary rounded position-relative vesitable-item">
                <div className="vesitable-img">
                  <img
                    src="img/vegetable-item-5.jpg"
                    className="img-fluid w-100 rounded-top"
                    alt=""
                  />
                </div>
                <div
                  className="text-white bg-primary px-3 py-1 rounded position-absolute"
                  style={{ top: "10px", right: "10px" }}
                >
                  Vegetable
                </div>
                <div className="p-4 pb-0 rounded-bottom">
                  <h4>Potatoes</h4>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit sed
                    do eiusmod te incididunt
                  </p>
                  <div className="d-flex justify-content-between flex-lg-wrap">
                    <p className="text-dark fs-5 fw-bold">$7.99 / kg</p>
                    <a
                      href="#"
                      className="btn border border-secondary rounded-pill px-3 py-1 mb-4 text-primary"
                    >
                      <i className="fa fa-shopping-bag me-2 text-primary"></i>
                      Add to cart
                    </a>
                  </div>
                </div>
              </div>
              <div className="border border-primary rounded position-relative vesitable-item">
                <div className="vesitable-img">
                  <img
                    src="img/vegetable-item-6.jpg"
                    className="img-fluid w-100 rounded-top"
                    alt=""
                  />
                </div>
                <div
                  className="text-white bg-primary px-3 py-1 rounded position-absolute"
                  style={{ top: "10px", right: "10px" }}
                >
                  Vegetable
                </div>
                <div className="p-4 pb-0 rounded-bottom">
                  <h4>Parsely</h4>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit sed
                    do eiusmod te incididunt
                  </p>
                  <div className="d-flex justify-content-between flex-lg-wrap">
                    <p className="text-dark fs-5 fw-bold">$7.99 / kg</p>
                    <a
                      href="#"
                      className="btn border border-secondary rounded-pill px-3 py-1 mb-4 text-primary"
                    >
                      <i className="fa fa-shopping-bag me-2 text-primary"></i>
                      Add to cart
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      {/* <!-- Single Product End --> */}
    </>
  );
};

export default ProductDetail;
