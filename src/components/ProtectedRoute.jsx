import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({
  children,
  adminOnly = false,
  requiredEntityType, // Add this new prop
  fallbackToDashboard = true,
}) => {
  const { user, isAuthenticated } = useAuth();

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only access check
  if (adminOnly) {
    const userEntityType = user?.entityType?.toLowerCase();
    if (userEntityType !== "user") {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // EntityType-only access check
  if (requiredEntityType) {
    const userEntityType = user?.entityType?.toLowerCase();
    const requiredEntityTypeLower = requiredEntityType?.toLowerCase();

    const hasAccess =
      Boolean(userEntityType) && userEntityType === requiredEntityTypeLower;

    if (!hasAccess) {
      if (fallbackToDashboard) {
        // Redirect to appropriate dashboard based on user's entityType
        const dashboardPaths = {
          broker: "/brokers/dashboard",
          customer: "/client/dashboard",
          company: "/company/dashboard",
          user: "/admin/dashboard",
        };

        const dashboardPath = dashboardPaths[userEntityType] || "/";
        return <Navigate to={dashboardPath} replace />;
      }
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
