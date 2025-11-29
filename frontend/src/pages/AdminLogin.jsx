import { Navigate } from 'react-router-dom';

// Redirigir al login principal - los admins ahora usan el mismo login
// Si alguien accede directamente a /admin/login, lo redirigimos al login principal
const AdminLogin = () => {
  return <Navigate to="/login" replace />;
};

export default AdminLogin;



