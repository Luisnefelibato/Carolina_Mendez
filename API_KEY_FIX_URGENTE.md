# 🚨 FIX URGENTE - API KEY BLOQUEADA

## ⚠️ PROBLEMA CRÍTICO DETECTADO

Tu API Key de Google Gemini ha sido **reportada como filtrada** y ha sido bloqueada por Google.

**Error recibido:**
```
403 (Forbidden)
Your API key was reported as leaked. Please use another API key.
```

## 🔧 SOLUCIÓN INMEDIATA

### Paso 1: Obtener una NUEVA API Key de Google Gemini

1. **Ve a Google AI Studio:**
   https://aistudio.google.com/app/apikey

2. **Inicia sesión** con tu cuenta de Google

3. **Crea una nueva API Key:**
   - Haz clic en "Create API Key"
   - Selecciona "Create API key in new project" o usa un proyecto existente
   - **COPIA la nueva API key inmediatamente**

### Paso 2: Actualizar el archivo `env-config.js`

**IMPORTANTE:** La nueva API key debe reemplazar la antigua en la línea 16.

**Archivo actual:**
```javascript
GEMINI_API_KEY: typeof process !== 'undefined' && process.env && process.env.VITE_GEMINI_API_KEY 
    ? process.env.VITE_GEMINI_API_KEY 
    : 'AIzaSyBfhuPrpR8GsfoQG79L29MOY_kpITVRt_M',  // ❌ ESTA KEY ESTÁ BLOQUEADA
```

**Reemplazar con:**
```javascript
GEMINI_API_KEY: typeof process !== 'undefined' && process.env && process.env.VITE_GEMINI_API_KEY 
    ? process.env.VITE_GEMINI_API_KEY 
    : 'TU_NUEVA_API_KEY_AQUÍ',  // ✅ PEGA TU NUEVA KEY AQUÍ
```

### Paso 3: Reiniciar el servidor

```bash
# Matar el proceso actual en el puerto 8080
cd /home/user/webapp && pkill -f "python3 -m http.server 8080"

# Esperar 2 segundos
sleep 2

# Iniciar el servidor de nuevo
cd /home/user/webapp && python3 -m http.server 8080
```

### Paso 4: Verificar en el navegador

1. Abre el demo: https://8080-i075rtx67vpgk1bshaeu1-b32ec7bb.sandbox.novita.ai
2. Abre la consola del navegador (F12)
3. Haz un **hard refresh** (Ctrl + Shift + R)
4. Verifica que veas:
   ```
   ✅ API Keys configuradas desde env-config.js
   🔑 Gemini API Key: TU_NUEVA_KEY...
   🏥 Inicializando Sistema Carolina Florida Medical Center...
   ✅ Sistema Carolina inicializado correctamente
   ```

## 📋 CHECKLIST DE VERIFICACIÓN

- [ ] Nueva API Key de Gemini obtenida desde https://aistudio.google.com/app/apikey
- [ ] `env-config.js` actualizado con la nueva key (línea 16)
- [ ] Archivo guardado
- [ ] Servidor reiniciado
- [ ] Hard refresh en el navegador (Ctrl + Shift + R)
- [ ] Console.log muestra la nueva API Key
- [ ] No aparecen errores 403 de Gemini API
- [ ] Carolina responde correctamente a las interacciones

## 🔒 SEGURIDAD: Prevenir futuras filtraciones

### ❌ NO HACER:
- Compartir la API key públicamente en foros o chats
- Commitear la API key directamente en el código
- Usar la misma API key en múltiples proyectos públicos

### ✅ HACER:
- Usar variables de entorno en producción (Vercel)
- Limitar el uso de la API key por dominio
- Rotar las API keys periódicamente
- Usar restricciones de cuota

## 🚀 DESPUÉS DE CORREGIR

### Para desarrollo local:
```bash
cd /home/user/webapp && python3 -m http.server 8080
```

### Para despliegue en Vercel:
1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega:
   - `VITE_GEMINI_API_KEY` = tu nueva API key
   - `VITE_ELEVENLABS_API_KEY` = (ya configurada)
   - `VITE_ELEVENLABS_VOICE_ID` = (ya configurada)
4. Redeploy el proyecto

## 📊 ESTADO ACTUAL DEL PROYECTO

### ✅ COMPLETADO:
- Sistema Carolina 100% funcional
- Adaptación a Florida Medical Center
- Carolina habla en español
- 3 modos de servicio implementados
- Base de datos de Florida (5 ubicaciones, 30+ doctores)
- Codificación UTF-8 correcta
- Interface en inglés, AI en español
- Documentación completa

### 🔄 PENDIENTE (BLOQUEADO POR API KEY):
- Pruebas end-to-end con Gemini API
- Verificación de respuestas de Carolina
- Despliegue final en Vercel

## 📞 INFORMACIÓN DE CONTACTO

**Proyecto:** Carolina - Florida Medical Center AI Assistant
**GitHub:** https://github.com/Luisnefelibato/Carolina_Mendez
**Demo Actual:** https://8080-i075rtx67vpgk1bshaeu1-b32ec7bb.sandbox.novita.ai

---

## ⏱️ TIEMPO ESTIMADO DE CORRECCIÓN

**Total: 5-10 minutos**
- Obtener nueva API key: 2-3 minutos
- Actualizar env-config.js: 1 minuto
- Reiniciar servidor: 1 minuto
- Verificar funcionamiento: 2-5 minutos

---

**Última actualización:** 2025-12-08
**Prioridad:** 🔴 CRÍTICA - Bloquea todo el funcionamiento del sistema
