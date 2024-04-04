import { createContext } from "react";
import EditProductProvider from "./editProductProvider";
import CartProvider from "./cartProvider";
import UserProvider from "./userProvider";
export const Contexts = createContext();

function AllContext({ children }) {
  return (
    <Contexts.Provider value={null}>
      <UserProvider>
        <CartProvider>
          <EditProductProvider>{children}</EditProductProvider>
        </CartProvider>
      </UserProvider>
    </Contexts.Provider>
  );
}
export default AllContext;
