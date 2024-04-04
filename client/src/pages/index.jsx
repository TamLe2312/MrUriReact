import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/navbar";
import Footer from "../components/footer/footer";
import { useContext, useEffect } from "react";
import * as request from "../utilities/request";
import { UserContext } from "../context/userProvider";

const Home = () => {
  const { setUser } = useContext(UserContext);

  const fetchUser = async (token) => {
    try {
      const res = await request.postRequest("users/verifyToken", { token });
      if (res.status === 200) {
        // console.log(res);
        setUser(res.data.results);
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
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};
export default Home;
