import { Link, useParams, useNavigate } from "react-router-dom";
import "./shop.css";
import * as request from "../../../utilities/request";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useContext, useEffect, useState } from "react";
import { APP_URL } from "../../../config/env";
import { UserContext } from "../../../context/userProvider";
import { CartContext } from "../../../context/cartProvider";
import { toast } from "sonner";
import ProductSkeleton from "../../../components/skeleton/productSkeleton/productSkeleton";

const Shop = () => {
  let { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState();
  const [relatedProducts, setRelatedProducts] = useState();
  const [relatedCategories, setRelatedCategories] = useState();
  const [sort, setSort] = useState("default");
  const { user } = useContext(UserContext);
  const { carts, dispatch } = useContext(CartContext);
  const navigate = useNavigate();

  const handleSort = (e) => {
    setSort(e.target.value);
  };

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

  const sortProducts = async (id, sortType) => {
    try {
      setLoading(true);
      const res = await request.postRequest(`categories/products`, {
        slug: id,
        sortType: sortType,
      });
      // console.log(res);
      if (res.status === 200) {
        const productsArray = res.data.results.map((product) => ({
          ...product,
          images: product.images.split(","),
        }));
        // console.log(productsArray);
        setProducts(productsArray);
        setLoading(false);
      }
    } catch (err) {
      setProducts([]);
      console.error(err);
    }
  };

  const fetchData = (id, sortType) => {
    switch (sortType) {
      case "default":
        sortProducts(id, sortType);
        break;
      case "lowToHigh":
        sortProducts(id, sortType);
        break;
      case "highToLow":
        sortProducts(id, sortType);
        break;
    }
  };

  const fetchRelatedCategories = async (id) => {
    try {
      const res = await request.getRequest(
        `categories/relatedCategories/${id}`
      );
      // console.log(res);
      if (res.status === 200) {
        setRelatedCategories(res.data.results);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRelatedProducts = async (id) => {
    try {
      const res = await request.getRequest(`products/relatedProducts/${id}`);
      if (res.status === 200) {
        const productsArray = res.data.results.map((product) => ({
          ...product,
          images: product.images.split(","),
        }));
        // console.log(productsArray);
        setRelatedProducts(productsArray);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData(id, sort);
    }
  }, [id, sort]);
  useEffect(() => {
    if (id) {
      setSort("default");
      fetchRelatedCategories(id);
      fetchRelatedProducts(id);
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
                    <label htmlFor="sort">Sorting:</label>
                    <select
                      id="sort"
                      name="sort"
                      className="border-0 form-select-sm bg-light me-3"
                      onChange={handleSort}
                      value={sort}
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
                        {relatedCategories && relatedCategories.length > 0 && (
                          <ul className="list-unstyled fruite-categorie">
                            {relatedCategories.map((category) => {
                              return (
                                <li key={category.id}>
                                  <div className="d-flex justify-content-between fruite-name">
                                    <Link
                                      to={`/categories/${category.category_slug}`}
                                    >
                                      <i className="fas fa-apple-alt me-2"></i>
                                      {category.category_name}
                                    </Link>
                                    <span>({category.total_products})</span>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <h4 className="mb-3">Featured products</h4>
                      {relatedProducts &&
                        relatedProducts.length > 0 &&
                        relatedProducts.map((product) => {
                          return (
                            <div
                              className="d-flex align-items-center justify-content-start productItem"
                              key={product.id}
                            >
                              <Link to={`/product/${product.id}`}>
                                <div
                                  className="rounded me-4"
                                  style={{ width: "100px", height: "100px" }}
                                >
                                  <img
                                    src={
                                      APP_URL +
                                      "/public/uploads/" +
                                      product.images[0]
                                    }
                                    className="img-fluid rounded"
                                    alt=""
                                  />
                                </div>
                              </Link>
                              <Link
                                to={`/product/${product.id}`}
                                style={{
                                  textDecoration: "none",
                                  color: "#000",
                                }}
                              >
                                <div>
                                  <h6 className="mb-2">
                                    {product.product_name}
                                  </h6>
                                  <div className="d-flex mb-2">
                                    <h5 className="fw-bold me-2">
                                      {product.selling_price} đ
                                    </h5>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <div className="col-lg-9">
                  <div className="row g-4">
                    {products && products.length > 0 ? (
                      loading ? (
                        Array(products.length)
                          .fill(0)
                          .map((_, i) => (
                            <div
                              className="col-md-6 col-lg-6 col-xl-4 productItem"
                              key={i}
                            >
                              <ProductSkeleton />
                            </div>
                          ))
                      ) : (
                        products.map((product) => (
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
                                  <button
                                    className="btn border border-secondary rounded-pill px-3 text-primary"
                                    onClick={() => handleAddCart(product)}
                                  >
                                    <ShoppingCartIcon />
                                    Add to cart
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )
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
