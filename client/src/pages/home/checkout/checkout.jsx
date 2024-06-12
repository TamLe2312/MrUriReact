import "./checkout.css";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as request from "../../../utilities/request";
import { toast } from "sonner";
import { CartContext } from "../../../context/cartProvider";
import { UserContext } from "../../../context/userProvider";
import { APP_URL } from "../../../config/env";
import { formatNumber } from "../../../helper/helper";
import MyModal from "../../../components/modal/modal";
import AddressFormCheckout from "./addressForm";
import { SocketContext } from "../../../context/socketContext";
import { getFee, getService } from "../../../components/provinces/provinces";

const Checkout = () => {
  const format = (price) => {
    return formatNumber(parseInt(price));
  };
  const { socket } = useContext(SocketContext);
  const [isAddress, setIsAddress] = useState(null);
  const [modalAddress, setModalAddress] = useState(false);

  const [formData, setFormData] = useState({
    address: "",
    paymentMethod: "cash",
    phoneNumber: "",
    provinces: null,
    districts: null,
    wards: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const { user, handleSet } = useContext(UserContext);
  const { carts, dispatch } = useContext(CartContext);

  const closeModal = () => {
    setModalAddress(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAdd = async () => {
    const formDatas = new FormData();
    formDatas.append("phoneNumber", formData.phoneNumber);
    formDatas.append("address", formData.address);
    formDatas.append("paymentMethod", formData.paymentMethod);
    formDatas.append("provinces", formData.provinces.label);
    formDatas.append("districts", formData.districts.label);
    formDatas.append("wards", formData.wards.label);
    formDatas.append("userId", user.id);
    formDatas.append("total", total);
    formDatas.append("shipping", shipping);
    cartItems.forEach((cart) => {
      formDatas.append("products", JSON.stringify(cart));
    });
    try {
      const res = await request.postRequest("carts/check-out", formDatas);
      console.log(res);
      if (res.status === 200) {
        window.location.href = res.data.url;
        toast.success(res.data.message);
        if (user) {
          dispatch({
            type: "CLEAR_CART",
            payload: {
              user_id: user.id,
            },
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  const fetchCarts = async (user) => {
    if (user) {
      setIsLoading(true);
      try {
        const res = await request.getRequest(`carts/cart/${user.id}`);
        if (res.status === 200) {
          //   console.log(res);
          setCartItems(res.data.results);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const fetchAddress = async (user) => {
    if (user) {
      try {
        const res = await request.getRequest(`users/getAddress/${user.id}`);
        if (res.status === 200) {
          // console.log(res);
          const { address, province, district, ward, phone_number } =
            res.data.results;

          setFormData((prevState) => ({
            ...prevState,
            address: address,
            phoneNumber: phone_number,
            provinces: { label: province },
            districts: { label: district },
            wards: { label: ward },
          }));

          const fullAddress = `${address},${ward},${district},${province}`;
          setIsAddress({ address: fullAddress });
          const { district_id, ward_code } = res.data.results;
          const service = await getService(district_id);
          const fee = await getFee(
            district_id,
            ward_code,
            service.data.data[0].service_id
          );
          // console.log(fee);
          setShipping(fee.data.data.total);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  const fetchUser = async (token) => {
    try {
      const res = await request.postRequest("users/verifyToken", { token });
      if (res.status === 200) {
        // console.log(res);
        handleSet(res.data.results);
        fetchCarts(res.data.results);
        fetchAddress(res.data.results);
      }
    } catch (err) {
      if (err.response.status === 500) {
        localStorage.removeItem("token");
      }
      console.error(err);
    }
  };
  const fetchGoogle = async (localId) => {
    try {
      const res = await request.postRequest("users/verifyGoogle", {
        localId,
      });
      // console.log(localId);
      if (res.status === 200) {
        /* console.log(res);
        setUser(res.data.results); */
        handleSet(res.data.results);
        fetchCarts(res.data.results);
        fetchAddress(res.data.results);
      }
    } catch (err) {
      if (err.response.status === 500) {
        localStorage.removeItem("isGoogle");
      }
      console.error(err);
    }
  };
  useEffect(() => {
    const isGoogle = localStorage.getItem("isGoogle");
    if (isGoogle) {
      fetchGoogle(isGoogle);
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        fetchUser(token);
      } else {
        handleSet(null);
        toast.error("You need to sign in first");
        navigate("/sign-in");
      }
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
  const updateAddress = async (address) => {
    setIsLoading(true);
    setIsAddress({ address: address.addressComplete.address });
    try {
      fetchAddress({ id: address.addressComplete.user_id });
      // console.log(address);
      setFormData({
        address: address.address,
        phoneNumber: address.phoneNumber,
        provinces: address.provinces,
        districts: address.districts,
        wards: address.wards,
      });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("update_address", (address) => {
        updateAddress(address);
      });
    }
  }, [socket]);
  return (
    <>
      {/* Single Page Header start */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Checkout</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item">
            <a href="/">Home</a>
          </li>
          <li className="breadcrumb-item">
            <a href="/carts">Carts</a>
          </li>
          <li className="breadcrumb-item active text-white">Checkout</li>
        </ol>
      </div>
      {/* Single Page Header End */}

      {/* Checkout Page Start */}
      <div className="container-fluid py-5">
        <div className="container py-5">
          <h1 className="mb-4">Billing details</h1>
          <div className="row g-5">
            <div className="col-md-12 col-lg-6 col-xl-7">
              {/* <div className="row">
                <div className="col-md-12 col-lg-6">
                  <div className="form-item w-100">
                    <label className="form-label my-3">
                      Name<sup>*</sup>
                    </label>
                    <input
                      type="text"
                      className={
                        errors.name ? "form-control is-invalid" : "form-control"
                      }
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <div
                        id="validationServerBrandFeedback"
                        className="invalid-feedback"
                      >
                        {errors.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-12 col-lg-6">
                  <div className="form-item w-100">
                    <label className="form-label my-3">
                      Phone number<sup>*</sup>
                    </label>
                    <input
                      type="text"
                      className={
                        errors.phoneNumber
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                    {errors.phoneNumber && (
                      <div
                        id="validationServerBrandFeedback"
                        className="invalid-feedback"
                      >
                        {errors.phoneNumber}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-lg-4">
                  <div className="form-item w-100">
                    <label>Tỉnh</label>
                    <Select
                      onChange={handleProvinces}
                      options={
                        provinces.length > 0
                          ? provinces.map((i) => ({
                              value: i.ProvinceID,
                              label: i.ProvinceName,
                            }))
                          : options
                      }
                      className={
                        errors.provinces
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                    />
                    {errors.provinces && (
                      <div
                        id="validationServerBrandFeedback"
                        className="invalid-feedback"
                      >
                        {errors.provinces}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-12 col-lg-4">
                  <div className="form-item w-100">
                    <label>Huyện</label>
                    <Select
                      onChange={handleDistricts}
                      options={
                        districts.length > 0
                          ? districts.map((i) => ({
                              value: i.DistrictID,
                              label: i.DistrictName,
                            }))
                          : options
                      }
                      className={
                        errors.districts
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                    />
                    {errors.districts && (
                      <div
                        id="validationServerBrandFeedback"
                        className="invalid-feedback"
                      >
                        {errors.districts}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-12 col-lg-4">
                  <div className="form-item w-100">
                    <label>Wards</label>
                    <Select
                      onChange={handleWards}
                      options={
                        wards.length > 0
                          ? wards.map((i) => ({
                              value: i.WardCode,
                              label: i.WardName,
                            }))
                          : options
                      }
                      className={
                        errors.wards
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                    />
                    {errors.wards && (
                      <div
                        id="validationServerBrandFeedback"
                        className="invalid-feedback"
                      >
                        {errors.wards}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="form-item">
                <label className="form-label my-3">
                  Address<sup>*</sup>
                </label>
                <input
                  type="text"
                  className={
                    errors.address ? "form-control is-invalid" : "form-control"
                  }
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
                {errors.address && (
                  <div
                    id="validationServerBrandFeedback"
                    className="invalid-feedback"
                  >
                    {errors.address}
                  </div>
                )}
              </div> */}
              <div className="row addressSection">
                {isLoading ? (
                  "Loading..."
                ) : isAddress && isAddress.address ? (
                  <p>
                    {isAddress.address}
                    <button onClick={() => setModalAddress(true)}>Edit?</button>
                    <MyModal
                      text={"Address"}
                      show={modalAddress}
                      onHide={() => setModalAddress(false)}
                      size={"xl"}
                      childrens={
                        user && user.id ? (
                          <AddressFormCheckout
                            userId={user.id}
                            closeModal={closeModal}
                          />
                        ) : null
                      }
                    />
                  </p>
                ) : (
                  <p>
                    No address?
                    <button onClick={() => setModalAddress(true)}>
                      Add now
                    </button>
                    <MyModal
                      text={"Address"}
                      show={modalAddress}
                      onHide={() => setModalAddress(false)}
                      size={"xl"}
                      childrens={
                        user && user.id ? (
                          <AddressFormCheckout
                            userId={user.id}
                            closeModal={closeModal}
                          />
                        ) : null
                      }
                    />
                  </p>
                )}
              </div>
            </div>
            <div className="col-md-12 col-lg-6 col-xl-5">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Products</th>
                      <th scope="col">Name</th>
                      <th scope="col">Price</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems && cartItems.length > 0 ? (
                      cartItems.map((cart) => {
                        return (
                          <tr key={cart.id}>
                            <th scope="row">
                              <div className="d-flex align-items-center cartImgContainer">
                                <img
                                  src={
                                    APP_URL + "/public/uploads/" + cart.image
                                  }
                                  className="img-fluid me-5 rounded-circle"
                                />
                              </div>
                            </th>
                            <td style={{ verticalAlign: "middle" }}>
                              {cart.product_name}
                              <div className="variantTitle">
                                {cart.variation_name}
                                <strong>{cart.variation_value}</strong>
                              </div>
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              {format(cart.selling_price)}
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              {cart.quantity}
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              {format(cart.quantity * cart.selling_price)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ verticalAlign: "middle" }}>
                          No product
                        </td>
                      </tr>
                    )}
                    <tr>
                      <th scope="row">
                        <td className="py-2">
                          <p className="mb-0 text-dark text-uppercase py-3">
                            SHIPPING
                          </p>
                        </td>
                      </th>
                      <td
                        className="py-2"
                        colSpan={4}
                        style={{ verticalAlign: "middle" }}
                      >
                        <p className="mb-0 text-dark">
                          {isLoading ? "Loading..." : format(shipping)}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <td className="py-2">
                          <p className="mb-0 text-dark text-uppercase py-3">
                            TOTAL
                          </p>
                        </td>
                      </th>
                      <td
                        className="py-2"
                        colSpan={4}
                        style={{ verticalAlign: "middle" }}
                      >
                        <p className="mb-0 text-dark">
                          {isLoading ? "Loading..." : format(total + shipping)}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="row g-4 text-center align-items-center justify-content-center border-bottom">
                <div className="col-12">
                  <div className="form-check text-start my-2 paymentMethodContainer">
                    <p>Payment Method</p>
                    <div className="paymentMethodItem">
                      <input
                        type="radio"
                        id="cash"
                        value="cash"
                        checked
                        onChange={handleChange}
                        name="paymentMethod"
                      />
                      <label htmlFor="cash">Cash on delivery</label>
                    </div>
                    <div className="paymentMethodItem">
                      <input
                        type="radio"
                        id="vnpay"
                        value="vnpay"
                        onChange={handleChange}
                        name="paymentMethod"
                      />
                      <label htmlFor="vnpay">VNPay</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row g-4 text-center align-items-center justify-content-center pt-4">
                <button
                  onClick={handleAdd}
                  className="btn border-secondary py-3 px-4 text-uppercase w-100 text-primary"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Checkout Page End */}
    </>
  );
};

export default Checkout;
