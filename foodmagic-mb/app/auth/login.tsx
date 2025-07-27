import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useAuth, supabaseAuth } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signInAsGuest, user, isAuthenticated } = useAuth();

  const debugStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@foodmagic_user');
      console.log('🔍 DEBUG - Stored user:', storedUser);
      console.log('🔍 DEBUG - Current user:', user);
      console.log('🔍 DEBUG - Is authenticated:', isAuthenticated);
      Alert.alert('Debug Info', 
        `Stored: ${storedUser ? 'YES' : 'NO'}\nCurrent: ${user?.name || 'NONE'}\nAuth: ${isAuthenticated}`
      );
    } catch (error) {
      console.error('Debug error:', error);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      console.log('🚀 Starting Google login...');
      
      // Usar el contexto de auth (temporal hasta configurar Supabase)
      const userData = await supabaseAuth.signInWithGoogle();
      console.log('📦 Got user data:', userData);
      
      await signIn(userData);
      console.log('✅ signIn completed, auth context should be updated');
      
      // No navegar aquí - dejar que index.tsx maneje la navegación
      
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar sesión. Intenta de nuevo.');
      console.error('❌ Error en login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestMode = () => {
    Alert.alert(
      'Modo Invitado',
      '¿Quieres continuar sin cuenta? Tendrás acceso limitado a las funciones.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Continuar',
          onPress: async () => {
            try {
              await signInAsGuest();
              // No navegar aquí - dejar que index.tsx maneje la navegación
            } catch (error) {
              Alert.alert('Error', 'No se pudo acceder como invitado.');
            }
          }
        }
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header con gradiente peruano */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Ionicons name="restaurant" size={48} color="#fff" />
          </View>
          <ThemedText type="title" style={styles.title}>
            FoodMagic
          </ThemedText>
          <View style={styles.flagDecoration}>
            <View style={styles.flagRed} />
            <View style={styles.flagWhite} />
            <View style={styles.flagRed} />
          </View>
        </View>
        <ThemedText style={styles.subtitle}>
          Descubre la magia de la cocina peruana
        </ThemedText>
        <View style={styles.pattern}>
          <View style={styles.patternLine} />
        </View>
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <ThemedText style={styles.welcomeTitle}>
            ¡Bienvenido a FoodMagic! 🇵🇪
          </ThemedText>
          <ThemedText style={styles.welcomeText}>
            Inicia sesión para guardar tus recetas favoritas, crear listas personalizadas y descubrir nuevos sabores peruanos.
          </ThemedText>
        </View>

        {/* Botón de Google */}
        <TouchableOpacity
          style={[styles.googleButton, isLoading && styles.buttonDisabled]}
          onPress={handleGoogleLogin}
          disabled={isLoading}
        >
          <View style={styles.googleButtonContent}>
            {isLoading ? (
              <>
                <Ionicons name="refresh" size={24} color="#fff" />
                <ThemedText style={styles.googleButtonText}>
                  Iniciando sesión...
                </ThemedText>
              </>
            ) : (
              <>
                <Ionicons name="logo-google" size={24} color="#fff" />
                <ThemedText style={styles.googleButtonText}>
                  Continuar con Google
                </ThemedText>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Botón modo invitado */}
        <TouchableOpacity
          style={styles.guestButton}
          onPress={handleGuestMode}
          disabled={isLoading}
        >
          <View style={styles.guestButtonContent}>
            <Ionicons name="person-outline" size={20} color="#D32F2F" />
            <ThemedText style={styles.guestButtonText}>
              Continuar como invitado
            </ThemedText>
          </View>
        </TouchableOpacity>

        {/* Info adicional */}
        <View style={styles.infoSection}>
          <ThemedText style={styles.infoText}>
            Al iniciar sesión aceptas nuestros términos de servicio y política de privacidad
          </ThemedText>
        </View>
      </View>

      {/* Footer decorativo */}
      <View style={styles.footer}>
        <View style={styles.footerPattern}>
          <View style={styles.footerPatternLine} />
        </View>
        <ThemedText style={styles.footerText}>
          Hecho con ❤️ para la gastronomía peruana
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: '#D32F2F',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  flagDecoration: {
    flexDirection: 'row',
    height: 24,
    width: 36,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 4,
  },
  flagRed: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flagWhite: {
    flex: 1,
    backgroundColor: '#D32F2F',
  },
  subtitle: {
    color: '#FFEBEE',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 32,
    fontWeight: '500',
  },
  pattern: {
    alignItems: 'center',
    marginTop: 20,
  },
  patternLine: {
    height: 4,
    width: 60,
    backgroundColor: '#FFCDD2',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    justifyContent: 'center',
  },
  welcomeSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E2E2E',
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginHorizontal: 8,
  },
  googleButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  guestButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFCDD2',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  guestButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  guestButtonText: {
    color: '#D32F2F',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  infoSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerPattern: {
    marginBottom: 12,
  },
  footerPatternLine: {
    height: 3,
    width: 40,
    backgroundColor: '#FFCDD2',
    borderRadius: 2,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
});
