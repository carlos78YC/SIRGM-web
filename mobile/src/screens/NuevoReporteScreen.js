import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { reporteService } from '../services/reporteService';
import { useNotifications } from '../context/NotificationContext';
import { Picker } from '@react-native-picker/picker';

const CATEGORIAS = [
  { label: 'Infraestructura', value: 'infraestructura' },
  { label: 'Limpieza', value: 'limpieza' },
  { label: 'Seguridad', value: 'seguridad' },
  { label: 'Electricidad', value: 'electricidad' },
  { label: 'Plomería', value: 'plomeria' },
  { label: 'Otro', value: 'otro' },
];

const PRIORIDADES = [
  { label: 'Baja', value: 'baja' },
  { label: 'Media', value: 'media' },
  { label: 'Alta', value: 'alta' },
  { label: 'Urgente', value: 'urgente' },
];

export default function NuevoReporteScreen({ navigation }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('infraestructura');
  const [prioridad, setPrioridad] = useState('media');
  const [ubicacion, setUbicacion] = useState('');
  const [foto, setFoto] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const { sendLocalNotification } = useNotifications();

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permisos necesarios',
        'Se necesitan permisos de cámara para tomar fotos'
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFoto(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al tomar la foto');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFoto(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al seleccionar la imagen');
    }
  };

  const getCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos necesarios',
          'Se necesitan permisos de ubicación para obtener tu ubicación'
        );
        setGettingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Obtener dirección aproximada (opcional)
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      let address = '';
      if (geocode.length > 0) {
        const addr = geocode[0];
        address = `${addr.street || ''} ${addr.name || ''}, ${addr.city || ''}`.trim();
      }

      setLocationData({ latitude, longitude });
      setUbicacion(address || `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
    } catch (error) {
      Alert.alert('Error', 'Error al obtener la ubicación');
    } finally {
      setGettingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!titulo.trim() || !descripcion.trim()) {
      Alert.alert('Error', 'Por favor completa título y descripción');
      return;
    }

    if (descripcion.length < 10) {
      Alert.alert('Error', 'La descripción debe tener al menos 10 caracteres');
      return;
    }

    setLoading(true);
    try {
      const reporteData = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        ubicacion: ubicacion.trim() || null,
        prioridad,
      };

      if (foto) {
        reporteData.foto = {
          uri: foto.uri,
          type: 'image/jpeg',
          name: `foto_${Date.now()}.jpg`,
        };
      }

      const response = await reporteService.create(reporteData);

      if (response.success) {
        // Enviar notificación local (no crítico si falla)
        try {
          await sendLocalNotification(
            'Reporte creado',
            `Tu reporte "${titulo}" ha sido creado exitosamente`,
            { reporteId: response.data.id }
          );
        } catch (notificationError) {
          // Ignorar errores de notificación, no son críticos
          console.log('No se pudo enviar notificación:', notificationError);
        }

        Alert.alert(
          'Éxito',
          'Reporte creado exitosamente',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Error al crear el reporte');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Error al crear el reporte. Verifica tu conexión.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Fuga de agua en el baño"
            value={titulo}
            onChangeText={setTitulo}
            maxLength={255}
          />

          <Text style={styles.label}>Categoría</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={categoria}
              onValueChange={setCategoria}
              style={styles.picker}
            >
              {CATEGORIAS.map((cat) => (
                <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Descripción *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe el problema en detalle..."
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Prioridad</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={prioridad}
              onValueChange={setPrioridad}
              style={styles.picker}
            >
              {PRIORIDADES.map((pri) => (
                <Picker.Item key={pri.value} label={pri.label} value={pri.value} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Ubicación</Text>
          <View style={styles.locationContainer}>
            <TextInput
              style={[styles.input, styles.locationInput]}
              placeholder="Ubicación manual o usa GPS"
              value={ubicacion}
              onChangeText={setUbicacion}
            />
            <TouchableOpacity
              style={styles.gpsButton}
              onPress={getCurrentLocation}
              disabled={gettingLocation}
            >
              {gettingLocation ? (
                <ActivityIndicator size="small" color="#2196F3" />
              ) : (
                <Text style={styles.gpsButtonText}>📍 GPS</Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Foto</Text>
          {foto && (
            <Image source={{ uri: foto.uri }} style={styles.previewImage} />
          )}
          <View style={styles.photoButtons}>
            <TouchableOpacity
              style={[styles.photoButton, styles.cameraButton]}
              onPress={takePhoto}
            >
              <Text style={styles.photoButtonText}>📷 Tomar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.photoButton, styles.galleryButton]}
              onPress={pickImage}
            >
              <Text style={styles.photoButtonText}>🖼️ Galería</Text>
            </TouchableOpacity>
          </View>
          {foto && (
            <TouchableOpacity
              style={styles.removePhotoButton}
              onPress={() => setFoto(null)}
            >
              <Text style={styles.removePhotoText}>Eliminar foto</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Crear Reporte</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 15,
  },
  pickerContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  locationContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  locationInput: {
    flex: 1,
    marginRight: 10,
  },
  gpsButton: {
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gpsButtonText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  photoButtons: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  photoButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cameraButton: {
    backgroundColor: '#2196F3',
  },
  galleryButton: {
    backgroundColor: '#4CAF50',
  },
  photoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  removePhotoButton: {
    alignItems: 'center',
    marginTop: 5,
  },
  removePhotoText: {
    color: '#f44336',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


