import { Navigate } from 'react-router-dom'; // Add this line if not already imported
import { useSelector } from 'react-redux';
import { RootState } from '@reduxjs/toolkit/dist/query/core/apiState';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useSelector((state: { auth: RootState<any, any, any> }) => state.auth);

  if (!isLoggedIn) {
    // not logged in so redirect to login page with the return url
    return <Navigate to='/login' replace />;
  }

  // authorized so return child components
  return <>{children}</>;
}
