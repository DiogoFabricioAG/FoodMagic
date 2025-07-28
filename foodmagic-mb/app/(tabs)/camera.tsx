import { StyleSheet, View, Alert, TouchableOpacity, TextInput, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { processImageApi, suggestRecipesApi } from '../../utils/foodmagicApi';
import { Platform } from 'react-native';
import Webcam from "react-webcam";


export default function CameraScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualIngredients, setManualIngredients] = useState('');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { user, signOut } = useAuth();
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [suggestedRecipes, setSuggestedRecipes] = useState<any[]>([]);
  const [showWebcam, setShowWebcam] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showIngredientsModal, setShowIngredientsModal] = useState(false);
  const [editableIngredients, setEditableIngredients] = useState<string>('');

  const handleShowRecipes = async (ingredients: string[]) => {
    try {
      const recipes = await suggestRecipesApi(ingredients);
      if (!recipes || (Array.isArray(recipes) && recipes.length === 0)) {
        Alert.alert('Sin resultados', 'La IA no devolvió ninguna receta.');
        return;
      }
      setSuggestedRecipes(recipes);
      setShowSuccessModal(true); // Mostrar modal bonito
      // Navega cuando el usuario presione "Aceptar" en el modal
    } catch (error) {
      Alert.alert('Error', 'No se pudieron obtener las recetas.');
    }
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    try {
      await signOut();
      router.replace('/auth/login');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar la sesión');
    } finally {
      setShowLogoutDialog(false);
    }
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const handleManualList = () => {
    setShowManualInput(true);
  };

  const processManualIngredients = () => {
    if (manualIngredients.trim()) {
      const ingredientsList = manualIngredients.split(',').map(item => item.trim()).filter(item => item);
      setDetectedIngredients(ingredientsList);
      setShowManualInput(false); // ⬅️ Cierra el modal ANTES de llamar a la IA
      setManualIngredients('');
      handleShowRecipes(ingredientsList);
      setTimeout(async () => {
        try {
          const recipes = await suggestRecipesApi(ingredientsList);
          if (!recipes || (Array.isArray(recipes) && recipes.length === 0)) {
            Alert.alert('Sin resultados', 'La IA no devolvió ninguna receta.');
            return;
          }
          router.push({ pathname: '/(tabs)/recipes', params: { recipes: JSON.stringify(recipes) } });
        } catch (error) {
          Alert.alert('Error', 'No se pudieron obtener las recetas.');
          console.error(error);
        }
      }, 300); // Espera 300ms para evitar que el modal bloquee la navegación
    } else {
      Alert.alert('Error', 'Por favor ingresa al menos un ingrediente');
    }
  };

  const handleTakePhoto = () => {
    if (Platform.OS === 'web') {
      // Para web, abre el input file
      document.getElementById('web-image-input')?.click();
    } else {
      Alert.alert(
        "Detectar Ingredientes",
        "¿Qué quieres hacer?",
        [
          { text: "Tomar Foto", onPress: () => takePhoto() },
          { text: "Elegir de Galería", onPress: () => pickFromGallery() },
          { text: "Cancelar", style: "cancel" }
        ]
      );
    }
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

  const analyzeImage = async (imageUri: string) => {
    setIsScanning(true);
    try {
      const ingredientesStr = await processImageApi(imageUri);
      const ingredientes = ingredientesStr.split(',').map(i => i.trim()).filter(i => i);
      setDetectedIngredients(ingredientes);
      setIsScanning(false);
      setEditableIngredients(ingredientes.join(', '));
      setShowIngredientsModal(true);
      if (!ingredientes || ingredientes.length === 0) {
        Alert.alert('Sin resultados', 'No se detectaron ingredientes.');
        return;
      }
      Alert.alert(
        "🎉 ¡Ingredientes detectados!",
        `He encontrado: ${ingredientes.join(', ')}. ¿Quieres ver las recetas sugeridas?`,
        [
          { text: "Ver Recetas", onPress: async () => {
              try {
                const recipes = await suggestRecipesApi(ingredientes);
                if (!recipes || (Array.isArray(recipes) && recipes.length === 0)) {
                  Alert.alert('Sin resultados', 'La IA no devolvió ninguna receta.');
                  return;
                }
                router.push({ pathname: '/(tabs)/recipes', params: { recipes: JSON.stringify(recipes) } });
              } catch (error) {
                Alert.alert('Error', 'No se pudieron obtener las recetas.');
                console.error(error);
              }
            }
          },
          { text: "Tomar otra foto", onPress: () => setSelectedImage(null) },
          { text: "Cerrar", style: "cancel" }
        ]
      );
    } catch (error) {
      setIsScanning(false);
      Alert.alert('Error', 'No se pudo analizar la imagen.');
      console.error(error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {Platform.OS === 'web' && (
        <input
          id="web-image-input"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                setSelectedImage(reader.result as string);
                analyzeImage(reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      )}

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(211,47,47,0.15)' }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 24,
            padding: 32,
            alignItems: 'center',
            shadowColor: '#D32F2F',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 12,
            minWidth: 280,
          }}>
            <Ionicons name="checkmark-circle" size={56} color="#D32F2F" />
            <ThemedText style={{ fontSize: 22, fontWeight: 'bold', color: '#D32F2F', marginTop: 12 }}>
              ¡Recetas registradas!
            </ThemedText>
            <ThemedText style={{ color: '#757575', marginTop: 8, marginBottom: 18, textAlign: 'center' }}>
              Tus recetas sugeridas están listas 🎉
            </ThemedText>
            <TouchableOpacity
              style={{
                backgroundColor: '#D32F2F',
                borderRadius: 12,
                paddingVertical: 12,
                paddingHorizontal: 32,
                marginTop: 8,
              }}
              onPress={() => {
                        setShowSuccessModal(false);
                        router.push({ pathname: '/(tabs)/recipes', params: { recipes: JSON.stringify(suggestedRecipes) } });
                      }}
            >
              <ThemedText style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Aceptar</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showIngredientsModal} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(211,47,47,0.15)' }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 24,
            padding: 32,
            alignItems: 'center',
            shadowColor: '#D32F2F',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 12,
            minWidth: 280,
          }}>
            <Ionicons name="nutrition" size={48} color="#D32F2F" />
            <ThemedText style={{ fontSize: 20, fontWeight: 'bold', color: '#D32F2F', marginTop: 8 }}>
              Ingredientes detectados
            </ThemedText>
            <ThemedText style={{ color: '#757575', marginTop: 8, marginBottom: 12, textAlign: 'center' }}>
              Edita o agrega ingredientes separados por comas:
            </ThemedText>
            <TextInput
              style={{
                borderWidth: 2,
                borderColor: '#FFCDD2',
                borderRadius: 12,
                padding: 12,
                fontSize: 16,
                color: '#424242',
                backgroundColor: '#FAFAFA',
                minWidth: 220,
                marginBottom: 16,
              }}
              value={editableIngredients}
              onChangeText={setEditableIngredients}
              placeholder="Ej: tomate, cebolla, pollo"
              multiline
            />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#D32F2F',
                  borderRadius: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                }}
                onPress={async () => {
                  setShowIngredientsModal(false);
                  const ingredientsList = editableIngredients.split(',').map(i => i.trim()).filter(i => i);
                  await handleShowRecipes(ingredientsList);
                }}
              >
                <ThemedText style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Confirmar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: '#FFCDD2',
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                }}
                onPress={async () => {
                          setShowIngredientsModal(false);
                          const ingredientsList = editableIngredients.split(',').map(i => i.trim()).filter(i => i);
                          await handleShowRecipes(ingredientsList);
                        }}
              >
                <ThemedText style={{ color: '#D32F2F', fontWeight: 'bold', fontSize: 16 }}>Cancelar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <ConfirmDialog
        visible={showLogoutDialog}
        title="Cerrar Sesión"
        message={user?.name ? `¿Quieres cerrar sesión? (${user.name})` : '¿Quieres cerrar sesión?'}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
        confirmStyle="destructive"
      />
      
      {/* Header con gradiente peruano */}
      <ThemedView style={styles.header}>
        <View style={styles.headerGradient}>
          {/* Botón de logout en la esquina superior derecha */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
          </TouchableOpacity>
          
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
          
          {/* Mostrar info del usuario */}
          {user && (
            <View style={styles.userInfo}>
              <Ionicons 
                name={user.provider === 'guest' ? 'person-circle-outline' : 'person-circle'} 
                size={16} 
                color="#FFEBEE" 
              />
              <ThemedText style={styles.userText}>
                {user.provider === 'guest' ? 'Invitado' : user.name}
              </ThemedText>
            </View>
          )}
          
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
    position: 'relative',
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 8,
    zIndex: 20,
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  userText: {
    color: '#FFEBEE',
    fontSize: 12,
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
