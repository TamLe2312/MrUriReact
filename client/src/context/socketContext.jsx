import { useEffect } from "react";
import { createContext, useState } from "react";
import io from "socket.io-client";
import { APP_WEB } from "../config/env";
import * as request from "../utilities/request";

export const SocketContext = createContext();

function SocketContextProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState();

  const fetchUser = async (token) => {
    try {
      const res = await request.postRequest("users/verifyToken", { token });
      // console.log(res);
      if (res.status === 200) {
        if (res.data.results) {
          const socket = io(APP_WEB, {
            query: {
              userId: res.data.results.id,
            },
          });
          setSocket(socket);
          socket.on("getOnlineUser", (user) => {
            setOnlineUser(user);
          });
          return () => socket.close();
        } else {
          if (socket) {
            socket.close();
            setSocket(null);
          }
        }
      }
    } catch (err) {
      if (err.response.status === 500) {
        localStorage.removeItem("token");
      }
      console.error(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketContextProvider;
