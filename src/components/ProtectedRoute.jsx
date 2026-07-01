import { Navigate, Outlet } from 'react-router-dom';
import { secureStorage } from '../utils/storage';

export default function ProtectedRoute() {
  const token = secureStorage.getItem('makuma_token');
  const admin = secureStorage.getItem('makuma_admin');

  if (!token || !admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
