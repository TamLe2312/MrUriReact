import { Suspense, lazy } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import AdminHome from "./pages/admin/adminHome";
import Dashboard from "./pages/admin/dashboard/dashboard";
import Users from "./pages/admin/users/users";
import Products from "./pages/admin/products/products";
import AddProduct from "./pages/admin/products/addProduct";
import { EditedProductProvider } from "./context";
const LazyHome = lazy(() => import("./pages/index"));
const LazyHomepage = lazy(() => import("./pages/home/homepage"));
const LazyProductDetail = lazy(() =>
  import("./pages/home/productDetail/productDetail")
);
import Loading from "./components/loading/Loading";

function App() {
  return (
    <EditedProductProvider>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <LazyHome />
            </Suspense>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<Loading />}>
                <LazyHomepage />
              </Suspense>
            }
          />
          <Route
            path="/product/:id"
            element={
              <Suspense fallback={<Loading />}>
                <LazyProductDetail />
              </Suspense>
            }
          />
        </Route>
        <Route path="/dashboard" element={<AdminHome />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products">
            <Route index element={<Products />} />
            <Route path="add" element={<AddProduct />} />
          </Route>
        </Route>
      </Routes>
      <Toaster position="top-right" expand={false} richColors />
    </EditedProductProvider>
  );
}

export default App;
