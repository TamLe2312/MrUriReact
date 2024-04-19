import { Link, useNavigate } from "react-router-dom";
import "./carts.css";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { toast } from "sonner";
import { useContext, useEffect, useState } from "react";
import CartSkeleton from "../../../components/skeleton/cartSkeleton/cartSkeleton";
import { UserContext } from "../../../context/userProvider";
import { APP_URL } from "../../../config/env";
import * as request from "../../../utilities/request";
import { CartContext } from "../../../context/cartProvider";

const Carts = () => {
  const navigate = useNavigate();
  const { user, handleSet } = useContext(UserContext);
  const { carts, dispatch } = useContext(CartContext);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCarts = async (user) => {
    if (user) {
      setIsLoading(true);
      try {
        const res = await request.getRequest(`carts/cart/${user.id}`);
        if (res.status === 200) {
          // console.log(res);
          setCartItems(res.data.results);
          // console.log(cartItems);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleQuantity = async (e, cart) => {
    if (e.target.value <= 0) {
      e.target.value = 1;
    }
    const product = await request.getRequest(
      `products/product/${cart.product_id}`
    );
    if (parseInt(e.target.value) > parseInt(product.data.results.stock)) {
      e.target.value = product.data.results.stock;
    }
    cartItems.forEach((element, index) => {
      if (element.id === cart.id) {
        cartItems[index].quantity = e.target.value;
        changeCart(element);
      }
    });
  };

  const changeCart = async (cart) => {
    try {
      const res = await request.postRequest(`carts/changeQuantity`, {
        user_id: user.id,
        cart: cart,
      });
      // console.log(res);
      if (res.data.message && res.status === 200) {
        fetchCarts(user);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (cart) => {
    if (user) {
      dispatch({
        type: "DELETE_CART",
        payload: {
          user_id: user.id,
          cart: cart,
        },
      });
      // console.log(cart);
      const index = cartItems.findIndex((item) => item.id === cart.id);
      // console.log(cartItems);
      cartItems.splice(index, 1);
    }
  };

  const fetchUser = async (token) => {
    try {
      const res = await request.postRequest("users/verifyToken", { token });
      if (res.status === 200) {
        // console.log(res);
        handleSet(res.data.results);
        fetchCarts(res.data.results);
      }
    } catch (err) {
      if (err.response.status === 500) {
        localStorage.removeItem("token");
      }
      console.error(err);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      handleSet(null);
      toast.error("You need to sign in first");
      navigate("/sign-in");
    }
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      let currentTotal = 0;
      cartItems.map((item) => {
        currentTotal += item.selling_price * item.quantity;
      });
      setTotal(currentTotal);
    } else {
      setTotal(0);
    }
  }, [cartItems]);

  return (
    <>
      {/* Single Page Header start */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Cart</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">
            <Link to={"/"}>Home</Link>
          </li>
          <li className="breadcrumb-item active text-white">Cart</li>
        </ol>
      </div>
      {/* Single Page Header End */}

      {/* Cart Page Start */}
      <div className="container-fluid py-5 cartsContainer">
        <div className="container py-5">
          <div className="table-responsive">
            <table className="table cartsTable">
              <thead>
                <tr>
                  <th scope="col">Products</th>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Total</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array(cartItems.length)
                    .fill(0)
                    .map((_, i) => <CartSkeleton key={i} />)
                ) : cartItems && cartItems.length > 0 ? (
                  cartItems.map((cart) => {
                    return (
                      <tr key={cart.id} className="cartItemRow">
                        <th scope="row">
                          <div className="d-flex align-items-center cartImgContainer">
                            <img
                              src={APP_URL + "/public/uploads/" + cart.image}
                              className="img-fluid me-5 rounded-circle"
                              alt=""
                            />
                          </div>
                        </th>
                        <td>
                          <p className="mb-0 ">{cart.product_name}</p>
                        </td>
                        <td>
                          <p className="mb-0 ">{cart.selling_price} đ</p>
                        </td>
                        <td>
                          <div
                            className="input-group quantity input-quantity-container"
                            style={{ width: "100px" }}
                          >
                            <input
                              type="number"
                              className="form-control form-control-sm text-center border-0"
                              defaultValue={cart.quantity}
                              onBlur={(e) => handleQuantity(e, cart)}
                            />
                          </div>
                        </td>
                        <td>
                          <p className="mb-0">
                            {cart.selling_price * cart.quantity} đ
                          </p>
                        </td>
                        <td>
                          <button
                            className="handleDeleteCart"
                            onClick={() => handleDelete(cart)}
                          >
                            <DeleteOutlineIcon />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6}>No products in cart</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/*   <div className="mt-5">
            <input
              type="text"
              className="border-0 border-bottom rounded me-5 py-3 mb-4"
              placeholder="Coupon Code"
            />
            <button
              className="btn border-secondary rounded-pill px-4 py-3 text-primary"
              type="button"
            >
              Apply Coupon
            </button>
          </div> */}
          <div className="row g-4 justify-content-end">
            <div className="col-8"></div>
            <div className="col-sm-8 col-md-7 col-lg-6 col-xl-4">
              <div className="bg-light rounded">
                <div className="p-4">
                  <h1 className="display-6 mb-4">
                    Cart <span className="fw-normal">Total</span>
                  </h1>
                  <div className="d-flex justify-content-between mb-4">
                    <h5 className="mb-0 me-4">Subtotal:</h5>
                    <p className="mb-0">{total} đ</p>
                  </div>
                </div>
                <div className="py-4 mb-4 border-top border-bottom d-flex justify-content-between">
                  <h5 className="mb-0 ps-4 me-4">Total</h5>
                  <p className="mb-0 pe-4">{total} đ</p>
                </div>
                <a
                  className="btn border-secondary rounded-pill px-4 py-3 text-primary text-uppercase mb-4 ms-4"
                  href="/check-out"
                >
                  Proceed Checkout
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Cart Page End */}
    </>
  );
};

export default Carts;
