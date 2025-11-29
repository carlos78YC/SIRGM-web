import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { reporteService } from '../services/reporteService';

const ESTADOS = {
  pendiente: { label: 'Pendiente', color: '#FF9800' },
  en_proceso: { label: 'En Proceso', color: '#2196F3' },
  resuelto: { label: 'Resuelto', color: '#4CAF50' },
  cerrado: { label: 'Cerrado', color: '#9E9E9E' },
};

const PRIORIDADES = {
  baja: { label: 'Baja', color: '#4CAF50' },
  media: { label: 'Media', color: '#FF9800' },
  alta: { label: 'Alta', color: '#FF5722' },
  urgente: { label: 'Urgente', color: '#F44336' },
};

export default function DetalleReporteScreen({ route, navigation }) {
  const { reporteId } = route.params;
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReporte();
  }, [reporteId]);

  const loadReporte = async () => {
    try {
      const response = await reporteService.getById(reporteId);
      if (response.success) {
        setReporte(response.data);
      } else {
        Alert.alert('Error', 'Error al cargar el reporte');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Error al cargar el reporte');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!reporte) {
    return null;
  }

  const estado = ESTADOS[reporte.estado] || ESTADOS.pendiente;
  const prioridad = PRIORIDADES[reporte.prioridad] || PRIORIDADES.media;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.titulo}>{reporte.titulo}</Text>
          <View
            style={[
              styles.estadoBadge,
              { backgroundColor: estado.color },
            ]}
          >
            <Text style={styles.estadoText}>{estado.label}</Text>
          </View>
        </View>

        <View style={styles.metaContainer}>
          <View
            style={[
              styles.prioridadBadge,
              { backgroundColor: prioridad.color },
            ]}
          >
            <Text style={styles.prioridadText}>{prioridad.label}</Text>
          </View>
          <Text style={styles.fecha}>
            Creado: {formatDate(reporte.created_at)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.descripcion}>{reporte.descripcion}</Text>
        </View>

        {reporte.ubicacion && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ubicación</Text>
            <View style={styles.ubicacionContainer}>
              <Text style={styles.ubicacionIcon}>📍</Text>
              <Text style={styles.ubicacionText}>{reporte.ubicacion}</Text>
            </View>
          </View>
        )}

        {reporte.foto_url && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Foto</Text>
            <Image
              source={{ uri: reporte.foto_url }}
              style={styles.foto}
              resizeMode="cover"
            />
          </View>
        )}

        {reporte.observaciones && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observaciones</Text>
            <Text style={styles.observaciones}>{reporte.observaciones}</Text>
          </View>
        )}

        {reporte.usuario_nombre && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reportado por</Text>
            <Text style={styles.usuario}>
              {reporte.usuario_nombre} {reporte.usuario_apellido}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  titulo: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  estadoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  prioridadBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginRight: 10,
  },
  prioridadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fecha: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  ubicacionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ubicacionIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  ubicacionText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  foto: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  observaciones: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  usuario: {
    fontSize: 14,
    color: '#666',
  },
});




