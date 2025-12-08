# 🏥 Carolina Méndez - Sistema de Llamadas Médicas IA

Sistema de inteligencia artificial avanzado para gestión de citas médicas con reconocimiento de voz y síntesis de voz natural.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLuisnefelibato%2FCarolina_Mendez)

## 🚀 Características Principales

- **🎤 Reconocimiento de Voz**: Interfaz de voz bidireccional con reconocimiento en tiempo real (Web Speech API)
- **🗣️ Síntesis de Voz Natural**: Respuestas de voz realistas usando ElevenLabs TTS
- **🤖 IA Conversacional**: Integración con Google Gemini 2.5 Flash para respuestas inteligentes
- **📅 Gestión de Citas**: Sistema completo para confirmación, citas prioritarias y urgencias médicas
- **💾 Base de Datos CRM**: Sistema integrado para gestión de pacientes y reportes
- **⚡ 3 Modos de Servicio**: Confirmación, Prioritaria, Urgencia

## 🎯 Casos de Uso

- ✅ Confirmación de citas médicas programadas
- ⚡ Gestión de citas prioritarias (dentro de 24-48 horas)
- 🚨 Coordinación de urgencias médicas inmediatas
- 📊 Análisis de datos y reportes de gestión
- 👥 CRM de pacientes integrado

---

## 📋 Requisitos Previos

### APIs Necesarias:

1. **Google Gemini API** (GRATIS)
   - Obtén tu API key en: https://makersuite.google.com/app/apikey
   - Límite gratuito: 60 peticiones/minuto

2. **ElevenLabs API** (GRATIS con límites)
   - Obtén tu API key en: https://elevenlabs.io/app/settings
   - Plan gratuito: 10,000 caracteres/mes

### Navegador Compatible:
- Chrome/Edge (recomendado)
- Firefox
- Safari (con limitaciones en reconocimiento de voz)

---

## 🚀 Despliegue Rápido en Vercel (5 minutos)

### Opción 1: Despliegue con un Click

1. **Click en el botón de Deploy**:
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLuisnefelibato%2FCarolina_Mendez)

2. **Configura las Variables de Entorno** en Vercel:
   ```
   VITE_GEMINI_API_KEY=tu_api_key_de_gemini
   VITE_ELEVENLABS_API_KEY=tu_api_key_de_elevenlabs
   VITE_ELEVENLABS_VOICE_ID=UNIruiz09F4kWYjRpOvy
   ```

3. **Deploy** y listo! 🎉

### Opción 2: Despliegue Manual desde GitHub

