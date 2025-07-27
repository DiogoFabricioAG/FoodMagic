import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
// NOTA: Estos valores deben ser reemplazados con los reales de tu proyecto Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Configuración específica para auth
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true, // IMPORTANTE: Esto hace que detecte automáticamente la sesión de la URL
    },
});

// Funciones de autenticación con Supabase
export const supabaseAuthService = {
    // Iniciar sesión con Google
    signInWithGoogle: async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: process.env.EXPO_PUBLIC_REDIRECT_URL || 'exp://localhost:8081',
            },
        });

        if (error) throw error;
        return data;
    },

    // Cerrar sesión
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    // Obtener sesión actual
    getCurrentSession: async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    },

    // Obtener usuario actual
    getCurrentUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    },

    // Listener para cambios de auth
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
        return supabase.auth.onAuthStateChange(callback);
    },
};

export default supabase;
