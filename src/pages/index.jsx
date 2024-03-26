import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
export default Home;
