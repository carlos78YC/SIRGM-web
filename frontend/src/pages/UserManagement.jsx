import { useState, useEffect } from 'react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { adminService } from '../services/api';
import UserForm from '../components/UserForm';
import './UserManagement.css';

const UserManagement = () => {
  const { isAdmin, checking } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin && !checking) {
      loadUsers();
    }
  }, [isAdmin, checking]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUsers();
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleSave = async (formData) => {
    try {
      setFormLoading(true);
      setError('');

      if (editingUser) {
        await adminService.updateUser(editingUser.id, formData);
      } else {
        await adminService.createUser(formData);
      }

      setShowForm(false);
      setEditingUser(null);
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar usuario');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setFormLoading(true);
      setError('');
      await adminService.deleteUser(id);
      setDeleteConfirm(null);
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar usuario');
    } finally {
      setFormLoading(false);
    }
  };

  if (checking) {
    return <div className="loading">Cargando...</div>;
  }

  if (!isAdmin) {
    return null; // useAdminAuth redirige automáticamente
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h1>Gestión de Usuarios</h1>
        <button onClick={handleCreate} className="create-button">
          + Crear Usuario
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading">Cargando usuarios...</div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    No hay usuarios registrados
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>{user.nombre}</td>
                    <td>{user.apellido}</td>
                    <td>
                      <span className={`role-badge role-${user.rol}`}>
                        {user.rol}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.activo ? 'active' : 'inactive'}`}>
                        {user.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString('es-ES')}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(user)}
                          className="edit-button"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(user)}
                          className="delete-button"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <UserForm
          user={editingUser}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
          loading={formLoading}
        />
      )}

      {deleteConfirm && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Confirmar Eliminación</h3>
            <p>
              ¿Estás seguro de que deseas eliminar al usuario{' '}
              <strong>{deleteConfirm.nombre} {deleteConfirm.apellido}</strong>?
            </p>
            <p className="warning-text">Esta acción no se puede deshacer.</p>
            <div className="delete-modal-actions">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="cancel-button"
                disabled={formLoading}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="confirm-delete-button"
                disabled={formLoading}
              >
                {formLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;




