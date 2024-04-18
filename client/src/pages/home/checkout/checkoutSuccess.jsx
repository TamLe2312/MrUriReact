import { Link, useNavigate } from "react-router-dom";
import "./checkout.css";
import DoneIcon from "@mui/icons-material/Done";
import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as request from "../../../utilities/request";
import { UserContext } from "../../../context/userProvider";
import { toast } from "sonner";

const CheckoutSuccess = () => {
  const navigate = useNavigate();

  const { user, handleSet } = useContext(UserContext);
  const fetchUser = async (token) => {
    try {
      const res = await request.postRequest("users/verifyToken", { token });
      if (res.status === 200) {
        // console.log(res);
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
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      handleSet(null);
      toast.error("You need to sign in first");
      navigate("/sign-in");
    }
  }, []);
  const location = useLocation();
  const VnpayReturn = async (orderId) => {
    try {
      /* const res =  */ await request.postRequest(`carts/vnpay-return`, {
        orderId: orderId,
      });
      // console.log(res);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const vnp_TransactionStatus = searchParams.get("vnp_TransactionStatus");
    if (vnp_TransactionStatus && vnp_TransactionStatus == "00") {
      const vnp_TxnRef = searchParams.get("vnp_TxnRef");
      VnpayReturn(vnp_TxnRef);
    }
  }, [location]);
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

      <div className="container-fluid py-2">
        <div className="container py-5 checkoutSuccess">
          <DoneIcon className="successIcon" />
          <h1>Check Out Success</h1>
          <p>Thank you for buying our products</p>
          <div className="handleRedirect">
            <Link to={"/"}>Continue Shopping</Link>
            <Link to={"/"}>View orders</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutSuccess;
