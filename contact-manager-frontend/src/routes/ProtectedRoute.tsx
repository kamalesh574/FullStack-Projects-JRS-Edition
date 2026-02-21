import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: string;
}) => {
  const { auth } = useAuth();

  if (!auth.username) return <Navigate to="/" />;

  if (requiredRole && auth.role !== requiredRole)
    return <Navigate to="/dashboard" />;

  return <>{children}</>;
};

export default ProtectedRoute;