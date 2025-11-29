import { useNavigate } from 'react-router-dom';
import './NoAccess.css';

const NoAccess = () => {
  const navigate = useNavigate();

  return (
    <div className="no-access-container">
      <div className="no-access-box">
        <div className="no-access-icon">🚫</div>
        <h1>Acceso Denegado</h1>
        <p>No tienes permisos para acceder a esta sección.</p>
        <p className="no-access-subtitle">Se requiere rol de administrador.</p>
        <button onClick={() => navigate('/login')} className="back-button">
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default NoAccess;




