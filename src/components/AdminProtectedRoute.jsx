import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminProtectedRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminProtectedRoute;
