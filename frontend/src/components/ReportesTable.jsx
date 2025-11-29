import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reporteService } from '../services/api';
import './ReportesTable.css';

const ReportesTable = () => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    estado: '',
    prioridad: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadReportes();
  }, [filters]);

  const loadReportes = async () => {
    try {
      setLoading(true);
      const response = await reporteService.getAll(filters);
      setReportes(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar reportes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getEstadoBadgeClass = (estado) => {
    const classes = {
      pendiente: 'badge-pendiente',
      en_proceso: 'badge-proceso',
      resuelto: 'badge-resuelto',
      cerrado: 'badge-cerrado',
    };
    return classes[estado] || 'badge-default';
  };

  const getPrioridadBadgeClass = (prioridad) => {
    const classes = {
      baja: 'badge-baja',
      media: 'badge-media',
      alta: 'badge-alta',
      urgente: 'badge-urgente',
    };
    return classes[prioridad] || 'badge-default';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="loading">Cargando reportes...</div>;
  }

  return (
    <div className="reportes-container">
      <div className="reportes-header">
        <h1>Reportes</h1>
        <button onClick={loadReportes} className="refresh-button">
          🔄 Actualizar
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filters-container">
        <div className="filter-group">
          <label>Estado:</label>
          <select
            value={filters.estado}
            onChange={(e) => handleFilterChange('estado', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En Proceso</option>
            <option value="resuelto">Resuelto</option>
            <option value="cerrado">Cerrado</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Prioridad:</label>
          <select
            value={filters.prioridad}
            onChange={(e) => handleFilterChange('prioridad', e.target.value)}
          >
            <option value="">Todas</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="reportes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Usuario</th>
              <th>Ubicación</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reportes.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No hay reportes disponibles
                </td>
              </tr>
            ) : (
              reportes.map((reporte) => (
                <tr key={reporte.id}>
                  <td>{reporte.id}</td>
                  <td className="titulo-cell">{reporte.titulo}</td>
                  <td>
                    {reporte.usuario_nombre} {reporte.usuario_apellido}
                  </td>
                  <td>{reporte.ubicacion || '-'}</td>
                  <td>
                    <span className={`badge ${getPrioridadBadgeClass(reporte.prioridad)}`}>
                      {reporte.prioridad}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getEstadoBadgeClass(reporte.estado)}`}>
                      {reporte.estado.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{formatDate(reporte.created_at)}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/reportes/${reporte.id}`)}
                      className="action-button"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportesTable;









