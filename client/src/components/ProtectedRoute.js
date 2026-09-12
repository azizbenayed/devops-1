import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

// Pass adminOnly to also gate a route behind the admin role (e.g. the
// "sell a ticket" page). Non-admins get bounced home with a toast instead
// of a silent redirect.
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === "admin";
  const forbidden = isAuthenticated && adminOnly && !isAdmin;

  useEffect(() => {
    if (forbidden) {
      toast.error("This page is reserved for admins.");
    }
  }, [forbidden]);

  if (!isAuthenticated) return <Navigate to="/sign-in" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
