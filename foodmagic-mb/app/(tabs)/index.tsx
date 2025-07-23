import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';

export default function IngredientsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.header}>
          <Ionicons name="basket" size={48} color="#fff" />
          <ThemedText type="title" style={styles.title}>
            ¿Qué tienes en casa?
          </ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Ingresa los ingredientes que tienes disponibles y descubre qué platillos peruanos puedes preparar
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.content}>
          <ThemedView style={styles.inputSection}>
            <ThemedText style={styles.sectionTitle}>
              Ingredientes disponibles:
            </ThemedText>
            {/* Aquí irá el componente de entrada de ingredientes */}
            <ThemedView style={styles.placeholder}>
              <ThemedText style={styles.placeholderText}>
                🥕 Agregar ingredientes próximamente...
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.suggestionsSection}>
            <ThemedText style={styles.sectionTitle}>
              Sugerencias rápidas:
            </ThemedText>
            <ThemedView style={styles.placeholder}>
              <ThemedText style={styles.placeholderText}>
                📖 Platillos recomendados aparecerán aquí
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
    backgroundColor: '#D32F2F',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    marginTop: 16,
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: '#FFEBEE',
    fontSize: 16,
    lineHeight: 24,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 100, // Espacio para el tab bar
    gap: 24,
  },
  inputSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  suggestionsSection: {
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
    padding: 24,
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
