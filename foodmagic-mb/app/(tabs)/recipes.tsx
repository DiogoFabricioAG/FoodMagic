import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

export default function RecipesScreen() {
  const params = useLocalSearchParams();
  const recipes = params.recipes ? JSON.parse(params.recipes as string) : [];
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.header}>
          <Ionicons name="book" size={48} color="#FF6B35" />
          <ThemedText type="title" style={styles.title}>
            Recetas Peruanas
          </ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Recetas detalladas paso a paso de la gastronomía peruana
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.content}>
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              📚 Recetas guardadas
            </ThemedText>
            <ThemedView style={styles.placeholder}>
              <ThemedText style={styles.placeholderText}>
                Tus recetas favoritas aparecerán aquí
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              🔥 Recetas populares
            </ThemedText>
            <ThemedView style={styles.placeholder}>
              <ThemedText style={styles.placeholderText}>
                Lomo saltado, Ají de gallina, Ceviche...
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              📖 Recientes
            </ThemedText>
            <ThemedView style={styles.placeholder}>
              <ThemedText style={styles.placeholderText}>
                Últimas recetas que has visto
              </ThemedText>
            </ThemedView>
          </ThemedView>
          {recipes.length > 0 && (
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>
                🧑‍🍳 Recetas sugeridas por IA
              </ThemedText>
              {recipes.map((receta: any, idx: number) => (
                <ThemedView key={idx} style={{ marginBottom: 24 }}>
                  <ThemedText style={{ fontWeight: 'bold', fontSize: 17 }}>
                    {receta.nombre}
                  </ThemedText>
                  <ThemedText style={{ marginBottom: 8 }}>
                    {receta.descripcion}
                  </ThemedText>
                  <ThemedText style={{ fontWeight: 'bold' }}>Ingredientes:</ThemedText>
                  <ThemedText>{receta.ingredientes.join(', ')}</ThemedText>
                  <ThemedText style={{ fontWeight: 'bold', marginTop: 8 }}>Pasos:</ThemedText>
                  {receta.pasos.map((paso: string, i: number) => (
                    <ThemedText key={i}>• {paso}</ThemedText>
                  ))}
                </ThemedView>
              ))}
            </ThemedView>
          )}
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
    paddingBottom: 100, // Espacio para el tab bar
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
