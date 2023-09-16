import { Navigate } from 'react-router-dom'; // Add this line if not already imported
import { AuthService } from '../../service/api/auth.service';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = AuthService.getBearer();

  if (!token) {
    // not logged in so redirect to login page with the return url
    return <Navigate to="/login" replace />;
  }

  // authorized so return child components
  return <>{children}</>;
}
