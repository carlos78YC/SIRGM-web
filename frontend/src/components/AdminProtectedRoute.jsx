import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import AdminLayout from './AdminLayout';

const AdminProtectedRoute = ({ children }) => {
  const { isAdmin, checking } = useAdminAuth();

  if (checking) {
    return <div className="loading">Cargando...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/no-access" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

export default AdminProtectedRoute;

