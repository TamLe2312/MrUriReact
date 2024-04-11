import "./checkout.css";
import ImageTest from "../../../../public/images/vegetable-item-3.png";
import { useContext, useEffect, useState } from "react";
import {
  getDistricts,
  getProvinces,
  getWards,
} from "../../../components/provinces/provinces";
import { useNavigate } from "react-router-dom";
import * as request from "../../../utilities/request";
import { toast } from "sonner";
import Select from "react-select";
import Validation from "../../../components/validation/validation";
import { CartContext } from "../../../context/cartProvider";
import { UserContext } from "../../../context/userProvider";
import { APP_URL } from "../../../config/env";

const Checkout = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    provinces: null,
    districts: null,
    wards: null,
    paymentMethod: "cash",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const { user, handleSet } = useContext(UserContext);
  const { carts, dispatch } = useContext(CartContext);

  const options = [{ value: "", label: "" }];

  const start = () => {
    setFormData({
      name: "",
      address: "",
      phoneNumber: "",
      provinces: null,
      districts: null,
      wards: null,
      paymentMethod: "cash",
    });
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      start();
      const data = await getProvinces();
      if (data.data.code == 200) {
        const dataProvinces = data.data.data;
        const newArr = dataProvinces.map((item) => ({
          ProvinceID: item.ProvinceID,
          ProvinceName: item.ProvinceName,
        }));
        setProvinces(newArr);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const run = async () => {
      if (formData.provinces) {
        // console.log(formData.provinces);
        const data = await getDistricts(formData.provinces.value);
        if (data.data.code == 200) {
          const dataDistricts = data.data.data;
          const newArr = dataDistricts.map((item) => ({
            DistrictID: item.DistrictID,
            DistrictName: item.DistrictName,
          }));
          setDistricts(newArr);
        }
      }
    };
    run();
  }, [formData.provinces]);
  useEffect(() => {
    const run = async () => {
      if (formData.districts) {
        const data = await getWards(formData.districts.value);
        // console.log(data);
        if (data.data.code == 200) {
          const dataXa = data.data.data;
          const newArr = dataXa.map((item) => ({
            WardCode: item.WardCode,
            WardName: item.WardName,
          }));
          setWards(newArr);
        }
      }
    };
    run();
  }, [formData.districts]);

  const handleProvinces = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      provinces: e,
    }));
  };

  const handleDistricts = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      districts: e,
    }));
  };

  const handleWards = (e) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      wards: e,
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors = Validation(formData, "check-out");
    let isValid = true;
    setErrors(errors);

    if (
      Object.keys(errors).length !== 0 ||
      !Object.values(formData).every((value) => value !== "")
    ) {
      isValid = false;
    }

    return isValid;
  };

  const handleAdd = async () => {
    const isValid = validate();

    if (isValid) {
      const formDatas = new FormData();
      formDatas.append("name", formData.name);
      formDatas.append("phoneNumber", formData.phoneNumber);
      formDatas.append("address", formData.address);
      formDatas.append("paymentMethod", formData.paymentMethod);
      formDatas.append("provinces", formData.provinces.label);
      formDatas.append("districts", formData.districts.label);
      formDatas.append("wards", formData.wards.label);
      formDatas.append("userId", user.id);
      formDatas.append("total", total);

      cartItems.forEach((cart) => {
        formDatas.append("products", JSON.stringify(cart));
      });
      try {
        const res = await request.postRequest("carts/check-out", formDatas);
        if (res.status === 200) {
          window.location.href = res.data.url;
          /*   toast.success(res.data.message);
          if (user) {
            dispatch({
              type: "CLEAR_CART",
              payload: {
                user_id: user.id,
              },
            });
          }
          navigate("/check-out/success"); */
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
  const fetchCarts = async (user) => {
    if (user) {
      setIsLoading(true);
      try {
        const res = await request.getRequest(`carts/${user.id}`);
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
  const [total, setTotal] = useState(0);
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
              <div className="row">
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
                              <div className="d-flex align-items-center mt-2">
                                <img
                                  src={
                                    APP_URL + "/public/uploads/" + cart.image
                                  }
                                  className="img-fluid rounded-circle"
                                  style={{
                                    width: "90px",
                                    height: "90px",
                                  }}
                                  alt=""
                                />
                              </div>
                            </th>
                            <td className="py-5">{cart.product_name}</td>
                            <td className="py-5">{cart.selling_price} đ</td>
                            <td className="py-5">{cart.quantity}</td>
                            <td className="py-5">
                              {cart.quantity * cart.selling_price} đ
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5}>No product</td>
                      </tr>
                    )}

                    <tr>
                      <th scope="row"></th>
                      <td className="py-2">
                        <p className="mb-0 text-dark text-uppercase py-3">
                          TOTAL
                        </p>
                      </td>
                      <td className="py-2"></td>
                      <td className="py-2"></td>
                      <td className="py-2">
                        <div className="py-3 border-bottom border-top">
                          <p className="mb-0 text-dark">{total} đ</p>
                        </div>
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
                        name="paymentMethod"
                        value="cash"
                        checked
                        onChange={handleChange}
                      />
                      <label htmlFor="cash">Cash on delivery</label>
                    </div>
                    <div className="paymentMethodItem">
                      <input
                        type="radio"
                        id="vnpay"
                        name="paymentMethod"
                        value="vnpay"
                        onChange={handleChange}
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
