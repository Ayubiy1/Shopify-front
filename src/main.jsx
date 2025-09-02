import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminPage from "./pages/Admin/AdminPage";
import SellerPage from "./pages/Saler/SellerPage";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./AppLayout.jsx"; // App ni faqat layout sifatida ishlatamiz
import UserPage from "./pages/Users";
import { QueryClient, QueryClientProvider, } from "@tanstack/react-query";
import Register from "./pages/Register.jsx";
import axios from "axios";
import CategoriesPage from "./pages/Users/Categories/CategoriesPage.jsx";

import "./index.css"
import ProductNameId from "./pages/Users/Product-name-id/Product.jsx";

axios.defaults.baseURL = "http://localhost:10000/api";
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
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "seller",
        element: (
          <ProtectedRoute allowedRoles={["seller"]}>
            <SellerPage />
          </ProtectedRoute>
        ),
      },
    ],
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