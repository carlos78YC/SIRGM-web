import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <div className="admin-nav-header">
          <h2>Panel de Administración</h2>
          <div className="admin-user-info">
            <span>{user?.nombre} {user?.apellido}</span>
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        </div>
        <div className="admin-nav-links">
          <Link
            to="/admin/users"
            className={location.pathname === '/admin/users' ? 'active' : ''}
          >
            👥 Gestión de Usuarios
          </Link>
          <Link
            to="/admin/export"
            className={location.pathname === '/admin/export' ? 'active' : ''}
          >
            📊 Exportar Datos
          </Link>
        </div>
      </nav>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;




