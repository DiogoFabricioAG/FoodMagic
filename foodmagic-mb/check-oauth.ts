// Script para verificar la configuración de OAuth
// Ejecutar: npx ts-node check-oauth.ts

import { supabase } from './lib/supabase';

async function checkOAuthConfig() {
    console.log('🔍 Verificando configuración de OAuth...\n');

    // Verificar variables de entorno
    console.log('✅ Variables de entorno:');
    console.log(`SUPABASE_URL: ${process.env.EXPO_PUBLIC_SUPABASE_URL ? '✓ Configurada' : '❌ Falta'}`);
    console.log(`SUPABASE_ANON_KEY: ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? '✓ Configurada' : '❌ Falta'}`);
    console.log(`REDIRECT_URL: ${process.env.EXPO_PUBLIC_REDIRECT_URL || 'exp://localhost:8081'}\n`);

    // Intentar conectar con Supabase
    try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.log('❌ Error conectando con Supabase:', error.message);
        } else {
            console.log('✅ Conexión con Supabase exitosa');
        }
    } catch (err) {
        console.log('❌ Error de conexión:', (err as Error).message);
    }

    // Intentar generar URL de OAuth
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: process.env.EXPO_PUBLIC_REDIRECT_URL || 'exp://localhost:8081',
            },
        });

        if (error) {
            console.log('❌ Error generando OAuth URL:', error.message);
            console.log('💡 Posibles causas:');
            console.log('   - Google Provider no habilitado en Supabase');
            console.log('   - Client ID/Secret no configurados');
            console.log('   - URLs de redirección incorrectas');
        } else if (data.url) {
            console.log('✅ OAuth URL generada exitosamente');
            console.log('🌐 URL:', data.url);
            console.log('\n🎉 ¡OAuth configurado correctamente!');
            console.log('   Al hacer login se abrirá:', data.url);
        }
    } catch (err) {
        console.log('❌ Error generando OAuth:', (err as Error).message);
    }

    console.log('\n📋 Próximos pasos si hay errores:');
    console.log('1. Ve a Google Cloud Console');
    console.log('2. Crea OAuth 2.0 Client ID');
    console.log('3. Copia Client ID y Secret a Supabase Dashboard');
    console.log('4. Verifica URLs de redirección');
}

checkOAuthConfig();
