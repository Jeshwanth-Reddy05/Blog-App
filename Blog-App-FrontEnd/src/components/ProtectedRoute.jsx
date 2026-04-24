import { useAuth } from '../store/authStore';
import { Navigate } from 'react-router';

function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, isAuthenticated, loading } = useAuth();

  //  Loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  //  Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  //  Role not allowed
  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  //  Allowed
  return children;
}

export default ProtectedRoute;