import { APP_URL } from "../../../config/env";
import { NavLink, useNavigate } from "react-router-dom";
import { formatNumber } from "../../../helper/helper";
import { useContext } from "react";
import { UserContext } from "../../../context/userProvider";
import { toast } from "sonner";
import { CartContext } from "../../../context/cartProvider";

const Product = ({ item }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { dispatch } = useContext(CartContext);
  const format = (price) => {
    return formatNumber(parseInt(price));
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
  return (
    <>
      {item ? (
        <div className="cart">
          <span className="cart_img">
            <img
              src={APP_URL + "/public/uploads/" + item.images[0]}
              alt={item.id}
            />
            <span className="cart_img_add" onClick={() => handleAddCart(item)}>
              Thêm vào giỏ hàng
            </span>
          </span>
          <NavLink
            to={`/product/` + item.id}
            style={{ display: "block" }}
            className="mt-2"
          >
            {item.product_name || "Name"}
          </NavLink>
          <span style={{ display: "block" }} className="mt-1">
            {format(item.selling_price)}
          </span>
        </div>
      ) : (
        <div className="cart">
          <span className="cart_img">
            <img src="https://join.travelmanagers.com.au/wp-content/uploads/2017/09/default-placeholder-300x300.png" />
            <span className="cart_img_add">Thêm vào giỏ hàng</span>
          </span>
          <span style={{ display: "block" }} className="mt-2">
            Name
          </span>
          <span style={{ display: "block" }} className="mt-1">
            1
          </span>
        </div>
      )}
    </>
  );
};

export default Product;
