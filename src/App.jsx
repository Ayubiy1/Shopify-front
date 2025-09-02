import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Users from "./pages/Users/index.jsx";
import AdminPage from "./pages/Admin/AdminPage.jsx";
import SellerPage from "./pages/Saler/SellerPage.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "users",
        element: (
          <ProtectedRoute allowedRoles={["user"]}>
            <Users />
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
  { path: "/login", element: <Login /> },
  { path: "/unauthorized", element: <h1>🚫 Kirish mumkin emas</h1> },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
export default App


{

  // import './App.css'
  // import { Route, Routes } from 'react-router-dom'
  // import Home from './pages/Home'
  // import AboutP from './pages/About'

  // function App() {

  //   return (
  //     <>
  //       <Routes>
  //         <Route path="/" element={<Home />}>
  //           <Route index element={<Home />} />
  //           <Route path="about" element={<AboutP />} />
  //         </Route>
  //       </Routes>
  //     </>
  //   )
  // }

  // export default App

}
