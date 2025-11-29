import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h2>SIRGM</h2>
          <p>Sistema de Gestión</p>
        </div>
        
        <div className="sidebar-menu">
          <Link
            to="/reportes"
            className={`menu-item ${isActive('/reportes') ? 'active' : ''}`}
          >
            📋 Reportes
          </Link>
          <Link
            to="/estadisticas"
            className={`menu-item ${isActive('/estadisticas') ? 'active' : ''}`}
          >
            📊 Estadísticas
          </Link>
          {user?.rol === 'admin' && (
            <Link
              to="/admin/users"
              className={`menu-item ${isActive('/admin/users') || isActive('/admin/export') ? 'active' : ''}`}
            >
              ⚙️ Administración
            </Link>
          )}
        </div>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.nombre?.charAt(0) || 'U'}
            </div>
            <div className="user-details">
              <p className="user-name">
                {user?.nombre} {user?.apellido}
              </p>
              <p className="user-role">{user?.rol}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </nav>
      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;








