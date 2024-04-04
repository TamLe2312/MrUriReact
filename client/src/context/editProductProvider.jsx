import { createContext, useState } from "react";

export const EditProductContext = createContext();

function EditProductProvider({ children }) {
  const [editedProduct, setEditedProduct] = useState();
  const [isEdit, setIsEdit] = useState(false);

  return (
    <EditProductContext.Provider
      value={{ editedProduct, setEditedProduct, isEdit, setIsEdit }}
    >
      {children}
    </EditProductContext.Provider>
  );
}

export default EditProductProvider;
