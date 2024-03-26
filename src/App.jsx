import "./App.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/home/homepage";
import Home from "./pages";
import { Toaster } from "sonner";
import AdminHome from "./pages/admin/adminHome";
import Dashboard from "./pages/admin/dashboard/dashboard";
import Categories from "./pages/admin/categories/categories";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Homepage />} />
        </Route>
        <Route path="/dashboard" element={<AdminHome />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
        </Route>
      </Routes>
      <Toaster position="top-right" expand={false} richColors />
    </>
  );
}

export default App;
