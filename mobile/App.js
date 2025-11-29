import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { NotificationProvider } from './src/context/NotificationContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import NuevoReporteScreen from './src/screens/NuevoReporteScreen';
import MisReportesScreen from './src/screens/MisReportesScreen';
import DetalleReporteScreen from './src/screens/DetalleReporteScreen';
import * as Notifications from 'expo-notifications';

const Stack = createNativeStackNavigator();

// Configurar cómo se manejan las notificaciones cuando la app está en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // O un componente de carga
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!user ? (
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'SIRGM' }}
            />
            <Stack.Screen 
              name="NuevoReporte" 
              component={NuevoReporteScreen}
              options={{ title: 'Nuevo Reporte' }}
            />
            <Stack.Screen 
              name="MisReportes" 
              component={MisReportesScreen}
              options={{ title: 'Mis Reportes' }}
            />
            <Stack.Screen 
              name="DetalleReporte" 
              component={DetalleReporteScreen}
              options={{ title: 'Detalle del Reporte' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </NotificationProvider>
    </AuthProvider>
  );
}

