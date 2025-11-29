import { useState, useEffect } from 'react';
import { statsService } from '../services/api';
import './Stats.css';

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await statsService.getStats();
      setStats(data);
      setError('');
    } catch (err) {
      setError('Error al cargar estadísticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDays = (days) => {
    if (days === 0) return '0 días';
    const d = Math.floor(days);
    const h = Math.floor((days - d) * 24);
    if (d === 0) return `${h} horas`;
    if (h === 0) return `${d} día${d > 1 ? 's' : ''}`;
    return `${d} día${d > 1 ? 's' : ''} ${h} hora${h > 1 ? 's' : ''}`;
  };

  if (loading) {
    return <div className="loading">Cargando estadísticas...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!stats) {
    return <div className="loading">No hay datos disponibles</div>;
  }

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h1>Estadísticas</h1>
        <button onClick={loadStats} className="refresh-button">
          🔄 Actualizar
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total de Reportes</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pendientes</h3>
            <p className="stat-value">{stats.porEstado.pendiente}</p>
            {stats.tiemposPromedio.pendiente > 0 && (
              <p className="stat-subtitle">
                Promedio: {formatDays(stats.tiemposPromedio.pendiente)}
              </p>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔧</div>
          <div className="stat-content">
            <h3>En Proceso</h3>
            <p className="stat-value">{stats.porEstado.en_proceso}</p>
            {stats.tiemposPromedio.en_proceso > 0 && (
              <p className="stat-subtitle">
                Promedio: {formatDays(stats.tiemposPromedio.en_proceso)}
              </p>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Resueltos</h3>
            <p className="stat-value">{stats.porEstado.resuelto}</p>
            {stats.tiemposPromedio.resuelto > 0 && (
              <p className="stat-subtitle">
                Promedio: {formatDays(stats.tiemposPromedio.resuelto)}
              </p>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔒</div>
          <div className="stat-content">
            <h3>Cerrados</h3>
            <p className="stat-value">{stats.porEstado.cerrado}</p>
            {stats.tiemposPromedio.cerrado > 0 && (
              <p className="stat-subtitle">
                Promedio: {formatDays(stats.tiemposPromedio.cerrado)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="stats-sections">
        <div className="stats-section">
          <h2>Reportes por Prioridad</h2>
          <div className="priority-stats">
            <div className="priority-item">
              <span className="priority-label">Baja</span>
              <div className="priority-bar">
                <div
                  className="priority-fill baja"
                  style={{
                    width: `${
                      stats.total > 0
                        ? (stats.porPrioridad.baja / stats.total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="priority-value">{stats.porPrioridad.baja}</span>
            </div>
            <div className="priority-item">
              <span className="priority-label">Media</span>
              <div className="priority-bar">
                <div
                  className="priority-fill media"
                  style={{
                    width: `${
                      stats.total > 0
                        ? (stats.porPrioridad.media / stats.total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="priority-value">{stats.porPrioridad.media}</span>
            </div>
            <div className="priority-item">
              <span className="priority-label">Alta</span>
              <div className="priority-bar">
                <div
                  className="priority-fill alta"
                  style={{
                    width: `${
                      stats.total > 0
                        ? (stats.porPrioridad.alta / stats.total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="priority-value">{stats.porPrioridad.alta}</span>
            </div>
            <div className="priority-item">
              <span className="priority-label">Urgente</span>
              <div className="priority-bar">
                <div
                  className="priority-fill urgente"
                  style={{
                    width: `${
                      stats.total > 0
                        ? (stats.porPrioridad.urgente / stats.total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="priority-value">
                {stats.porPrioridad.urgente}
              </span>
            </div>
          </div>
        </div>

        <div className="stats-section">
          <h2>Distribución por Estado</h2>
          <div className="state-chart">
            {Object.entries(stats.porEstado).map(([estado, count]) => (
              <div key={estado} className="state-item">
                <div className="state-header">
                  <span className="state-label">
                    {estado.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="state-count">{count}</span>
                </div>
                <div className="state-bar">
                  <div
                    className={`state-fill ${estado}`}
                    style={{
                      width: `${
                        stats.total > 0 ? (count / stats.total) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;









