import "./App.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/home/homepage";
import Home from "./pages";
import { Toaster } from "sonner";
import AdminHome from "./pages/admin/adminHome";
import Dashboard from "./pages/admin/dashboard/dashboard";
import Users from "./pages/admin/users/users";
import Products from "./pages/admin/products/products";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Homepage />} />
        </Route>
        <Route path="/dashboard" element={<AdminHome />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
        </Route>
      </Routes>
      <Toaster position="top-right" expand={false} richColors />
    </>
  );
}

export default App;
