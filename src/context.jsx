import { createContext, useContext, useState } from "react";

const EditedProductContext = createContext();

export const useEditedProduct = () => useContext(EditedProductContext);

export const EditedProductProvider = ({ children }) => {
  const [editedProduct, setEditedProduct] = useState();
  const [isEdit, setIsEdit] = useState(false);

  return (
    <EditedProductContext.Provider
      value={{ editedProduct, setEditedProduct, isEdit, setIsEdit }}
    >
      {children}
    </EditedProductContext.Provider>
  );
};
