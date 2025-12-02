// Configuración de variables de entorno
// Para Vercel y desarrollo local
// Las variables deben tener el prefijo VITE_ para ser accesibles en el cliente

(function () {
    'use strict';

    // Función para obtener variables de entorno
    function getEnvVar(name) {
        // Intentar desde window.__ENV__ (Vercel)
        if (window.__ENV__ && window.__ENV__[name]) {
            return window.__ENV__[name];
        }

        // Intentar desde process.env (Node.js/desarrollo)
        if (typeof process !== 'undefined' && process.env && process.env[name]) {
            return process.env[name];
        }

        // Intentar desde un script inyectado en el HTML
        const envScript = document.querySelector('script[data-env]');
        if (envScript) {
            try {
                const env = JSON.parse(envScript.getAttribute('data-env'));
                if (env[name]) {
                    return env[name];
                }
            } catch (e) {
                console.warn('Error al leer variables de entorno del script:', e);
            }
        }

        return '';
    }

    // Configurar variables globales
    window.APP_CONFIG = {
        GEMINI_API_KEY: getEnvVar('VITE_GEMINI_API_KEY'),
        ELEVENLABS_API_KEY: getEnvVar('VITE_ELEVENLABS_API_KEY'),
        ELEVENLABS_VOICE_ID: getEnvVar('VITE_ELEVENLABS_VOICE_ID') || 'UNIruiz09F4kWYjRpOvy'
    };

    // Validar que las API keys estén configuradas
    if (!window.APP_CONFIG.GEMINI_API_KEY || !window.APP_CONFIG.ELEVENLABS_API_KEY) {
        console.warn('⚠️ ADVERTENCIA: Las API keys no están configuradas. Por favor, configura las variables de entorno VITE_GEMINI_API_KEY y VITE_ELEVENLABS_API_KEY.');
    } else {
        console.log('✅ Variables de entorno cargadas correctamente');
    }
})();

