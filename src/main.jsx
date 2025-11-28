import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import SellerPage from "./pages/Saler/SellerPage";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./AppLayout.jsx"; // App ni faqat layout sifatida ishlatamiz
import UserPage from "./pages/Users";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Register from "./pages/Register.jsx";
import axios from "axios";
import CategoriesPage from "./pages/Users/Categories/CategoriesPage.jsx";

import "./index.css";
import ProductNameId from "./pages/Users/Product-name-id/Product.jsx";
import CartPage from "./pages/Users/CartPage.jsx";
import AdminLayout from "./pages/Admin/AdminPage";
import AdminProducts from "./pages/Admin/Products/Products.jsx";

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
    ],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        path: "/admin",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>admin</ProtectedRoute>
        ),
      },
      {
        path: "/admin/products",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProducts />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/orders",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>orders</ProtectedRoute>
        ),
      },
      {
        path: "/admin/users",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>users</ProtectedRoute>
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

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </AuthProvider>
);

{
  // import { StrictMode } from 'react'
  // import { createRoot } from 'react-dom/client'
  // import './index.css'
  // import App from './App.jsx'
  // import { BrowserRouter } from 'react-router-dom'
  // import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  // const queryClient = new QueryClient();
  // createRoot(document.getElementById('root')).render(
  //   <StrictMode>
  //     <QueryClientProvider client={queryClient}>
  //       <BrowserRouter>
  //         <App />
  //       </BrowserRouter>
  //     </QueryClientProvider>
  //   </StrictMode>,
  // )
}
