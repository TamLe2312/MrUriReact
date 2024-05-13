import { createContext } from "react";
import EditProductProvider from "./editProductProvider";
import CartProvider from "./cartProvider";
import UserProvider from "./userProvider";
import SocketContextProvider from "./socketContext";
export const Contexts = createContext();

function AllContext({ children }) {
  return (
    <Contexts.Provider value={null}>
      <UserProvider>
        <SocketContextProvider>
          <CartProvider>
            <EditProductProvider>{children}</EditProductProvider>
          </CartProvider>
        </SocketContextProvider>
      </UserProvider>
    </Contexts.Provider>
  );
}
export default AllContext;
