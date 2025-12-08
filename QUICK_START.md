# ⚡ Quick Start - Carolina Méndez en Vercel

## 🚀 Deployment en 5 minutos

### Opción 1: Deploy con 1 Click (MÁS RÁPIDO)

1. Click aquí: [![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLuisnefelibato%2FCarolina_Mendez)

2. Configura 3 variables de entorno:
   ```
   VITE_GEMINI_API_KEY=AIzaSy...
   VITE_ELEVENLABS_API_KEY=sk_...
   VITE_ELEVENLABS_VOICE_ID=UNIruiz09F4kWYjRpOvy
   ```

3. Click "Deploy" → Espera 60 segundos → ¡LISTO! ✅

---

### Opción 2: Deploy desde GitHub

1. **Fork o Push** este repo a tu GitHub
2. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click **"New Project"** → Importa el repo
4. Configura variables de entorno (mismas 3 de arriba)
5. Deploy → ¡Listo en 60 segundos! ✅

---

## 🔑 Obtener API Keys (Gratis)

### Gemini API Key:
1. Ve a: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copia la key (empieza con `AIzaSy...`)

### ElevenLabs API Key:
1. Ve a: https://elevenlabs.io/app/settings
2. Tab "API Key"
3. Copia la key (empieza con `sk_...`)

---

## ✅ Verificar que Funciona

1. Abre tu URL de Vercel: `https://tu-proyecto.vercel.app`
2. Presiona F12 (consola del navegador)
3. Debe decir: `✅ Variables de entorno cargadas correctamente`
4. Click "Iniciar Llamada" → Permite micrófono
5. Di "Hola" → Carolina debe responder ✅

---

## 🐛 ¿Problemas?

### Error: "API Key inválida"
→ Ve a Settings → Environment Variables en Vercel  
→ Verifica que las 3 variables estén ahí  
→ Haz **Redeploy** (botón en Deployments)

### Micrófono no funciona
→ Permite permisos en el navegador  
→ Usa Chrome o Edge  
→ Verifica que estés en HTTPS (Vercel lo hace automático)

### Sin voz
→ Verifica tu API Key de ElevenLabs  
→ Revisa créditos (10,000 chars/mes gratis)

---

## 📖 Documentación Completa

- **Deployment detallado**: Ver `DEPLOYMENT_GUIDE.md`
- **Análisis de Florida**: Ver `ANALISIS_FLORIDA_HEALTHCARE.md`
- **README completo**: Ver `README.md`

---

## 💬 Soporte

GitHub: https://github.com/Luisnefelibato/Carolina_Mendez  
Issues: https://github.com/Luisnefelibato/Carolina_Mendez/issues

---

**¡Listo! Tu sistema Carolina está en producción en menos de 5 minutos** 🎉
