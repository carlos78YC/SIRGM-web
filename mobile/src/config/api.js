import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cambia esta URL por la URL de tu backend
// Para emulador Android/iOS: 'http://localhost:3000' o 'http://10.0.2.2:3000' (Android emulator)
// Para dispositivo físico en la misma red WiFi: 'http://192.168.1.34:3000'
// Para producción: 'https://tu-dominio.com'

const API_BASE_URL = 'http://192.168.1.34:3000'; // IP local para dispositivo físico
// Si usas emulador, cambia a: 'http://localhost:3000'
// Si usas Android emulator, usa: 'http://10.0.2.2:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
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
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      // El contexto de autenticación manejará el logout
    }
    return Promise.reject(error);
  }
);

export default api;

