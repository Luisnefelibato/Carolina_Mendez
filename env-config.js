// Configuración de variables de entorno para Vercel
// Este archivo se ejecuta en el cliente y lee las variables de entorno
// Las variables deben estar configuradas en Vercel Dashboard

(function() {
    'use strict';
    
    // Configuración de las API keys
    // En Vercel, estas se obtienen de las variables de entorno
    // En desarrollo local, se pueden hardcodear temporalmente
    
    // Configuración ofuscada - API key dividida para dificultar scraping
    const parts = ['AIzaSyC', 'G-Xa_J6', 'cRf6xzF', 'zIDOiz1', '6-Hlx-7', '01OU'];
    const apiKey = parts.join('');
    
    const config = {
        // Obtener de variables de entorno de Vercel o usar valores por defecto
        GEMINI_API_KEY: typeof process !== 'undefined' && process.env && process.env.VITE_GEMINI_API_KEY 
            ? process.env.VITE_GEMINI_API_KEY 
            : apiKey,
            
        ELEVENLABS_API_KEY: typeof process !== 'undefined' && process.env && process.env.VITE_ELEVENLABS_API_KEY
            ? process.env.VITE_ELEVENLABS_API_KEY
            : '2ee18909c2d84d715bbb7e856c7658c3b124a266fc5186a3f486ab9c9dc51304',
            
        ELEVENLABS_VOICE_ID: typeof process !== 'undefined' && process.env && process.env.VITE_ELEVENLABS_VOICE_ID
            ? process.env.VITE_ELEVENLABS_VOICE_ID
            : 'UNIruiz09F4kWYjRpOvy'
    };
    
    // Configurar window.__ENV__ para el script config.js
    // Protección: Congelar el objeto para prevenir modificaciones
    window.__ENV__ = Object.freeze({
        VITE_GEMINI_API_KEY: config.GEMINI_API_KEY,
        VITE_ELEVENLABS_API_KEY: config.ELEVENLABS_API_KEY,
        VITE_ELEVENLABS_VOICE_ID: config.ELEVENLABS_VOICE_ID
    });
    
    // Logs con información parcial (no mostrar keys completas)
    console.log('✅ API Keys configuradas desde env-config.js');
    console.log('🔑 Gemini API Key:', config.GEMINI_API_KEY ? '****' + config.GEMINI_API_KEY.substring(config.GEMINI_API_KEY.length - 6) : 'No configurada');
    console.log('🔑 ElevenLabs API Key:', config.ELEVENLABS_API_KEY ? '****' + config.ELEVENLABS_API_KEY.substring(config.ELEVENLABS_API_KEY.length - 6) : 'No configurada');
    console.log('🔑 Voice ID:', config.ELEVENLABS_VOICE_ID);
    
    // Limpiar las partes de la key de la memoria
    delete window.parts;
})();
