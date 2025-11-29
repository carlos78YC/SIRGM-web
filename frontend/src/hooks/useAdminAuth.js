import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useAdminAuth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Usuario no autenticado, redirigir al login principal
        navigate('/login');
        setChecking(false);
        return;
      }

      if (user.rol !== 'admin') {
        // Usuario no es admin, redirigir a no-access
        setIsAdmin(false);
        navigate('/admin/no-access');
        setChecking(false);
        return;
      }

      // Usuario es admin
      setIsAdmin(true);
      setChecking(false);
    }
  }, [user, loading, navigate]);

  return { isAdmin, checking, user };
};



