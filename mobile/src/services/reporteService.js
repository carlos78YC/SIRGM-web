import api from '../config/api';

export const reporteService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.estado) params.append('estado', filters.estado);
    if (filters.prioridad) params.append('prioridad', filters.prioridad);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);

    const response = await api.get(`/reportes?${params.toString()}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/reportes/${id}`);
    return response.data;
  },

  create: async (reporteData) => {
    const formData = new FormData();

    // Agregar campos de texto
    formData.append('titulo', reporteData.titulo);
    formData.append('descripcion', reporteData.descripcion);
    if (reporteData.ubicacion) {
      formData.append('ubicacion', reporteData.ubicacion);
    }
    if (reporteData.prioridad) {
      formData.append('prioridad', reporteData.prioridad);
    }

    // Agregar foto si existe
    if (reporteData.foto) {
      formData.append('foto', {
        uri: reporteData.foto.uri,
        type: reporteData.foto.type || 'image/jpeg',
        name: reporteData.foto.name || 'foto.jpg',
      });
    }

    const response = await api.post('/reportes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id, reporteData) => {
    const formData = new FormData();

    if (reporteData.titulo) formData.append('titulo', reporteData.titulo);
    if (reporteData.descripcion) formData.append('descripcion', reporteData.descripcion);
    if (reporteData.ubicacion) formData.append('ubicacion', reporteData.ubicacion);
    if (reporteData.prioridad) formData.append('prioridad', reporteData.prioridad);

    if (reporteData.foto) {
      formData.append('foto', {
        uri: reporteData.foto.uri,
        type: reporteData.foto.type || 'image/jpeg',
        name: reporteData.foto.name || 'foto.jpg',
      });
    }

    const response = await api.put(`/reportes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateEstado: async (id, estado, observaciones = null) => {
    const response = await api.put(`/reportes/${id}/estado`, {
      estado,
      observaciones,
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/reportes/${id}`);
    return response.data;
  },
};




