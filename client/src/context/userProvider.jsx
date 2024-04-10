import { createContext, useState } from "react";
export const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const handleSet = (user) => {
    // console.log(user);
    setUser(user);
  };

  return (
    <UserContext.Provider value={{ user, setUser, handleSet }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
