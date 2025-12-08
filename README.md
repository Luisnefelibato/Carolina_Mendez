# 🏥 Carolina - Florida Medical Center AI Assistant

Advanced AI-powered medical appointment management system with voice recognition and natural voice synthesis.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLuisnefelibato%2FCarolina_Mendez)

## 🚀 Key Features

- **🎤 Voice Recognition**: Bidirectional voice interface with real-time recognition (Web Speech API)
- **🗣️ Natural Voice Synthesis**: Realistic voice responses using ElevenLabs TTS
- **🤖 Conversational AI**: Integration with Google Gemini 2.5 Flash for intelligent responses
- **📅 Appointment Management**: Complete system for confirmation, priority appointments, and medical emergencies
- **💾 CRM Database**: Integrated system for patient management and reports
- **⚡ 3 Service Modes**: Confirmation, Priority, Emergency

## 🎯 Use Cases

- ✅ Medical appointment confirmation
- ⚡ Priority appointment management (within 24-48 hours)
- 🚨 Immediate medical emergency coordination
- 📊 Data analytics and management reports
- 👥 Integrated patient CRM

## 🏥 Florida Medical Center Network

Our system serves the **Florida Medical Center** network across:

- 🌴 **Miami** - Main Emergency Center (Level 1 Trauma)
- 🎢 **Orlando** - Pediatric Emergency Specialty
- ⚡ **Tampa** - Cardiac Emergency Center
- 🏖️ **Jacksonville** - Stroke Center
- 🌊 **Fort Lauderdale** - Urgent Care

**Database includes:**
- 30+ specialized doctors across all locations
- Emergency rooms and urgent care centers
- US phone numbers and Florida addresses
- 24/7 emergency services

---

## 📋 Prerequisites

### Required APIs:

1. **Google Gemini API** (FREE)
   - Get your API key at: https://makersuite.google.com/app/apikey
   - Free limit: 60 requests/minute

2. **ElevenLabs API** (FREE with limits)
   - Get your API key at: https://elevenlabs.io/app/settings
   - Free plan: 10,000 characters/month

### Compatible Browser:
- Chrome/Edge (recommended)
- Firefox
- Safari (with voice recognition limitations)

---

## 🚀 Quick Deploy on Vercel (5 minutes)

### ⚡ API Keys Already Configured!

**Good news!** The API keys are already integrated in the code at `env-config.js`:
- ✅ Gemini API Key configured
- ✅ ElevenLabs API Key configured
- ✅ ElevenLabs Voice ID configured

**You don't need to configure environment variables manually!**

### Option 1: One-Click Deploy (Easiest)

1. **Click the Deploy Button**:
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLuisnefelibato%2FCarolina_Mendez)

2. **Set Project Name**: `florida-medical-center` (or any lowercase name)

3. **Deploy** and you're done! 🎉

### Option 2: Manual Deploy from GitHub

1. **Connect your repository to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import repository: `https://github.com/Luisnefelibato/Carolina_Mendez`

2. **Project Configuration**:
   ```
   Framework Preset: Other
   Root Directory: ./
   Build Command: (leave empty)
   Output Directory: .
   Install Command: (leave empty)
   ```

3. **Deploy** - No environment variables needed!

### Post-Deployment Verification

After deployment, open your Vercel URL and:

1. **Check Browser Console (F12):**
   ```
   🚀 Initializing Florida Medical Center AI System...
   ✅ Gemini API Key configured: AIza...t_M
   ✅ ElevenLabs API Key configured: 2ee1...1304
   ✅ ElevenLabs Voice ID configured: UNIr...pOvy
   ✅ System initialized successfully
   ```

2. **Test the Interface:**
   - Click "Start Call"
   - Allow microphone access
   - Carolina should greet you in English
   - Verify transcription appears on screen

---

## 🏥 US Healthcare System Compliance

### ESI 5-Level Triage System (Coming Soon)

Carolina is designed to integrate with the Emergency Severity Index (ESI) used in US hospitals:

- **ESI-1** (Resuscitation): Immediate, life-threatening → 911
- **ESI-2** (Emergency): High risk → ER within 15 min
- **ESI-3** (Urgent): Moderate risk → Urgent Care within 24h
- **ESI-4** (Semi-Urgent): Low risk → Primary Care within 7 days
- **ESI-5** (Routine): Non-urgent → Regular appointment within 30 days

### CMS 2025 Standards

The system is prepared to comply with CMS appointment wait time standards:
- Emergency: IMMEDIATE
- Urgent Care: 24 hours
- Sick Care: 7 days
- Routine Care: 30 days

### HIPAA Compliance Ready

Documentation available for HIPAA compliance implementation:
- See `ANALISIS_FLORIDA_HEALTHCARE.md` for detailed US healthcare analysis
- Security guidelines included
- Patient data protection protocols

---

## 📁 Project Structure

```
florida-medical-center/
├── index.html              # Main UI interface
├── script.js               # AI system logic
├── styles.css              # Styling
├── config.js               # Configuration loader
├── env-config.js           # API keys (integrated)
├── vercel.json             # Vercel deployment config
├── README.md               # This file
└── ANALISIS_FLORIDA_HEALTHCARE.md  # US healthcare analysis
```

---

## 🧪 Local Development

### 1. Clone the Repository
```bash
git clone https://github.com/Luisnefelibato/Carolina_Mendez.git
cd Carolina_Mendez
```

