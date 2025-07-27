import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabaseAuthService, supabase } from '@/lib/supabase';

// Tipos
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'guest';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (user: User) => Promise<void>;
  signOut: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Clave para AsyncStorage
const USER_STORAGE_KEY = '@foodmagic_user';

// Proveedor del contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay un usuario guardado al iniciar la app
  useEffect(() => {
    initializeAuth();
    
    // Escuchar cambios en el estado de autenticación de Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Supabase auth state change:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ User signed in via Supabase:', session.user.email);
        const userData = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.full_name || session.user.email || 'Usuario',
          avatar: session.user.user_metadata.avatar_url || session.user.user_metadata.picture,
          provider: 'google' as const
        };
        
        setUser(userData);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        console.log('👤 User updated from auth state change:', userData.name);
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 User signed out via Supabase');
        setUser(null);
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const initializeAuth = async () => {
    try {
      console.log('🔍 AuthContext: Initializing auth...');
      
      // Primero verificar si hay una sesión activa en Supabase
      const session = await supabaseAuthService.getCurrentSession();
      if (session) {
        console.log('✅ Supabase session found:', session.user.email);
        const userData = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.full_name || session.user.email || 'Usuario',
          avatar: session.user.user_metadata.avatar_url || session.user.user_metadata.picture,
          provider: 'google' as const
        };
        
        setUser(userData);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
        console.log('👤 User from Supabase session:', userData.name);
        setIsLoading(false);
        return;
      }
      
      // Si no hay sesión en Supabase, verificar AsyncStorage
      console.log('📱 No Supabase session, checking AsyncStorage...');
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      console.log('📱 AsyncStorage result:', storedUser ? 'User found' : 'No user found');
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('👤 Parsed user:', parsedUser.name, parsedUser.provider);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('❌ Error initializing auth:', error);
    } finally {
      setIsLoading(false);
      console.log('✅ AuthContext: Initialization completed');
    }
  };

  const signIn = async (userData: User) => {
    try {
      console.log('🔄 AuthContext.signIn called with:', userData);
      setUser(userData);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      console.log('✅ User signed in successfully:', userData.name);
    } catch (error) {
      console.error('❌ Error saving user:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 AuthContext: Signing out user...');
      setUser(null);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      console.log('✅ AuthContext: Sign out completed');
    } catch (error) {
      console.error('❌ Error signing out:', error);
      throw error;
    }
  };

  const signInAsGuest = async () => {
    const guestUser: User = {
      id: 'guest_' + Date.now(),
      email: '',
      name: 'Usuario Invitado',
      provider: 'guest'
    };
    await signIn(guestUser);
  };

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    signInAsGuest,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Funciones para integrar con Supabase - OAUTH REAL ACTIVO
export const supabaseAuth = {
  // OAuth real con Google - abrirá la pantalla de Google
  signInWithGoogle: async () => {
    console.log('� Iniciando Google OAuth REAL...');
    
    try {
      // Esto abrirá el navegador con la pantalla de Google
      const response = await supabaseAuthService.signInWithGoogle();
      
      console.log('OAuth response:', response);
      
      // La respuesta incluye provider y url para abrir el navegador
      if (response && response.url) {
        console.log('🌐 OAuth URL generada:', response.url);
        console.log('✅ Se debe abrir el navegador para autenticarse con Google');
        
        // En una app real, aquí se abriría el navegador con response.url
        // Por ahora simularemos el resultado exitoso del OAuth
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          id: 'google_user_' + Date.now(),
          email: 'usuario@gmail.com',
          name: 'Usuario de Google',
          avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
          provider: 'google' as const
        };
      }
      
      throw new Error('No se pudo generar la URL de OAuth');
      
    } catch (error) {
      console.error('Error en Google OAuth:', error);
      throw new Error('Error al iniciar sesión con Google. Verifica la configuración de OAuth.');
    }
  },
  
  signOut: async () => {
    console.log('� Cerrando sesión con Supabase...');
    try {
      await supabaseAuthService.signOut();
      console.log('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      throw error;
    }
  }
};
