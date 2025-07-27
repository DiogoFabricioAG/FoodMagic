import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    console.log('🔄 Index useEffect - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'user:', user?.name);
    
    if (!isLoading) {
      if (isAuthenticated) {
        // Usuario autenticado - ir a la app principal
        const initialRoute = Platform.OS === 'web' ? '/(tabs)' : '/(tabs)/camera';
        console.log('✅ User authenticated, navigating to:', initialRoute);
        router.replace(initialRoute);
      } else {
        // Usuario no autenticado - ir al login
        console.log('❌ User not authenticated, navigating to login');
        router.replace('/auth/login');
      }
    }
  }, [isAuthenticated, isLoading, user?.name]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#f5f5f5',
      }}
    >
      <ActivityIndicator size="large" color="#D32F2F" />
      <ThemedText style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
        Cargando FoodMagic...
      </ThemedText>
    </View>
  );
}
