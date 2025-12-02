# Carolina Méndez - Sistema de Llamadas Médicas Colsanitas

Sistema de inteligencia artificial para gestión de citas médicas con reconocimiento de voz y síntesis de voz.

## 🚀 Características

- **Reconocimiento de Voz**: Interfaz de voz bidireccional con reconocimiento de voz en tiempo real
- **Síntesis de Voz**: Respuestas de voz naturales usando ElevenLabs
- **IA Conversacional**: Integración con Google Gemini para respuestas inteligentes
- **Gestión de Citas**: Sistema completo para confirmación, citas prioritarias y urgencias médicas
- **Base de Datos**: CRM integrado para gestión de pacientes

## 📋 Requisitos

- Navegador moderno con soporte para Web Speech API
- API Key de Google Gemini
- API Key de ElevenLabs

## 🔧 Configuración

### Variables de Entorno

1. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Completa las variables de entorno en `.env`:
   ```
   VITE_GEMINI_API_KEY=tu_api_key_de_gemini
   VITE_ELEVENLABS_API_KEY=tu_api_key_de_elevenlabs
   VITE_ELEVENLABS_VOICE_ID=UNIruiz09F4kWYjRpOvy
   ```

### Despliegue en Vercel

1. **Conectar el repositorio a Vercel**:
   - Ve a [Vercel](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto estático

2. **Configurar Variables de Entorno en Vercel**:
   - Ve a Settings → Environment Variables
   - Agrega las siguientes variables:
     - `VITE_GEMINI_API_KEY`: Tu API key de Google Gemini
     - `VITE_ELEVENLABS_API_KEY`: Tu API key de ElevenLabs
     - `VITE_ELEVENLABS_VOICE_ID`: ID de voz de ElevenLabs (opcional)

3. **Configuración de Build**:
   - Framework Preset: Other
   - Build Command: (dejar vacío)
   - Output Directory: (dejar vacío o poner `.`)
   - Install Command: (dejar vacío)

4. **Desplegar**:
   - Vercel desplegará automáticamente en cada push a la rama principal

## 📁 Estructura del Proyecto

```
.
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica JavaScript principal
├── config.js           # Configuración de variables de entorno
├── .env.example       # Ejemplo de variables de entorno
├── .gitignore         # Archivos ignorados por Git
├── README.md          # Este archivo
└── vercel.json        # Configuración de Vercel (opcional)
```

## 🛠️ Desarrollo Local

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd carolina-mendez
   ```

2. Configura las variables de entorno (ver sección de Configuración)

3. Abre `index.html` en un navegador o usa un servidor local:
   ```bash
   # Con Python
   python -m http.server 8000
   
   # Con Node.js (http-server)
   npx http-server
   ```

## 🔐 Seguridad

- **NUNCA** subas el archivo `.env` al repositorio
- Las API keys deben mantenerse privadas
- Usa variables de entorno en producción

## 📝 Notas

- El sistema requiere permisos de micrófono en el navegador
- Funciona mejor en Chrome/Edge (mejor soporte para Web Speech API)
- Las variables de entorno con prefijo `VITE_` son accesibles en el cliente

## 🤝 Contribuciones

Este es un proyecto privado. Para contribuciones, contacta al administrador del repositorio.

## 📄 Licencia

Proyecto privado - Todos los derechos reservados

