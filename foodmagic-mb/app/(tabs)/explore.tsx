import { StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useState } from 'react';

export default function ExploreScreen() {
  const { user, signOut } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [logoutDialogMessage, setLogoutDialogMessage] = useState('');

  const handleProfilePress = () => {
    if (user?.provider === 'guest') {
      setLogoutDialogMessage('Estás usando la app como invitado. ¿Quieres cerrar sesión?');
    } else {
      setLogoutDialogMessage(`Hola, ${user?.name || 'Usuario'}! ¿Quieres cerrar sesión?`);
    }
    setShowLogoutDialog(true);
  };

  const handleSignOut = async () => {
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

  return (
    <ThemedView style={styles.container}>
      <ConfirmDialog
        visible={showLogoutDialog}
        title={user?.provider === 'guest' ? 'Modo Invitado' : `Hola, ${user?.name || 'Usuario'}!`}
        message={logoutDialogMessage}
        onConfirm={handleSignOut}
        onCancel={cancelLogout}
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
        confirmStyle="destructive"
      />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.header}>
          {/* Botón de perfil */}
          <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
            <Ionicons 
              name={user?.provider === 'guest' ? 'person-circle-outline' : 'person-circle'} 
              size={32} 
              color="#fff" 
            />
          </TouchableOpacity>
          
          <Ionicons name="compass" size={48} color="#FF6B35" />
          <ThemedText type="title" style={styles.title}>
            Explorar
          </ThemedText>
          {user && (
            <ThemedText style={styles.welcomeText}>
              {user.provider === 'guest' ? 'Modo Invitado' : `¡Hola, ${user.name}!`}
            </ThemedText>
          )}
          <ThemedText type="subtitle" style={styles.subtitle}>
            Descubre la riqueza de la gastronomía peruana
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.content}>
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              🇵🇪 Cocina por regiones
            </ThemedText>
            <ThemedView style={styles.placeholder}>
              <ThemedText style={styles.placeholderText}>
                Costa, Sierra, Selva - Explora cada región
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              🍽️ Tipos de platillos
            </ThemedText>
            <ThemedView style={styles.placeholder}>
              <ThemedText style={styles.placeholderText}>
                Entradas, platos principales, postres, bebidas
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              📚 Tips culinarios
            </ThemedText>
            <ThemedView style={styles.placeholder}>
              <ThemedText style={styles.placeholderText}>
                Técnicas, secretos y consejos de la cocina peruana
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              🌶️ Ingredientes peruanos
            </ThemedText>
            <ThemedView style={styles.placeholder}>
              <ThemedText style={styles.placeholderText}>
                Aprende sobre ajíes, tubérculos y productos nativos
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: '#fff',
    position: 'relative',
  },
  profileButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    borderRadius: 20,
    padding: 4,
  },
  title: {
    marginTop: 16,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  welcomeText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
    marginTop: 4,
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    lineHeight: 24,
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  placeholder: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#6c757d',
    textAlign: 'center',
    fontSize: 16,
  },
});
