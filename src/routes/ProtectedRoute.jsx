import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { findNavItem } from "./navItems";

// Sends logged-out visitors to /register (the launch page), and users to the dashboard
// if they open a page their role is not allowed to see.
export function ProtectedRoute({ children }) {
  const { user, role } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/register" replace />;
  }

  const item = findNavItem(location.pathname);
  if (item && !item.roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Keeps logged-in users away from the login and register pages.
export function GuestRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  return user ? <Navigate to={location.state?.from || "/"} replace /> : children;
}
