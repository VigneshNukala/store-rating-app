import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the attempted route
    localStorage.setItem("intendedPath", location.pathname);
    return <Navigate to="/signin" replace />;
  }

  if (userRole !== requiredRole) {
    return <Navigate to={`/${userRole}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
