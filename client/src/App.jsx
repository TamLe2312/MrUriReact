import { Suspense, lazy } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

const LazyHome = lazy(() => import("./pages/index"));
const LazyHomepage = lazy(() => import("./pages/home/homepage"));
const LazyProductDetail = lazy(() =>
  import("./pages/home/productDetail/productDetail")
);
const LazyLogin = lazy(() => import("./pages/home/login/login"));
const LazySignUp = lazy(() => import("./pages/home/signup/signup"));
const LazyForgotPassword = lazy(() =>
  import("./pages/home/forgotPassword/forgotPassword")
);
const LazyVerifyToken = lazy(() =>
  import("./pages/home/verifyToken/verifyToken")
);
const LazyAdminHome = lazy(() => import("./pages/admin/adminHome"));
const LazyDashboard = lazy(() => import("./pages/admin/dashboard/dashboard"));
const LazyUsers = lazy(() => import("./pages/admin/users/users"));
const LazyProfile = lazy(() => import("./pages/home/profile/profile"));
const LazyCategories = lazy(() =>
  import("./pages/admin/categories/categories")
);
const LazyAddProduct = lazy(() => import("./pages/admin/products/addProduct"));
const LazyProducts = lazy(() => import("./pages/admin/products/products"));
const LazyCarts = lazy(() => import("./pages/home/carts/carts"));
const LazyShopPage = lazy(() => import("./pages/home/shop/shop"));
const LazyCheckout = lazy(() => import("./pages/home/checkout/checkout"));
const LazyCheckoutSuccess = lazy(() =>
  import("./pages/home/checkout/checkoutSuccess")
);
const LazyProductView = lazy(() =>
  import("./pages/admin/products/productDetail")
);
import AddProduct from "./pages/admin/products/addProduct"; //KHÔNG ĐƯỢC XÓA,XÓA LÀ LỖI (DUNNO WHY SORRY)

import Loading from "./components/loading/Loading";

function App() {
  return (
    <>
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
          <Route
            path="/carts"
            element={
              <Suspense fallback={<Loading />}>
                <LazyCarts />
              </Suspense>
            }
          />
          <Route
            path="categories/:id"
            element={
              <Suspense fallback={<Loading />}>
                <LazyShopPage />
              </Suspense>
            }
          />
          <Route
            path="check-out"
            element={
              <Suspense fallback={<Loading />}>
                <LazyCheckout />
              </Suspense>
            }
          />
          <Route
            path="check-out/success"
            element={
              <Suspense fallback={<Loading />}>
                <LazyCheckoutSuccess />
              </Suspense>
            }
          />
          <Route
            path="profile"
            element={
              <Suspense fallback={<Loading />}>
                <LazyProfile />
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
        <Route
          path="/forgot-password"
          element={
            <Suspense fallback={<Loading />}>
              <LazyForgotPassword />
            </Suspense>
          }
        />
        <Route
          path="/verify-token"
          element={
            <Suspense fallback={<Loading />}>
              <LazyVerifyToken />
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
            <Route
              path="view/:id"
              element={
                <Suspense fallback={<Loading />}>
                  <LazyProductView />
                </Suspense>
              }
            />
          </Route>
          <Route
            path="categories"
            element={
              <Suspense fallback={<Loading />}>
                <LazyCategories />
              </Suspense>
            }
          />
        </Route>
      </Routes>
      <Toaster position="top-right" expand={false} richColors />
    </>
  );
}

export default App;
