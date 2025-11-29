import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
  },
  // Asegurar que axios maneje UTF-8 correctamente
  transformRequest: [(data, headers) => {
    if (headers['Content-Type']?.includes('application/json')) {
      return JSON.stringify(data);
    }
    return data;
  }],
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

// Servicios de reportes
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
    Object.keys(reporteData).forEach(key => {
      if (key === 'foto' && reporteData[key] instanceof File) {
        formData.append(key, reporteData[key]);
      } else if (reporteData[key] !== null && reporteData[key] !== undefined) {
        formData.append(key, reporteData[key]);
      }
    });
    
    const response = await api.post('/reportes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  update: async (id, reporteData) => {
    const formData = new FormData();
    Object.keys(reporteData).forEach(key => {
      if (key === 'foto' && reporteData[key] instanceof File) {
        formData.append(key, reporteData[key]);
      } else if (reporteData[key] !== null && reporteData[key] !== undefined) {
        formData.append(key, reporteData[key]);
      }
    });
    
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

// Servicios de estadísticas
export const statsService = {
  getStats: async () => {
    // Obtener todos los reportes para calcular estadísticas
    const response = await reporteService.getAll();
    const reportes = response.data;
    
    // Calcular estadísticas
    const stats = {
      total: reportes.length,
      porEstado: {
        pendiente: 0,
        en_proceso: 0,
        resuelto: 0,
        cerrado: 0,
      },
      porPrioridad: {
        baja: 0,
        media: 0,
        alta: 0,
        urgente: 0,
      },
      tiemposPromedio: {
        pendiente: 0,
        en_proceso: 0,
        resuelto: 0,
        cerrado: 0,
      },
    };
    
    // Contar por estado y prioridad
    reportes.forEach(reporte => {
      if (stats.porEstado[reporte.estado] !== undefined) {
        stats.porEstado[reporte.estado]++;
      }
      if (stats.porPrioridad[reporte.prioridad] !== undefined) {
        stats.porPrioridad[reporte.prioridad]++;
      }
      
      // Calcular tiempos promedio
      if (reporte.created_at) {
        const created = new Date(reporte.created_at);
        const now = new Date();
        const diffDays = (now - created) / (1000 * 60 * 60 * 24);
        
        if (stats.tiemposPromedio[reporte.estado] !== undefined) {
          const current = stats.tiemposPromedio[reporte.estado];
          const count = stats.porEstado[reporte.estado];
          stats.tiemposPromedio[reporte.estado] = 
            current === 0 ? diffDays : (current * (count - 1) + diffDays) / count;
        }
      }
    });
    
    return stats;
  },
};

// Servicios de administración
export const adminService = {
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  exportUsers: async () => {
    const response = await api.get('/admin/export/users', {
      responseType: 'blob',
    });
    
    // Crear URL del blob para descargar
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Crear enlace y descargar
    const link = document.createElement('a');
    link.href = url;
    link.download = 'usuarios.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return { success: true };
  },

  exportReportes: async () => {
    const response = await api.get('/admin/export/reportes', {
      responseType: 'blob',
    });
    
    // Crear URL del blob para descargar
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Crear enlace y descargar
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reportes.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return { success: true };
  },
};

export default api;





