# 🚀 Guía Completa de Despliegue en Vercel

Esta guía te llevará paso a paso para desplegar Carolina Méndez en Vercel.

---

## 📋 Pre-requisitos

Antes de comenzar, asegúrate de tener:

✅ Una cuenta en [Vercel](https://vercel.com) (gratis)  
✅ Tu repositorio en GitHub: https://github.com/Luisnefelibato/Carolina_Mendez  
✅ API Key de Google Gemini: https://makersuite.google.com/app/apikey  
✅ API Key de ElevenLabs: https://elevenlabs.io/app/settings  

---

## 🎯 Método 1: Despliegue Automático desde GitHub (RECOMENDADO)

### Paso 1: Conecta el Repositorio a Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en **"Add New..."** → **"Project"**
3. Click en **"Import Git Repository"**
4. Busca: `Luisnefelibato/Carolina_Mendez`
5. Click en **"Import"**

### Paso 2: Configura el Proyecto

En la pantalla de configuración:

```
Framework Preset: Other
Root Directory: ./
Build Command: [dejar vacío]
Output Directory: .
Install Command: [dejar vacío]
```

### Paso 3: Agrega Variables de Entorno

⚠️ **IMPORTANTE**: Este es el paso CRÍTICO

1. Desplázate hasta la sección **"Environment Variables"**
2. Agrega estas 3 variables:

| Name | Value | Environment |
|------|-------|-------------|
| `VITE_GEMINI_API_KEY` | `AIzaSy...` (tu API key real) | Production, Preview |
| `VITE_ELEVENLABS_API_KEY` | `sk_...` (tu API key real) | Production, Preview |
| `VITE_ELEVENLABS_VOICE_ID` | `UNIruiz09F4kWYjRpOvy` | Production, Preview |

3. Marca **"Production"** y **"Preview"** para cada variable

### Paso 4: Deploy

1. Click en **"Deploy"**
2. Espera 30-60 segundos
3. ✅ **¡Listo!** Tu app está en: `https://carolina-mendez.vercel.app`

---

## 🔧 Método 2: Despliegue Manual con Vercel CLI

### Instalación de Vercel CLI:

```bash
# Navega al proyecto
cd /home/user/webapp

# Instala Vercel CLI localmente
npm install vercel --save-dev

# O instala globalmente (requiere permisos)
npm install -g vercel
```

### Despliegue:

```bash
# Login en Vercel
npx vercel login

# Deploy en modo interactivo
npx vercel

# O deploy directo a producción
npx vercel --prod
```

### Configurar Variables de Entorno vía CLI:

```bash
# Agregar variable de Gemini
npx vercel env add VITE_GEMINI_API_KEY

# Agregar variable de ElevenLabs
npx vercel env add VITE_ELEVENLABS_API_KEY

# Agregar Voice ID
npx vercel env add VITE_ELEVENLABS_VOICE_ID
```

---

## ⚙️ Configuración Detallada de Variables de Entorno

### Opción A: Desde Vercel Dashboard

1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Click en **"Add New"**
4. Completa:
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Value**: Tu API key de Gemini
   - **Environments**: Marca Production y Preview
5. Click **"Save"**
6. Repite para las otras 2 variables

### Opción B: Desde archivo .env (Solo desarrollo local)

```bash
# Crea archivo .env en la raíz del proyecto
cp .env.example .env

# Edita con tus API keys reales
nano .env
```

```env
VITE_GEMINI_API_KEY=AIzaSyC_tu_api_key_real_aqui
VITE_ELEVENLABS_API_KEY=sk_tu_api_key_real_aqui
VITE_ELEVENLABS_VOICE_ID=UNIruiz09F4kWYjRpOvy
```

⚠️ **NUNCA** hagas commit del archivo `.env` al repositorio!

---

## 🔍 Verificación del Despliegue

### 1. Verifica que el sitio cargue:

```
https://tu-proyecto.vercel.app
```

Deberías ver la interfaz de Carolina Méndez.

### 2. Abre la Consola del Navegador (F12):

Busca estos mensajes:

```
✅ Variables de entorno cargadas correctamente
🚀 Inicializando Carolina IA System...
✅ Sistema Carolina inicializado correctamente
```

### 3. Prueba una Llamada:

1. Click en **"Iniciar Llamada"**
2. Permite permisos del micrófono
3. Habla: *"Hola"*
4. Carolina debería responder por voz

### 4. Verifica las APIs:

Si ves errores como:

```
❌ Error: Invalid API Key
```

Significa que las variables de entorno no están configuradas correctamente.

---

## 🐛 Solución de Problemas

### Problema 1: "API Key inválida"

**Causa**: Variables de entorno no configuradas o incorrectas

**Solución**:
1. Ve a Vercel Dashboard → Settings → Environment Variables
2. Verifica que las 3 variables estén presentes
3. Verifica que no haya espacios extra en las API keys
4. **IMPORTANTE**: Después de cambiar variables, debes hacer **Redeploy**:
   - Ve a Deployments
   - Click en los tres puntos del último deployment
   - Click en **"Redeploy"**

### Problema 2: "Cannot read properties of undefined"

**Causa**: La variable `window.APP_CONFIG` no está definida

**Solución**:
1. Verifica que `config.js` se cargue ANTES de `script.js` en `index.html`
2. Revisa la consola del navegador para errores de carga
3. Asegúrate de que las variables tengan el prefijo `VITE_`

### Problema 3: "Web Speech API not supported"

**Causa**: Navegador incompatible o no hay HTTPS

**Solución**:
1. Usa Chrome o Edge (mejor compatibilidad)
2. Vercel proporciona HTTPS automáticamente, pero verifica la URL
3. No funcionará en navegadores antiguos

### Problema 4: Despliegue exitoso pero app no funciona

**Checklist**:
- [ ] Las variables de entorno están configuradas
- [ ] Hiciste Redeploy después de agregar variables
- [ ] Las API keys son válidas (pruébalas en Postman)
- [ ] Tienes créditos disponibles en ElevenLabs (10,000 chars/mes gratis)
- [ ] La API de Gemini no está bloqueada por región

---

## 🔄 Actualización y Re-despliegue

### Despliegue Automático (Recomendado):

Cada vez que hagas `git push` a la rama `main`, Vercel automáticamente:

1. Detecta el cambio
2. Ejecuta el build
3. Despliega la nueva versión
4. Te envía notificación por email

```bash
# Haz tus cambios en el código
git add .
git commit -m "feat: Nueva funcionalidad"
git push origin main

# Vercel desplegará automáticamente
```

### Despliegue Manual:

```bash
# Redeploy desde CLI
npx vercel --prod

# O desde Dashboard:
# Deployments → Latest → ... → Redeploy
```

---

## 🌍 Dominios Personalizados

### Agregar dominio personalizado:

1. Ve a tu proyecto en Vercel
2. **Settings** → **Domains**
3. Click en **"Add"**
4. Ingresa tu dominio: `carolina.tudominio.com`
5. Sigue las instrucciones de configuración DNS

### Configuración DNS:

Si tu dominio es `carolina.ejemplo.com`:

```
Type: CNAME
Name: carolina
Value: cname.vercel-dns.com
```

---

## 📊 Monitoreo y Analytics

### Ver estadísticas de uso:

1. **Analytics** (pestaña en Vercel)
   - Visitas
   - Países
   - Navegadores
   - Performance

2. **Logs** (pestaña en Vercel)
   - Errores en tiempo real
   - Logs de las funciones
   - Request/Response info

### Configurar Alertas:

1. **Settings** → **Notifications**
2. Configura alertas para:
   - Errores de deployment
   - Límites de uso
   - Performance issues

---

## 💰 Costos y Límites

### Vercel (Hosting):

**Plan Hobby (Gratis):**
- ✅ 100 GB bandwidth/mes
- ✅ Despliegues ilimitados
- ✅ HTTPS automático
- ✅ Dominio personalizado
- ✅ Analytics básico

**Suficiente para:**
- Prototipo
- Pequeña empresa (< 1000 usuarios/mes)
- Demo y testing

### Google Gemini:

**Plan Gratuito:**
- ✅ 60 peticiones/minuto
- ✅ 1,500 peticiones/día
- ✅ Sin costo

**Suficiente para:**
- ~1,000 conversaciones/día
- Uso de pequeña a mediana empresa

### ElevenLabs:

**Plan Gratuito:**
- ✅ 10,000 caracteres/mes
- ≈ 100-150 respuestas de voz
- ⚠️ Limitado para producción

**Plan Starter ($5/mes):**
- ✅ 30,000 caracteres/mes
- ≈ 300-450 respuestas de voz

**Plan Creator ($22/mes):**
- ✅ 100,000 caracteres/mes
- ≈ 1,000-1,500 respuestas de voz

---

## 🎯 Checklist Final de Deployment

Antes de considerar el deployment como completo:

- [ ] Sitio accesible en URL de Vercel
- [ ] Variables de entorno configuradas
- [ ] Consola del navegador sin errores críticos
- [ ] Llamada de prueba funciona correctamente
- [ ] Reconocimiento de voz activo
- [ ] Síntesis de voz funciona
- [ ] Base de datos CRM carga correctamente
- [ ] Todos los tabs/pestañas funcionan
- [ ] Responsive design en móvil funciona
- [ ] HTTPS activo (candado verde en navegador)
- [ ] Dominio personalizado configurado (opcional)
- [ ] README.md actualizado con URL de producción

---

## 🆘 Soporte

### Recursos Oficiales:

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Gemini Docs**: https://ai.google.dev/gemini-api/docs
- **ElevenLabs Docs**: https://docs.elevenlabs.io/

### Comunidad:

- **Discord de Vercel**: https://discord.gg/vercel
- **Stack Overflow**: Tag `vercel`
- **GitHub Issues**: Reporta bugs en el repo

---

## ✅ Deployment Exitoso

Si todos los pasos anteriores funcionaron, **¡FELICIDADES!** 🎉

Tu aplicación Carolina Méndez está ahora:

- ✅ Desplegada en producción
- ✅ Accesible 24/7
- ✅ Con HTTPS seguro
- ✅ Con auto-deployment desde GitHub
- ✅ Escalable y profesional

**URL de Producción**: `https://tu-proyecto.vercel.app`

---

**Preparado por**: Sistema de Deployment Automation  
**Última actualización**: 8 de diciembre de 2025  
**Versión**: 1.0
