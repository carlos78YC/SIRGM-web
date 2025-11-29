import React, { createContext, useState, useEffect, useContext } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    let notificationListener = null;
    let responseListener = null;

    const setupNotifications = async () => {
      try {
        // Registrar para push notifications
        const token = await registerForPushNotificationsAsync();
        if (token) {
          setExpoPushToken(token);
        }

        // Listener para notificaciones recibidas cuando la app está en primer plano
        notificationListener = Notifications.addNotificationReceivedListener(notification => {
          console.log('Notificación recibida:', notification);
        });

        // Listener para cuando el usuario toca una notificación
        responseListener = Notifications.addNotificationResponseReceivedListener(response => {
          console.log('Usuario tocó la notificación:', response);
        });
      } catch (error) {
        console.error('Error configurando notificaciones:', error);
      }
    };

    setupNotifications();

    return () => {
      if (notificationListener) {
        Notifications.removeNotificationSubscription(notificationListener);
      }
      if (responseListener) {
        Notifications.removeNotificationSubscription(responseListener);
      }
    };
  }, []);

  const sendLocalNotification = async (title, body, data = {}) => {
    try {
      // Verificar permisos antes de enviar
      const { status } = await Notifications.getPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Permisos de notificaciones no concedidos');
        return false;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: title || 'Notificación',
          body: body || '',
          data: data || {},
          sound: true,
        },
        trigger: null, // Enviar inmediatamente
      });
      
      return true;
    } catch (error) {
      console.error('Error al enviar notificación:', error);
      // No lanzar el error, solo registrarlo
      return false;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        sendLocalNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

async function registerForPushNotificationsAsync() {
  let token;

  try {
    // Configurar canal de notificaciones para Android
    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      } catch (error) {
        console.log('Error configurando canal de notificaciones Android:', error);
        // Continuar aunque falle
      }
    }

    // Verificar permisos existentes
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    // Solicitar permisos si no están concedidos
    if (existingStatus !== 'granted') {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      } catch (error) {
        console.error('Error solicitando permisos:', error);
        return null;
      }
    }
    
    // Si los permisos no fueron concedidos, retornar null
    if (finalStatus !== 'granted') {
      console.log('Permisos de notificaciones no concedidos');
      return null;
    }
    
    // Intentar obtener el token de push (puede fallar en Expo Go)
    try {
      const tokenData = await Notifications.getExpoPushTokenAsync();
      token = tokenData?.data || null;
    } catch (e) {
      // En Expo Go, esto puede fallar, pero no es crítico para notificaciones locales
      console.log('No se pudo obtener token de push (normal en Expo Go):', e.message);
      // Retornar null pero no es un error crítico
    }
  } catch (error) {
    console.error('Error en registerForPushNotificationsAsync:', error);
    return null;
  }

  return token;
}


