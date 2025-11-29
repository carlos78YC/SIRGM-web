import { useState } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { adminService } from '../services/api';
import './DatabaseTools.css';

const DatabaseTools = () => {
  const { isAdmin, checking } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExport = async (type) => {
    try {
      setLoading(true);
      setError('');

      if (type === 'users') {
        await adminService.exportUsers();
      } else {
        await adminService.exportReportes();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al exportar datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return <div className="loading">Cargando...</div>;
  }

  if (!isAdmin) {
    return null; // useAdminAuth redirige automáticamente
  }

  return (
    <div className="database-tools">
      <h1>Herramientas de Base de Datos</h1>
      <p className="subtitle">Exporta los datos del sistema en formato CSV</p>

      {error && <div className="error-banner">{error}</div>}

      <div className="export-cards">
        <div className="export-card">
          <div className="export-icon">👥</div>
          <h2>Exportar Usuarios</h2>
          <p>Descarga todos los usuarios registrados en el sistema incluyendo sus roles y estados.</p>
          <button
            onClick={() => handleExport('users')}
            disabled={loading}
            className="export-button"
          >
            {loading ? 'Exportando...' : '📥 Descargar CSV'}
          </button>
        </div>

        <div className="export-card">
          <div className="export-icon">📊</div>
          <h2>Exportar Reportes</h2>
          <p>Descarga todos los reportes del sistema con información completa de cada uno.</p>
          <button
            onClick={() => handleExport('reportes')}
            disabled={loading}
            className="export-button"
          >
            {loading ? 'Exportando...' : '📥 Descargar CSV'}
          </button>
        </div>
      </div>

      <div className="info-box">
        <h3>ℹ️ Información</h3>
        <ul>
          <li>Los archivos CSV se descargarán en formato UTF-8 para preservar caracteres especiales.</li>
          <li>Los datos incluyen toda la información disponible en el sistema.</li>
          <li>Los archivos pueden ser abiertos en Excel, Google Sheets u otros programas de hojas de cálculo.</li>
        </ul>
      </div>
    </div>
  );
};

export default DatabaseTools;