1. **Conecta tu repositorio a Vercel**:
   - Ve a [Vercel Dashboard](https://vercel.com/dashboard)
   - Click en "New Project"
   - Importa el repositorio: `https://github.com/Luisnefelibato/Carolina_Mendez`

2. **Configuración del Proyecto**:
   ```
   Framework Preset: Other
   Root Directory: ./
   Build Command: (dejar vacío)
   Output Directory: .
   Install Command: (dejar vacío)
   ```

3. **Agrega Variables de Entorno**:
   - Settings → Environment Variables
   - Agregar las 3 variables necesarias (ver arriba)

4. **Deploy**:
   - Click en "Deploy"
   - Espera 30-60 segundos
   - Tu app estará lista en: `https://tu-proyecto.vercel.app`

---

## 🔧 Configuración de Variables de Entorno

### Para Desarrollo Local:

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```

2. Edita `.env` con tus API keys reales:
   ```env
   VITE_GEMINI_API_KEY=AIzaSy...tu_api_key_real
   VITE_ELEVENLABS_API_KEY=sk_...tu_api_key_real
   VITE_ELEVENLABS_VOICE_ID=UNIruiz09F4kWYjRpOvy
   ```

### Para Producción (Vercel):

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega cada variable:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_GEMINI_API_KEY` | API Key de Google Gemini | `AIzaSyC...` |
| `VITE_ELEVENLABS_API_KEY` | API Key de ElevenLabs | `sk_abc123...` |
| `VITE_ELEVENLABS_VOICE_ID` | ID de voz (opcional) | `UNIruiz09F4kWYjRpOvy` |

4. Redeploy el proyecto para aplicar cambios

---

## 📁 Estructura del Proyecto

```
carolina-mendez/
├── index.html                      # Página principal de la app
├── styles.css                      # Estilos CSS personalizados
├── script.js                       # Lógica JavaScript principal (2000+ líneas)
├── config.js                       # Configuración de variables de entorno
├── vercel.json                     # Configuración de Vercel
├── .env.example                    # Ejemplo de variables de entorno
├── .gitignore                      # Archivos ignorados por Git
├── README.md                       # Este archivo
├── ANALISIS_FLORIDA_HEALTHCARE.md  # Análisis detallado del sistema de Florida
└── package.json                    # Metadata del proyecto
```

---

## 🛠️ Desarrollo Local

### Método 1: Servidor Simple (Recomendado)

```bash
# 1. Clona el repositorio
git clone https://github.com/Luisnefelibato/Carolina_Mendez.git
cd Carolina_Mendez

# 2. Configura variables de entorno
cp .env.example .env
# Edita .env con tus API keys

# 3. Inicia un servidor local
# Con Python 3:
python -m http.server 8000

# O con Python 2:
python -m SimpleHTTPServer 8000

# O con Node.js:
npx http-server -p 8000

# 4. Abre en tu navegador
# http://localhost:8000
```

### Método 2: Abrir directamente (Solo para testing)

```bash
# Abre index.html directamente en el navegador
# NOTA: Algunas funciones pueden no funcionar por CORS
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

---

## 🎨 Funcionalidades Detalladas

### 1️⃣ Sistema de Llamadas IA

- **Inicio de llamada**: Click en "Iniciar Llamada"
- **Reconocimiento automático**: La IA escucha cuando hablas
- **Respuesta inteligente**: Gemini procesa y genera respuesta
- **Síntesis de voz**: ElevenLabs convierte texto a voz natural
- **Conversación fluida**: Turnos automáticos Carolina ↔ Paciente

### 2️⃣ Tres Modos de Servicio

#### 📅 Confirmación de Citas (por defecto)
- Verificación de citas existentes
- Confirmación de fecha y hora
- Información de preparativos
- Recordatorios automáticos

#### ⚡ Cita Prioritaria
- Atención dentro de 24-48 horas
- Horarios prioritarios (mañanas)
- Gestión rápida de reprogramación
- Seguimiento inmediato

#### 🚨 Urgencia Médica
- Atención INMEDIATA
- Direccionamiento a centro más cercano
- Código de urgencia único
- Protocolo de emergencia activado

### 3️⃣ Base de Datos CRM

- **Gestión de Pacientes**: Registro completo con datos médicos
- **Búsqueda Inteligente**: Filtros por especialidad, ciudad, estado
- **Historial de Llamadas**: Todas las interacciones registradas
- **Reportes Automáticos**: Analytics y métricas en tiempo real

---

## 🔐 Seguridad y Privacidad

### Buenas Prácticas:

✅ **DO (Hacer):**
- Usar variables de entorno para API keys
- Mantener `.env` en `.gitignore`
- Rotar API keys regularmente
- Usar HTTPS en producción (Vercel lo hace automático)
- Limitar acceso a dashboard de administración

❌ **DON'T (No hacer):**
- Subir API keys al repositorio
- Compartir `.env` en Slack/Email
- Hacer commit de secretos
- Hardcodear API keys en el código
- Usar HTTP en producción

### HIPAA Compliance (para uso médico real):

⚠️ **IMPORTANTE**: Este es un prototipo educativo. Para uso médico real en USA:
- Implementar encriptación end-to-end
- Usar base de datos HIPAA-compliant
- Logging y auditoría completa
- Consentimiento explícito del paciente
- Plan de respuesta a incidentes

---

## 🐛 Troubleshooting (Solución de Problemas)

### Problema: "API Key inválida"

**Síntoma**: Error en consola: `Invalid API Key`

**Solución**:
1. Verifica que las variables de entorno estén correctas
2. En Vercel: Settings → Environment Variables
3. Asegúrate de usar el prefijo `VITE_`
4. Redeploy después de cambiar variables

### Problema: "Micrófono no funciona"

**Síntoma**: No se activa el reconocimiento de voz

**Solución**:
1. Permite permisos de micrófono en el navegador
2. Usa HTTPS (requerido para Web Speech API)
3. Usa Chrome/Edge (mejor compatibilidad)
4. Verifica que el micrófono funcione en otras apps

### Problema: "Voz no se reproduce"

**Síntoma**: La IA responde pero no habla

**Solución**:
1. Verifica tu API Key de ElevenLabs
2. Revisa límite de caracteres (10,000/mes gratis)
3. Aumenta volumen en la app
4. Verifica consola del navegador para errores

### Problema: "Respuestas lentas"

**Síntoma**: La IA tarda mucho en responder

**Solución**:
1. Verifica conexión a internet
2. El modelo Gemini 2.5 Flash es rápido (~800ms)
3. ElevenLabs puede tardar ~2-3 segundos
4. Revisa estadísticas de tiempo en la interfaz

---

## 📊 Métricas y Analytics

### KPIs Monitoreados:

- **Tiempo de Respuesta IA**: ~800ms promedio (Gemini)
- **Tasa de Confirmación**: % de citas confirmadas exitosamente
- **Interacciones por Llamada**: Promedio de turnos de conversación
- **Pacientes Activos**: Total en base de datos
- **Llamadas por Día**: Volumen de uso diario

---

## 🌍 Roadmap y Futuras Mejoras

### ✅ Completado (v1.0):
- [x] Sistema de reconocimiento de voz
- [x] Integración con Gemini IA
- [x] Síntesis de voz con ElevenLabs
- [x] CRM básico de pacientes
- [x] Tres modos de servicio
- [x] Dashboard de estadísticas

### 🚧 En Desarrollo (v1.1):
- [ ] Sistema ESI de 5 niveles (Florida)
- [ ] Triage telefónico estructurado
- [ ] Base de datos de facilidades de Florida
- [ ] Terminología en inglés/bilingüe
- [ ] Compliance con CMS standards

### 💡 Futuras Versiones:
- [ ] Integración con calendarios (Google Calendar)
- [ ] SMS/Email automáticos de recordatorios
- [ ] Multi-idioma (Inglés, Español, Portugués)
- [ ] App móvil (React Native)
- [ ] Integración con EHR (Electronic Health Records)
- [ ] Análisis predictivo de demanda
- [ ] Chatbot de WhatsApp/Telegram

---

## 🤝 Contribuciones

### ¿Cómo Contribuir?

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Haz tus cambios y commit: `git commit -m "Agrega nueva funcionalidad"`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

### Lineamientos:
- Código limpio y comentado
- Seguir estructura existente
- Probar exhaustivamente antes de PR
- Documentar cambios en README

---

## 📞 Soporte y Contacto

### Recursos Útiles:

- **Documentación Gemini**: https://ai.google.dev/gemini-api/docs
- **Documentación ElevenLabs**: https://docs.elevenlabs.io/
- **Web Speech API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- **Vercel Docs**: https://vercel.com/docs

### Reportar Bugs:

Abre un issue en GitHub con:
- Descripción del problema
- Pasos para reproducir
- Navegador y versión
- Screenshots/logs de consola

---

## 📄 Licencia

Copyright © 2025 Carolina Méndez System. Todos los derechos reservados.

Este es un proyecto privado desarrollado para fines educativos y comerciales.

---

## 🌟 Créditos

**Desarrollado con:**
- 🤖 Google Gemini 2.5 Flash (IA Conversacional)
- 🗣️ ElevenLabs Multilingual v2 (Text-to-Speech)
- 🎤 Web Speech API (Speech Recognition)
- ⚡ Vercel (Hosting y Deploy)
- 🎨 Font Awesome (Iconos)

**Powered by AI** 🚀

---

**¿Te gusta el proyecto? Dale una ⭐ en GitHub!**

