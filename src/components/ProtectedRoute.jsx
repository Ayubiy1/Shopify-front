import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../auth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get("/api/auth/me", {
          withCredentials: true, // cookie yuboriladi
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) return <h2>Loading...</h2>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function ProtectedRoute({ children, allowedRoles }) {
//     const { user } = useAuth();

//     if (!user) return <Navigate to="/login" replace />;
//     if (allowedRoles && !allowedRoles.includes(user.role)) {
//         return <Navigate to="/unauthorized" replace />;
//     }

//     return children;
// }
