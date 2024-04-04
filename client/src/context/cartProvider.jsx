import { createContext, useContext, useEffect, useReducer } from "react";
import * as request from "../utilities/request";
import { toast } from "sonner";
import { UserContext } from "./userProvider";

export const CartContext = createContext();

function CartProvider({ children }) {
  const initData = {
    carts: [],
  };
  const { user } = useContext(UserContext);
  const addCart = async (cart) => {
    try {
      const res = await request.postRequest("carts/add", {
        cart: cart,
      });
      if (res.data.results.length > 0) {
        toast.success(res.data.message);
        return res.data.results;
      }
    } catch (err) {
      console.error(err);
    }
  };
  const deleteCart = async (cart) => {
    try {
      const res = await request.deleteRequest(`carts/delete/${cart.cart.id}`);
      if (res.data.results.length > 0) {
        toast.success(res.data.message);
        return res.data.results;
      }
    } catch (err) {
      console.error(err);
    }
  };
  const cartReducer = (state, action) => {
    // console.log("state.carts", state.carts);
    // console.log("action", action);
    switch (action.type) {
      case "SET_CART": {
        // console.log(action.payload);
        return {
          ...state,
          carts: action.payload,
        };
      }

      case "ADD_CART": {
        const newCarts = addCart(action.payload);
        return {
          ...state,
          carts: newCarts,
        };
      }
      case "DELETE_CART": {
        const newCarts = deleteCart(action.payload);
        return {
          ...state,
          carts: newCarts,
        };
      }
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  };
  const [carts, dispatch] = useReducer(cartReducer, initData);

  const fetchData = async (id) => {
    try {
      const res = await request.getRequest(`carts/${id}`);
      dispatch({ type: "SET_CART", payload: [...res.data.results] });
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (user) {
      fetchData(user.id);
    }
  }, [user]);
  return (
    <CartContext.Provider value={{ carts, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
