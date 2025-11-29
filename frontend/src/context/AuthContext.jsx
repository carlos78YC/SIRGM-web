import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Guardar el usuario sin restricciones de rol (cada ruta manejará sus propios permisos)
        setUser(parsedUser);
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const userData = response.data.user;
      const token = response.data.token;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      // Extraer el mensaje del backend
      let errorMessage = 'El email o la contraseña no coinciden. Por favor, verifica tus credenciales e intenta nuevamente.';
      
      // Verificar si hay respuesta del servidor
      if (error.response) {
        // El servidor respondió con un error
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 401) {
          errorMessage = 'El email o la contraseña no coinciden. Por favor, verifica tus credenciales e intenta nuevamente.';
        }
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        errorMessage = 'No se pudo conectar al servidor. Verifica que el backend esté corriendo.';
      } else {
        // Error al configurar la petición
        errorMessage = error.message || 'Error al iniciar sesión';
      }
      
      console.log('Error completo en AuthContext:', {
        response: error.response?.data,
        status: error.response?.status,
        message: errorMessage
      });
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Función para verificar si el usuario tiene un rol permitido
  const hasAllowedRole = () => {
    if (!user) return false;
    const allowedRoles = ['admin', 'mantenimiento'];
    return allowedRoles.includes(user.rol);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    hasAllowedRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};





