import { Link } from "react-router-dom";
import "./checkout.css";
import DoneIcon from "@mui/icons-material/Done";

const CheckoutSuccess = () => {
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
