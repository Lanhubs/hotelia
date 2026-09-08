import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, type UserRole } from '../../stores/authStore';

// Allowed roles for the admin dashboard
const ALLOWED_ROLES: UserRole[] = ['manager', 'receptionist'];

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = ALLOWED_ROLES 
}: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useAuthStore((state) => state.currentUser);
  const getAuthToken = useAuthStore((state) => state.getAuthToken);

  // Check for valid token in sessionStorage
  const token = getAuthToken();
  const hasValidToken = !!token && token.length > 0;

  // Check if user has allowed role
  const hasAllowedRole = allowedRoles.includes(currentUser.role);

  // Not authenticated or no valid token - redirect to login
  if (!isAuthenticated || !hasValidToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated but role not allowed - redirect to login with error
  if (!hasAllowedRole) {
    // Clear invalid session
    sessionStorage.removeItem('auth_token');
    return <Navigate to="/login" state={{ 
      from: location, 
      error: 'Unauthorized access. Only managers and receptionists can access the dashboard.' 
    }} replace />;
  }

  return <>{children}</>;
}