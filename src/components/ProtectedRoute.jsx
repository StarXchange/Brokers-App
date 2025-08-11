// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Your auth context
  
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;