import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reporteService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ReporteDetail.css';

const ReporteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    loadReporte();
  }, [id]);

  const loadReporte = async () => {
    try {
      setLoading(true);
      const response = await reporteService.getById(id);
      setReporte(response.data);
      setNuevoEstado(response.data.estado);
      setError('');
    } catch (err) {
      setError('Error al cargar el reporte');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEstado = async () => {
    if (!nuevoEstado) return;

    try {
      setUpdating(true);
      await reporteService.updateEstado(id, nuevoEstado, observaciones || null);
      await loadReporte();
      setShowEstadoModal(false);
      setObservaciones('');
    } catch (err) {
      setError('Error al actualizar el estado');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const canUpdateEstado = user && (user.rol === 'admin' || user.rol === 'mantenimiento');

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  if (loading) {
    return <div className="loading">Cargando reporte...</div>;
  }

  if (error && !reporte) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/reportes')} className="back-button">
          Volver a reportes
        </button>
      </div>
    );
  }

  if (!reporte) {
    return <div className="loading">Reporte no encontrado</div>;
  }

  return (
    <div className="reporte-detail-container">
      <div className="detail-header">
        <button onClick={() => navigate('/reportes')} className="back-button">
          ← Volver
        </button>
        <h1>Reporte #{reporte.id}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="detail-content">
        <div className="detail-main">
          <div className="detail-section">
            <h2>{reporte.titulo}</h2>
            <div className="badges-container">
              <span className={`badge ${getEstadoBadgeClass(reporte.estado)}`}>
                {reporte.estado.replace('_', ' ')}
              </span>
              <span className={`badge ${getPrioridadBadgeClass(reporte.prioridad)}`}>
                {reporte.prioridad}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Descripción</h3>
            <p>{reporte.descripcion}</p>
          </div>

          {reporte.ubicacion && (
            <div className="detail-section">
              <h3>Ubicación</h3>
              <p>{reporte.ubicacion}</p>
            </div>
          )}

          {reporte.observaciones && (
            <div className="detail-section">
              <h3>Observaciones</h3>
              <p>{reporte.observaciones}</p>
            </div>
          )}

          {reporte.foto_url && (
            <div className="detail-section">
              <h3>Imagen</h3>
              <div className="image-container">
                <img
                  src={reporte.foto_url}
                  alt="Reporte"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="image-error" style={{ display: 'none' }}>
                  Error al cargar la imagen
                </div>
              </div>
            </div>
          )}

          <div className="detail-section">
            <h3>Información</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Usuario:</span>
                <span className="info-value">
                  {reporte.usuario_nombre} {reporte.usuario_apellido}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{reporte.usuario_email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Creado:</span>
                <span className="info-value">{formatDate(reporte.created_at)}</span>
              </div>
              {reporte.updated_at && (
                <div className="info-item">
                  <span className="info-label">Actualizado:</span>
                  <span className="info-value">{formatDate(reporte.updated_at)}</span>
                </div>
              )}
              {reporte.cerrado_at && (
                <div className="info-item">
                  <span className="info-label">Cerrado:</span>
                  <span className="info-value">{formatDate(reporte.cerrado_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {canUpdateEstado && (
          <div className="detail-actions">
            <button
              onClick={() => setShowEstadoModal(true)}
              className="action-button primary"
            >
              Cambiar Estado
            </button>
          </div>
        )}
      </div>

      {showEstadoModal && (
        <div className="modal-overlay" onClick={() => setShowEstadoModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Cambiar Estado</h2>
            <div className="modal-form">
              <div className="form-group">
                <label>Nuevo Estado:</label>
                <select
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="resuelto">Resuelto</option>
                  <option value="cerrado">Cerrado</option>
                </select>
              </div>
              <div className="form-group">
                <label>Observaciones (opcional):</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows="4"
                  placeholder="Agregar observaciones sobre el cambio de estado..."
                  spellCheck="false"
                  style={{ fontFamily: 'inherit' }}
                />
              </div>
              <div className="modal-actions">
                <button
                  onClick={() => setShowEstadoModal(false)}
                  className="button secondary"
                  disabled={updating}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateEstado}
                  className="button primary"
                  disabled={updating || !nuevoEstado}
                >
                  {updating ? 'Actualizando...' : 'Actualizar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReporteDetail;





