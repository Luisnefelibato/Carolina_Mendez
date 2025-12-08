// Configuración SEGURA para Carolina AI Assistant
// Las API keys están en el servidor, NO en el cliente

(function() {
    'use strict';
    
    console.log('🔐 Configuración SEGURA cargada');
    console.log('✅ API keys protegidas en el servidor');
    console.log('📡 Usando proxy del backend para todas las APIs');
    
    // Configuración del proxy
    window.__SECURE_CONFIG__ = {
        // Modo de operación
        USE_PROXY: true,
        
        // URLs del proxy (mismo servidor)
        PROXY_GEMINI_URL: '/api/gemini',
        PROXY_TTS_URL: '/api/tts',
        PROXY_CONFIG_URL: '/api/config',
        
        // NO hay API keys en el cliente - están en el servidor
        // Esto es SEGURO y previene exposición de credenciales
    };
    
    // Verificar que el servidor esté configurado correctamente
    fetch('/api/config')
        .then(response => response.json())
        .then(config => {
            console.log('📊 Configuración del servidor:');
            console.log('   ' + (config.gemini_configured ? '✅' : '❌') + ' Gemini API: ' + (config.gemini_configured ? 'Configurada' : 'NO configurada'));
            console.log('   ' + (config.elevenlabs_configured ? '✅' : '❌') + ' ElevenLabs API: ' + (config.elevenlabs_configured ? 'Configurada' : 'NO configurada'));
            console.log('   ✅ Voice ID: ' + config.voice_id);
            console.log('   ✅ Proxy habilitado: ' + config.api_proxy_enabled);
            
            if (!config.gemini_configured) {
                console.warn('⚠️  IMPORTANTE: Configura GEMINI_API_KEY en server.py');
            }
            
            // Guardar configuración global
            window.__API_CONFIG__ = config;
        })
        .catch(error => {
            console.error('❌ Error al verificar configuración del servidor:', error);
            console.error('⚠️  Asegúrate de que server.py esté corriendo');
        });
    
})();
