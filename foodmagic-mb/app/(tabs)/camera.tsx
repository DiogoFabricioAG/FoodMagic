import { StyleSheet, View, Alert, TouchableOpacity, TextInput, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

export default function CameraScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualIngredients, setManualIngredients] = useState('');

  const handleManualList = () => {
    setShowManualInput(true);
  };

  const processManualIngredients = () => {
    if (manualIngredients.trim()) {
      const ingredientsList = manualIngredients.split(',').map(item => item.trim()).filter(item => item);
      Alert.alert(
        "🎉 ¡Ingredientes registrados!",
        `He registrado: ${ingredientsList.join(', ')}. ¿Quieres ver las recetas sugeridas?`,
        [
          { text: "Ver Recetas", onPress: () => console.log("Navegando a recetas...") },
          { text: "Editar lista", onPress: () => setShowManualInput(true) },
          { text: "Cerrar", style: "cancel" }
        ]
      );
      setShowManualInput(false);
      setManualIngredients('');
    } else {
      Alert.alert('Error', 'Por favor ingresa al menos un ingrediente');
    }
  };

  const handleTakePhoto = () => {
    Alert.alert(
      "Detectar Ingredientes",
      "¿Qué quieres hacer?",
      [
        { text: "Tomar Foto", onPress: () => takePhoto() },
        { text: "Elegir de Galería", onPress: () => pickFromGallery() },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const takePhoto = async () => {
    try {
      // Solicitar permisos de cámara
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesitan permisos de cámara para tomar fotos');
        return;
      }

      setIsScanning(true);
      
      // Abrir cámara
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      setIsScanning(false);

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        Alert.alert("¡Genial!", "Foto tomada. Analizando ingredientes...");
        // Aquí puedes agregar la lógica para procesar la imagen
        analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      setIsScanning(false);
      Alert.alert('Error', 'No se pudo tomar la foto. Inténtalo de nuevo.');
    }
  };

  const pickFromGallery = async () => {
    try {
      // Solicitar permisos de galería
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesitan permisos de galería para seleccionar fotos');
        return;
      }

      setIsScanning(true);
      
      // Abrir galería
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      setIsScanning(false);

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        Alert.alert("¡Perfecto!", "Imagen seleccionada. Analizando ingredientes...");
        // Aquí puedes agregar la lógica para procesar la imagen
        analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      setIsScanning(false);
      Alert.alert('Error', 'No se pudo seleccionar la imagen. Inténtalo de nuevo.');
    }
  };

  const analyzeImage = (imageUri: string) => {
    // Aquí irá la lógica de análisis de imagen con IA
    // Por ahora solo mostramos un mensaje simulado
    setTimeout(() => {
      Alert.alert(
        "🎉 ¡Ingredientes detectados!",
        "He encontrado: tomates, cebolla, ajo, pollo. ¿Quieres ver las recetas sugeridas?",
        [
          { text: "Ver Recetas", onPress: () => console.log("Navegando a recetas...") },
          { text: "Tomar otra foto", onPress: () => setSelectedImage(null) },
          { text: "Cerrar", style: "cancel" }
        ]
      );
    }, 2000);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header con gradiente peruano */}
      <ThemedView style={styles.header}>
        <View style={styles.headerGradient}>
          <View style={styles.logoContainer}>
            <Ionicons name="restaurant" size={32} color="#fff" />
            <ThemedText type="title" style={styles.title}>
              FoodMagic
            </ThemedText>
            <View style={styles.flagDecoration}>
              <View style={styles.flagRed} />
              <View style={styles.flagWhite} />
              <View style={styles.flagRed} />
            </View>
          </View>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Descubre la magia de la cocina peruana
          </ThemedText>
        </View>
      </ThemedView>

      <ThemedView style={styles.cameraSection}>
        <View style={styles.cameraContainer}>
          <TouchableOpacity style={styles.cameraPlaceholder} onPress={handleTakePhoto}>
            {selectedImage ? (
              <>
                <Image 
                  source={{ uri: selectedImage }} 
                  style={styles.selectedImage}
                  contentFit="cover"
                />
                <View style={styles.imageOverlay}>
                  <View style={styles.successBadge}>
                    <Ionicons name="checkmark-circle" size={32} color="#fff" />
                    <ThemedText style={styles.successText}>
                      ¡Imagen cargada!
                    </ThemedText>
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={styles.cameraIcon}>
                  <Ionicons 
                    name={isScanning ? "scan" : "camera-outline"} 
                    size={80} 
                    color="#D32F2F" 
                  />
                </View>
                <ThemedText style={styles.cameraText}>
                  {isScanning ? "Analizando ingredientes..." : "Toca para detectar ingredientes"}
                </ThemedText>
                <ThemedText style={styles.cameraSubtext}>
                  📸 Cámara • 🖼️ Galería
                </ThemedText>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ThemedView>

      <ThemedView style={styles.buttonSection}>
        <TouchableOpacity 
          style={[styles.mainButton, isScanning && styles.buttonDisabled]} 
          onPress={selectedImage ? () => analyzeImage(selectedImage) : handleTakePhoto}
          disabled={isScanning}
        >
          <View style={styles.buttonContent}>
            <Ionicons 
              name={selectedImage ? "analytics" : "camera"} 
              size={24} 
              color="#fff" 
            />
            <ThemedText style={styles.buttonText}>
              {selectedImage ? "Analizar Ingredientes" : "Detectar Ingredientes"}
            </ThemedText>
          </View>
        </TouchableOpacity>

        {selectedImage && (
          <TouchableOpacity 
            style={styles.retakeButton} 
            onPress={() => setSelectedImage(null)}
          >
            <Ionicons name="camera-reverse" size={20} color="#D32F2F" />
            <ThemedText style={styles.retakeButtonText}>
              Tomar otra foto
            </ThemedText>
          </TouchableOpacity>
        )}

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickButton} onPress={handleManualList}>
            <View style={styles.quickButtonContent}>
              <Ionicons name="list" size={20} color="#D32F2F" />
              <ThemedText style={styles.quickButtonText}>Lista manual</ThemedText>
            </View>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Footer con patrón peruano */}
      <ThemedView style={styles.footer}>
        <View style={styles.footerPattern}>
          <View style={styles.patternLine} />
        </View>
        <ThemedText style={styles.footerText}>
          💡 Consejo: Ilumina bien los ingredientes para mejores resultados
        </ThemedText>
        <ThemedText style={styles.footerSubtext}>
          Powered by IA • Cocina Peruana 🇵🇪
        </ThemedText>
      </ThemedView>

      {/* Modal para entrada manual de ingredientes */}
      <Modal
        visible={showManualInput}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowManualInput(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Lista Manual de Ingredientes</ThemedText>
              <TouchableOpacity 
                onPress={() => setShowManualInput(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#757575" />
              </TouchableOpacity>
            </View>
            
            <ThemedText style={styles.modalSubtitle}>
              Escribe tus ingredientes separados por comas.
              💡 Tip: Usa el micrófono del teclado para dictar por voz.
            </ThemedText>
            
            <TextInput
              style={styles.textInput}
              value={manualIngredients}
              onChangeText={setManualIngredients}
              placeholder="Ej: tomate, cebolla, ajo, pollo, arroz..."
              placeholderTextColor="#9E9E9E"
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setShowManualInput(false)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.processButton} 
                onPress={processManualIngredients}
              >
                <Ionicons name="checkmark" size={20} color="#fff" />
                <ThemedText style={styles.processButtonText}>Procesar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#D32F2F',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10, // Asegurar que esté por encima de otros elementos
  },
  headerGradient: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  flagDecoration: {
    flexDirection: 'row',
    height: 20,
    width: 30,
    borderRadius: 3,
    overflow: 'hidden',
    marginLeft: 8,
  },
  flagRed: {
    flex: 1,
    backgroundColor: '#D32F2F',
  },
  flagWhite: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subtitle: {
    color: '#FFEBEE',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  cameraSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cameraContainer: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  cameraPlaceholder: {
    width: 280,
    height: 280,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFCDD2',
    borderStyle: 'dashed',
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 21,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(211, 47, 47, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    gap: 8,
  },
  successText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraIcon: {
    backgroundColor: '#FFEBEE',
    padding: 20,
    borderRadius: 50,
    marginBottom: 16,
  },
  cameraText: {
    fontSize: 18,
    color: '#424242',
    textAlign: 'center',
    fontWeight: '600',
    marginHorizontal: 20,
  },
  cameraSubtext: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '400',
  },
  buttonSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 20,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 320,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 10,
  },
  buttonDisabled: {
    backgroundColor: '#BDBDBD',
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  retakeButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFCDD2',
    marginTop: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    maxWidth: 320,
  },
  retakeButtonText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 12,
    justifyContent: 'center',
    width: '100%',
    maxWidth: 320,
  },
  quickButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFCDD2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    flex: 1,
    maxWidth: 150,
  },
  quickButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 6,
  },
  quickButtonText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#FFEBEE',
  },
  footerPattern: {
    height: 3,
    backgroundColor: '#FFCDD2',
    marginBottom: 12,
    borderRadius: 2,
  },
  patternLine: {
    height: '100%',
    width: '30%',
    backgroundColor: '#D32F2F',
    borderRadius: 2,
  },
  footerText: {
    textAlign: 'center',
    color: '#616161',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  footerSubtext: {
    textAlign: 'center',
    color: '#9E9E9E',
    fontSize: 12,
    fontWeight: '400',
  },
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D32F2F',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#FFCDD2',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Rubik',
    color: '#424242',
    backgroundColor: '#FAFAFA',
    minHeight: 100,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#FFCDD2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: '600',
  },
  processButton: {
    flex: 1,
    backgroundColor: '#D32F2F',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  processButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
