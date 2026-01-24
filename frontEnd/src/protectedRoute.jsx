import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.is_admin) {
    return <Navigate to="/darshboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
