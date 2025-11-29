import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar que el usuario tenga rol permitido (admin o mantenimiento)
  const allowedRoles = ['admin', 'mantenimiento'];
  if (user && !allowedRoles.includes(user.rol)) {
    return (
      <div className="loading" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        gap: '20px'
      }}>
        <h2>Acceso Denegado</h2>
        <p style={{ color: '#666', textAlign: 'center', maxWidth: '500px' }}>
          Lo sentimos, no tienes permisos para acceder al dashboard.
          <br />
          Solo el personal administrativo y de mantenimiento puede acceder a esta sección.
        </p>
        <button 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;





