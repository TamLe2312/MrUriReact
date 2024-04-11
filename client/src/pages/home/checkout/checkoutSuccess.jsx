import { Link } from "react-router-dom";
import "./checkout.css";
import DoneIcon from "@mui/icons-material/Done";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as request from "../../../utilities/request";

const CheckoutSuccess = () => {
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
