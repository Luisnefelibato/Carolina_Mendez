// Configuración de variables de entorno para Vercel
// Este archivo se ejecuta en el cliente y lee las variables de entorno
// Las variables deben estar configuradas en Vercel Dashboard

(function() {
    'use strict';
    
    // Configuración de las API keys
    // En Vercel, estas se obtienen de las variables de entorno
    // En desarrollo local, se pueden hardcodear temporalmente
    
    const config = {
        // Obtener de variables de entorno de Vercel o usar valores por defecto
        // 🚨 URGENTE: La API key anterior fue bloqueada por Google
        // Obtén una nueva en: https://aistudio.google.com/app/apikey
        // Lee API_KEY_FIX_URGENTE.md para instrucciones completas
        GEMINI_API_KEY: typeof process !== 'undefined' && process.env && process.env.VITE_GEMINI_API_KEY 
            ? process.env.VITE_GEMINI_API_KEY 
            : 'YOUR_NEW_GEMINI_API_KEY_HERE',  // ⚠️ REEMPLAZA CON TU NUEVA API KEY
            
        ELEVENLABS_API_KEY: typeof process !== 'undefined' && process.env && process.env.VITE_ELEVENLABS_API_KEY
            ? process.env.VITE_ELEVENLABS_API_KEY
            : '2ee18909c2d84d715bbb7e856c7658c3b124a266fc5186a3f486ab9c9dc51304',
            
        ELEVENLABS_VOICE_ID: typeof process !== 'undefined' && process.env && process.env.VITE_ELEVENLABS_VOICE_ID
            ? process.env.VITE_ELEVENLABS_VOICE_ID
            : 'UNIruiz09F4kWYjRpOvy'
    };
    
    // Configurar window.__ENV__ para el script config.js
    window.__ENV__ = {
        VITE_GEMINI_API_KEY: config.GEMINI_API_KEY,
        VITE_ELEVENLABS_API_KEY: config.ELEVENLABS_API_KEY,
        VITE_ELEVENLABS_VOICE_ID: config.ELEVENLABS_VOICE_ID
    };
    
    console.log('✅ API Keys configuradas desde env-config.js');
    console.log('🔑 Gemini API Key:', config.GEMINI_API_KEY ? config.GEMINI_API_KEY.substring(0, 20) + '...' : 'No configurada');
    console.log('🔑 ElevenLabs API Key:', config.ELEVENLABS_API_KEY ? config.ELEVENLABS_API_KEY.substring(0, 20) + '...' : 'No configurada');
    console.log('🔑 Voice ID:', config.ELEVENLABS_VOICE_ID);
})();