### 2. Serve Locally
```bash
# Option 1: Python HTTP Server
python -m http.server 8000

# Option 2: Node.js HTTP Server
npx http-server -p 8000

# Option 3: PHP Built-in Server
php -S localhost:8000
```

### 3. Open in Browser
```
http://localhost:8000
```

### 4. Test the System
- Click "Start Call"
- Allow microphone access
- Speak to test voice recognition
- Verify Carolina responds with voice

---

## 🎨 Service Modes

### 1. 🏥 Appointment Confirmation
- Verify existing appointments
- Confirm dates, times, and specialists
- Provide preparation information
- Send reminders
- Solve confirmation issues

### 2. ⚡ Priority Appointment
- Assess medical urgency
- Coordinate priority appointments (within 24-48h)
- Manage fast rescheduling
- Contact specialists directly
- Provide immediate alternatives

### 3. 🚨 Medical Emergency
- Activate emergency protocols IMMEDIATELY
- Coordinate immediate care (within 30 minutes)
- Direct to nearest 24h medical center
- Provide emergency reference codes
- Manage walk-in care without appointment

---

## 💰 Cost Estimates

### Free Tier (Development/Demo)
- **Google Gemini**: 1,500 requests/day FREE
- **ElevenLabs**: 10,000 characters/month FREE
- **Vercel**: Free hosting
- **TOTAL: $0/month** ✅

### Production (~2000 users/month)
- **Gemini API**: ~$5/month
- **ElevenLabs Pro**: $22/month (100k chars)
- **Vercel Pro**: $20/month (optional)
- **TOTAL: ~$27-47/month**

---

## 🔧 Technologies Used

### Frontend
- HTML5 + CSS3
- JavaScript (ES6+)
- Web Speech API (voice recognition)
- Font Awesome Icons

### AI & Voice
- **Google Gemini 2.5 Flash**: Conversational AI
- **ElevenLabs Multilingual v2**: Voice synthesis
- **Web Speech API**: Voice recognition

### Hosting & Deployment
- **Vercel**: CDN + Edge hosting
- **GitHub**: Version control

---

## 📊 System Architecture

```
┌─────────────────┐
│   Patient/User  │
└────────┬────────┘
         │ Voice Input
         ▼
┌─────────────────┐
│  Web Speech API │ (Voice Recognition)
└────────┬────────┘
         │ Text
         ▼
┌─────────────────┐
│ Carolina System │ (Logic & Routing)
└────────┬────────┘
         │ Context + History
         ▼
┌─────────────────┐
│  Gemini 2.5 AI  │ (Response Generation)
└────────┬────────┘
         │ Text Response
         ▼
┌─────────────────┐
│  ElevenLabs TTS │ (Voice Synthesis)
└────────┬────────┘
         │ Audio
         ▼
┌─────────────────┐
│   Patient/User  │ (Hears Response)
└─────────────────┘
```

---

## 🔐 Security & Privacy

### Data Protection
- No patient data stored on external servers
- Local browser storage only (localStorage)
- HIPAA-compliant architecture ready
- Secure API communication (HTTPS)

### API Keys
- Already configured in `env-config.js`
- Loaded dynamically at runtime
- Can be replaced for production deployments

### Best Practices
- Never commit `.env` files to Git
- Use environment variables in production
- Rotate API keys regularly
- Monitor API usage and costs

---

## 🚀 Roadmap

### Phase 1: ✅ COMPLETED
- [x] Voice recognition and synthesis
- [x] AI conversational system
- [x] 3 service modes (Confirmation, Priority, Emergency)
- [x] Florida Medical Center branding
- [x] US healthcare terminology
- [x] Florida-based doctors and locations
- [x] Vercel deployment ready

### Phase 2: 🔄 IN PROGRESS
- [ ] ESI 5-level triage implementation
- [ ] CMS 2025 standards compliance
- [ ] HIPAA compliance certification
- [ ] Bilingual support (English + Spanish)
- [ ] SMS/Email confirmation integration

### Phase 3: 📅 PLANNED
- [ ] EHR integration (Epic, Cerner)
- [ ] Insurance verification API
- [ ] Telehealth appointment booking
- [ ] Multi-location management
- [ ] Advanced analytics dashboard

---

## 📚 Documentation

- **Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Florida Healthcare Analysis**: `ANALISIS_FLORIDA_HEALTHCARE.md`
- **Character Encoding Fix**: `CHARACTER_ENCODING_FIXED.md`
- **Deployment Success**: `DEPLOYMENT_SUCCESS.md`

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👏 Credits

**Developed by**: Luisnefelibato  
**Powered by**:
- Google Gemini 2.5 Flash (AI)
- ElevenLabs (Voice Synthesis)
- Vercel (Hosting)

---

## 📞 Support

Need help?

1. **Check the documentation** in the repository
2. **Open an issue** on GitHub
3. **Contact the developer**: [GitHub Profile](https://github.com/Luisnefelibato)

---

## 🏥 About Florida Medical Center

**Florida Medical Center** is a network of advanced medical facilities serving the state of Florida with:

- 🏥 5 major locations across Florida
- 👨‍⚕️ 30+ specialized physicians
- 🚨 24/7 emergency services
- ⚡ Priority care and urgent care centers
- 🎯 Commitment to patient-centered care

**Emergency Hotline**: Call 911 for life-threatening emergencies

---

**🎉 Ready to deploy? Click the button below!**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLuisnefelibato%2FCarolina_Mendez)

---

*Last updated: December 8, 2025*  
*Version: 2.0.0 - Florida Medical Center Edition*
