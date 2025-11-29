import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { reporteService } from '../services/reporteService';
import { useNotifications } from '../context/NotificationContext';

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

export default function MisReportesScreen({ navigation }) {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('todos');
  const { sendLocalNotification } = useNotifications();

  useEffect(() => {
    loadReportes();
    
    // Configurar listener para cuando se regrese a esta pantalla
    const unsubscribe = navigation.addListener('focus', () => {
      loadReportes();
    });

    return unsubscribe;
  }, [navigation, filter]);

  const loadReportes = async () => {
    try {
      const filters = {};
      if (filter !== 'todos') {
        filters.estado = filter;
      }

      const response = await reporteService.getAll(filters);
      
      if (response.success) {
        setReportes(response.data || []);
      }
    } catch (error) {
      console.error('Error cargando reportes:', error);
      Alert.alert('Error', 'Error al cargar los reportes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReportes();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderReporte = ({ item }) => {
    const estado = ESTADOS[item.estado] || ESTADOS.pendiente;
    const prioridad = PRIORIDADES[item.prioridad] || PRIORIDADES.media;

    return (
      <TouchableOpacity
        style={styles.reporteCard}
        onPress={() => navigation.navigate('DetalleReporte', { reporteId: item.id })}
      >
        <View style={styles.reporteHeader}>
          <Text style={styles.reporteTitulo} numberOfLines={2}>
            {item.titulo}
          </Text>
          <View
            style={[
              styles.estadoBadge,
              { backgroundColor: estado.color },
            ]}
          >
            <Text style={styles.estadoText}>{estado.label}</Text>
          </View>
        </View>

        <Text style={styles.reporteDescripcion} numberOfLines={2}>
          {item.descripcion}
        </Text>

        {item.ubicacion && (
          <View style={styles.ubicacionContainer}>
            <Text style={styles.ubicacionIcon}>📍</Text>
            <Text style={styles.ubicacionText} numberOfLines={1}>
              {item.ubicacion}
            </Text>
          </View>
        )}

        <View style={styles.reporteFooter}>
          <View style={styles.metaContainer}>
            <View
              style={[
                styles.prioridadBadge,
                { backgroundColor: prioridad.color },
              ]}
            >
              <Text style={styles.prioridadText}>{prioridad.label}</Text>
            </View>
            <Text style={styles.fechaText}>{formatDate(item.created_at)}</Text>
          </View>
          {item.foto_url && (
            <Image
              source={{ uri: item.foto_url }}
              style={styles.thumbnail}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilters = () => {
    const filters = [
      { key: 'todos', label: 'Todos' },
      { key: 'pendiente', label: 'Pendiente' },
      { key: 'en_proceso', label: 'En Proceso' },
      { key: 'resuelto', label: 'Resuelto' },
      { key: 'cerrado', label: 'Cerrado' },
    ];

    return (
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={filters}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === item.key && styles.filterButtonActive,
              ]}
              onPress={() => setFilter(item.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === item.key && styles.filterTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  if (loading && reportes.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderFilters()}
      <FlatList
        data={reportes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReporte}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay reportes</Text>
            <Text style={styles.emptySubtext}>
              Crea tu primer reporte desde la pantalla principal
            </Text>
          </View>
        }
      />
    </View>
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
  filtersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  filterButtonActive: {
    backgroundColor: '#2196F3',
  },
  filterText: {
    color: '#666',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 15,
  },
  reporteCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reporteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  reporteTitulo: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  estadoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  reporteDescripcion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  ubicacionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ubicacionIcon: {
    marginRight: 5,
  },
  ubicacionText: {
    flex: 1,
    fontSize: 12,
    color: '#999',
  },
  reporteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  prioridadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 10,
  },
  prioridadText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  fechaText: {
    fontSize: 12,
    color: '#999',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});




