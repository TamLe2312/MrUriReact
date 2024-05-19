import { createContext } from "react";
import EditProductProvider from "./editProductProvider";
import CartProvider from "./cartProvider";
import UserProvider from "./userProvider";
import SocketContextProvider from "./socketContext";
import SliderProvider from "./sliderContext";
export const Contexts = createContext();

function AllContext({ children }) {
  return (
    <Contexts.Provider value={null}>
      <SliderProvider>
        <UserProvider>
          <SocketContextProvider>
            <CartProvider>
              <EditProductProvider>{children}</EditProductProvider>
            </CartProvider>
          </SocketContextProvider>
        </UserProvider>
      </SliderProvider>
    </Contexts.Provider>
  );
}
export default AllContext;
