import { Suspense, lazy } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { EditedProductProvider } from "./context";

const LazyHome = lazy(() => import("./pages/index"));
const LazyHomepage = lazy(() => import("./pages/home/homepage"));
const LazyProductDetail = lazy(() =>
  import("./pages/home/productDetail/productDetail")
);
const LazyLogin = lazy(() => import("./pages/home/login/login"));
const LazySignUp = lazy(() => import("./pages/home/signup/signup"));
const LazyAdminHome = lazy(() => import("./pages/admin/adminHome"));
const LazyDashboard = lazy(() => import("./pages/admin/dashboard/dashboard"));
const LazyUsers = lazy(() => import("./pages/admin/users/users"));
const LazyAddProduct = lazy(() => import("./pages/admin/products/addProduct"));
const LazyProducts = lazy(() => import("./pages/admin/products/products"));
import AddProduct from "./pages/admin/products/addProduct";

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
        <Route
          path="/sign-in"
          element={
            <Suspense fallback={<Loading />}>
              <LazyLogin />
            </Suspense>
          }
        />
        <Route
          path="/sign-up"
          element={
            <Suspense fallback={<Loading />}>
              <LazySignUp />
            </Suspense>
          }
        />
        <Route path="/dashboard" element={<LazyAdminHome />}>
          <Route
            index
            element={
              <Suspense fallback={<Loading />}>
                <LazyDashboard />
              </Suspense>
            }
          />
          <Route
            path="users"
            element={
              <Suspense fallback={<Loading />}>
                <LazyUsers />
              </Suspense>
            }
          />
          <Route path="products">
            <Route
              index
              element={
                <Suspense fallback={<Loading />}>
                  <LazyProducts />
                </Suspense>
              }
            />
            <Route
              path="add"
              element={
                <Suspense fallback={<Loading />}>
                  <LazyAddProduct />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Routes>
      <Toaster position="top-right" expand={false} richColors />
    </EditedProductProvider>
  );
}

export default App;
