import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Obtener el usuario del resultado del login
        const user = JSON.parse(localStorage.getItem('user'));
        
        // Redirigir según el rol del usuario
        if (user && user.rol === 'admin') {
          // Si es admin, redirigir al panel de administración
          navigate('/admin/users');
        } else if (user && ['mantenimiento'].includes(user.rol)) {
          // Si es mantenimiento, redirigir al dashboard normal
          navigate('/reportes');
        } else {
          // Si no tiene rol permitido, mostrar error
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setError('No tienes permisos para acceder al sistema. Contacta al administrador.');
          setLoading(false);
          return;
        }
      } else {
        // Asegurar que siempre se muestre un mensaje
        const errorMsg = result.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
        setError(errorMsg);
        console.log('Error en login:', result);
      }
    } catch (err) {
      // Capturar cualquier error inesperado
      console.error('Error inesperado en login:', err);
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales e intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>SIRGM</h1>
          <p>Sistema de Gestión de Reportes y Mantenimiento</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Ingresa tu email"
              autoComplete="email"
              spellCheck="false"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ingresa tu contraseña"
              autoComplete="current-password"
              spellCheck="false"
            />
          </div>
          
          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Acceso para personal administrativo y de mantenimiento</p>
        </div>
      </div>
    </div>
  );
};

export default Login;





