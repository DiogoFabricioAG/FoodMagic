import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';

export default function ExploreScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.header}>
          <Ionicons name="compass" size={48} color="#FF6B35" />
          <ThemedText type="title" style={styles.title}>
            Explorar
          </ThemedText>
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
  },
  title: {
    marginTop: 16,
    textAlign: 'center',
    color: '#1a1a1a',
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
