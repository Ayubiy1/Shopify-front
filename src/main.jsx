import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";

import "./index.css";
import AppLayout from "./AppLayout.jsx"; // App ni faqat layout sifatida ishlatamiz
import { AuthProvider } from "./context/AuthContext";
import SellerPage from "./pages/Saler/SellerPage";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import UserPage from "./pages/Users";
import Register from "./pages/Register.jsx";
import CategoriesPage from "./pages/Users/Categories/CategoriesPage.jsx";
import ProductNameId from "./pages/Users/Product-name-id/Product.jsx";
import CartPage from "./pages/Users/CartPage.jsx";
import AdminLayout from "./pages/Admin/AdminPage";
import AdminProducts from "./pages/Admin/Products/Products.jsx";
import AdminUsers from "./pages/Admin/Users/AdminUsers.jsx";
import AdminCorusel from "./pages/Admin/Corusel/AdminCorusel.jsx";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard.jsx";
import AdminOrders from "./pages/Admin/Users/AdminOrders.jsx";
import StockHistoryPage from "./pages/Admin/Products/StockHistoryPage.jsx";
import ProfileP from "./pages/Users/Profile/Profile.jsx";

axios.defaults.baseURL = "https://shopify-backend-vcnq.onrender.com/";
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserPage />, // layout
    children: [
      {
        path: "/users",
        element: (
          <ProtectedRoute allowedRoles={["buyer"]}>
            <AppLayout />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users/:id",
        element: (
          <ProtectedRoute allowedRoles={["buyer"]}>
            <CategoriesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users/:name/:id",
        element: (
          <ProtectedRoute allowedRoles={["buyer"]}>
            <ProductNameId />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users/cart",
        element: (
          <ProtectedRoute allowedRoles={["buyer"]}>
            <CartPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users/profil",
        element: (
          <ProtectedRoute allowedRoles={["buyer"]}>
            <ProfileP />
            
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        path: "/admin",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/products/table",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProducts />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/products/stock-history",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <StockHistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/orders",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminOrders />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/users",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/corusel",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminCorusel />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "seller",
    element: (
      <ProtectedRoute allowedRoles={["seller"]}>
        <SellerPage />
      </ProtectedRoute>
    ),
  },

  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/unauthorized", element: <h1>🚫 Kirish mumkin emas</h1> },
]);

const queryClient = new QueryClient();
const CLIENT_ID =
  "852221769478-pkl5g2h2af0p4cldi55ersikhs1sghcg.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  </GoogleOAuthProvider>
);
