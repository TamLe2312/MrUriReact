import { useContext, useEffect, useState } from "react";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import * as request from "../../../utilities/request";
import { UserContext } from "../../../context/userProvider";
import { toast } from "sonner";
import Validation from "../../../components/validation/validation";

const Profile = () => {
  const [mode, setMode] = useState("information");
  const [address, setAddress] = useState();
  const [errors, setErrors] = useState({});
  const [edit, setEdit] = useState(false);
  const [rowId, setRowId] = useState(null);
  const { user, handleSet } = useContext(UserContext);
  const [orders, setOrders] = useState();
  const navigate = useNavigate();
  const [formDataInform, setFormDataInform] = useState({
    username: "",
    name: "",
    email: "",
  });
  const [formDataPassword, setFormDataPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handleSwap = (mode) => {
    setMode(mode);
  };

  const validate = () => {
    if (address) {
      const errors = Validation(
        {
          address: address,
        },
        "orders"
      );
      let isValid = true;
      setErrors(errors);

      if (
        Object.keys(errors).length !== 0 ||
        !Object.values(address).every((value) => value !== "")
      ) {
        isValid = false;
      }

      return isValid;
    }

    if (
      formDataPassword.currentPassword ||
      formDataPassword.newPassword ||
      formDataPassword.confirmPassword
    ) {
      const errors = Validation(formDataPassword, "informWithPassword");
      let isValid = true;
      setErrors((prevErrors) => ({ ...prevErrors, ...errors }));

      if (
        Object.keys(errors).length !== 0 ||
        !Object.values(formDataPassword).every((value) => value !== "")
      ) {
        isValid = false;
      }

      return isValid;
    }
    if (
      formDataInform.username ||
      formDataInform.email ||
      formDataInform.name
    ) {
      // console.log("Ok");
      const errors = Validation(formDataInform, "informWithoutPassword");
      let isValid = true;
      setErrors((prevErrors) => ({ ...prevErrors, ...errors }));
      if (
        Object.keys(errors).length !== 0 ||
        !Object.values(formDataInform).every((value) => value !== "")
      ) {
        isValid = false;
      }

      return isValid;
    }
  };

  const handleChange = (e) => {
    setAddress(e.target.value);
  };
  const handleChangeInform = (e) => {
    // console.log(e.target.value);
    setFormDataInform({ ...formDataInform, [e.target.name]: e.target.value });
  };
  const handleChangePassword = (e) => {
    // console.log(e.target.value);
    setFormDataPassword({
      ...formDataPassword,
      [e.target.name]: e.target.value,
    });
  };

  const handleCAR = async (order, type) => {
    if (type === "delete") {
      try {
        const res = await request.postRequest(`orders/delete`, {
          id: order.id,
        });
        if (res.status === 200) {
          toast.success(res.data.message);
          fetchOrders(user);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const res = await request.postRequest(`orders/cancel`, {
          id: order.id,
        });
        if (res.status === 200) {
          toast.success(res.data.message);
          fetchOrders(user);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEditInform = async () => {
    if (
      formDataInform.username ||
      formDataInform.email ||
      formDataInform.name
    ) {
      const isValid = validate();
      if (isValid) {
        try {
          const res = await request.postRequest("users/profile", {
            username: formDataInform.username,
            name: formDataInform.name,
            email: formDataInform.email,
            id: user.id,
          });
          if (res.status === 200) {
            toast.success(res.data.message);
            fetchInform(user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
    if (
      formDataPassword.currentPassword ||
      formDataPassword.newPassword ||
      formDataPassword.confirmPassword
    ) {
      const isValid = validate();
      if (isValid) {
        try {
          const res = await request.postRequest(`users/profilePassword`, {
            currentPassword: formDataPassword.currentPassword,
            newPassword: formDataPassword.newPassword,
            id: user.id,
          });
          console.log(res);
        } catch (err) {
          if (err.response.status === 400) {
            toast.error(err.response.data.message);
          }
        }
      }
    }
  };

  const handleEdit = async (order, type) => {
    if (type === "return") {
      try {
        const res = await request.postRequest(`orders/return`, {
          id: order.id,
        });
        if (res.status === 200) {
          toast.success(res.data.message);
          fetchOrders(user);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      if (edit) {
        const isValid = validate();
        if (isValid) {
          try {
            const res = await request.postRequest(`orders/edit/${order.id}`, {
              address: address,
            });
            if (res.status === 200) {
              toast.success(res.data.message);
              fetchOrders(user);
              setRowId(null);
              setEdit(false);
            }
          } catch (err) {
            console.error(err);
          }
        }
      } else {
        setAddress(order.address);
        setRowId(order.id);
        setEdit(true);
      }
    }
  };

  const fetchOrders = async (user) => {
    try {
      const res = await request.getRequest(`orders/user/${user.id}`);
      // console.log(res);
      if (res.status === 200) {
        setOrders(res.data.results);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInform = async (user) => {
    try {
      const res = await request.getRequest(`users/user/${user.id}`);
      setFormDataInform({
        ...formDataInform,
        username: res.data.results[0].username,
        email: res.data.results[0].email,
        name: res.data.results[0].name || "None",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUser = async (token) => {
    try {
      const res = await request.postRequest("users/verifyToken", { token });
      if (res.status === 200) {
        handleSet(res.data.results);
        fetchOrders(res.data.results);
        fetchInform(res.data.results);
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

  return (
    <>
      <div className="container py-5 mt-5 profileContainer">
        <div className="profileRow">
          <div className="profileLeftContainer">
            <ul>
              <li
                className={mode === "information" ? "active" : null}
                onClick={() => handleSwap("information")}
              >
                Information
              </li>
              <li
                className={mode === "orders" ? "active" : null}
                onClick={() => handleSwap("orders")}
              >
                Orders
              </li>
            </ul>
          </div>
          <div className="profileRightContainer">
            {mode === "information" ? (
              <div className="row">
                <div className="row">
                  <div className="col-md-6">
                    <label>Username</label>
                    <input
                      type="text"
                      className={
                        errors.username
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      name="username"
                      value={formDataInform.username}
                      onChange={handleChangeInform}
                    />
                    {errors.username && (
                      <div
                        id="validationServerBrandFeedback"
                        className="invalid-feedback"
                      >
                        {errors.username}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label>Name</label>
                    <input
                      type="text"
                      className={
                        errors.name ? "form-control is-invalid" : "form-control"
                      }
                      name="name"
                      value={formDataInform.name}
                      onChange={handleChangeInform}
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
                <div className="row">
                  <div className="col-md-12">
                    <label>Email</label>
                    <input
                      type="email"
                      className={
                        errors.email
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      value={formDataInform.email}
                      onChange={handleChangeInform}
                      name="email"
                    />
                    {errors.email && (
                      <div
                        id="validationServerBrandFeedback"
                        className="invalid-feedback"
                      >
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>
                <h5 className="my-3">PASSWORD CHANGE</h5>
                <div className="row">
                  <div className="col-md-12">
                    <label>Current password</label>
                    <input
                      type="password"
                      className={
                        errors.currentPassword
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      value={formDataPassword.currentPassword}
                      onChange={handleChangePassword}
                      name="currentPassword"
                    />
                    {errors.currentPassword && (
                      <div
                        id="validationServerBrandFeedback"
                        className="invalid-feedback"
                      >
                        {errors.currentPassword}
                      </div>
                    )}
                  </div>
                  <div className="col-md-12">
                    <label>New password</label>
                    <input
                      type="password"
                      className={
                        errors.newPassword
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      value={formDataPassword.newPassword}
                      onChange={handleChangePassword}
                      name="newPassword"
                    />
                    {errors.newPassword && (
                      <div
                        id="validationServerBrandFeedback"
                        className="invalid-feedback"
                      >
                        {errors.newPassword}
                      </div>
                    )}
                  </div>
                  <div className="col-md-12">
                    <label>Confirm password</label>
                    <input
                      type="password"
                      className={
                        errors.confirmPassword
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      value={formDataPassword.confirmPassword}
                      onChange={handleChangePassword}
                      name="confirmPassword"
                    />
                    {errors.confirmPassword && (
                      <div
                        id="validationServerBrandFeedback"
                        className="invalid-feedback"
                      >
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <button
                      className="handleButtonProfile"
                      onClick={handleEditInform}
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Address</th>
                      <th scope="col">Method</th>
                      <th scope="col">Phone</th>
                      <th scope="col">Total</th>
                      <th scope="col">Status</th>
                      <th scope="col">Created at</th>
                      <th scope="col">Handle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders &&
                      orders.length > 0 &&
                      orders.map((order) => {
                        return (
                          <tr key={order.id}>
                            <th scope="row">{order.id}</th>
                            <td>
                              {rowId === order.id && edit ? (
                                <>
                                  <input
                                    type="text"
                                    className={
                                      errors.address
                                        ? "form-control is-invalid"
                                        : "form-control"
                                    }
                                    value={address}
                                    defaultValue={order.address}
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
                                </>
                              ) : (
                                order.address
                              )}
                            </td>
                            <td>{order.pay}</td>
                            <td>{order.phone_number}</td>
                            <td>{order.total}</td>
                            <td>{order.status}</td>
                            <td>{order.created_at}</td>
                            <td>
                              {order.status === "Cancel" ||
                              order.status === "Pending" ? (
                                <>
                                  {order.status === "Cancel" ? (
                                    <>
                                      <button
                                        className="btn btn-danger"
                                        onClick={() =>
                                          handleCAR(order, "delete")
                                        }
                                      >
                                        Xóa
                                      </button>
                                      <button
                                        className="btn btn-primary"
                                        onClick={() =>
                                          handleEdit(order, "return")
                                        }
                                      >
                                        Khôi phục
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        className="btn btn-warning"
                                        onClick={() =>
                                          handleCAR(order, "cancel")
                                        }
                                      >
                                        Hủy
                                      </button>
                                      <button
                                        className="btn btn-primary"
                                        onClick={() => handleEdit(order)}
                                      >
                                        {edit && rowId === order.id
                                          ? "Xác nhận"
                                          : "Sửa"}
                                      </button>
                                    </>
                                  )}
                                </>
                              ) : null}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;