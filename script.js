// === SISTEMA IA CAROLINA COLSANITAS ===
class CarolinaColsanitasSistema {

    constructor() {
        // APIs - CONFIGURACIÓN desde variables de entorno
        this.GEMINI_API_KEY = window.APP_CONFIG?.GEMINI_API_KEY || '';
        this.ELEVENLABS_API_KEY = window.APP_CONFIG?.ELEVENLABS_API_KEY || '';
        this.ELEVENLABS_VOICE_ID = window.APP_CONFIG?.ELEVENLABS_VOICE_ID || 'UNIruiz09F4kWYjRpOvy';

        // Validar que las API keys estén configuradas
        if (!this.GEMINI_API_KEY || !this.ELEVENLABS_API_KEY) {
            console.error('⚠️ ADVERTENCIA: Las API keys no están configuradas. Por favor, configura las variables de entorno.');
        }

        // Estados principales
        this.isCallActive = false;
        this.isCarolinaSpeaking = false;
        this.isMicrophoneActive = false;
        this.isProcessingResponse = false;
        this.currentServiceType = 'confirmacion';

        // Control de audio y reconocimiento
        this.volume = 0.8;
        this.recognition = null;
        this.currentAudio = null;
        this.silenceTimer = null;
        this.microphoneTimer = null;

        // Datos de conversaciÃ³n y CRM
        this.finalTranscript = '';
        this.interimTranscript = '';
        this.conversationHistory = [];
        this.interactionCount = 0;
        this.patientName = null;
        this.currentPatient = null;

        // Base de datos mÃ©dica
        this.patientsDatabase = [];
        this.callsDatabase = [];
        this.reportsDatabase = [];

        // Base de datos simulada de doctores y horarios
        this.initializeSimulatedDatabase();

        // Elementos DOM
        this.initializeDOMElements();
        this.initializeSystem();
        this.loadDatabaseFromStorage();
    }

    initializeDOMElements() {
        this.callButton = document.getElementById('callButton');
        this.volumeButton = document.getElementById('volumeButton');
        this.stopButton = document.getElementById('stopButton');
        this.callStatus = document.getElementById('callStatus');
        this.conversationDisplay = document.getElementById('conversationDisplay');
        this.transcript = document.getElementById('transcript');
        this.audioVisualizer = document.getElementById('audioVisualizer');
        this.micIndicator = document.getElementById('micIndicator');

        // EstadÃ­sticas
        this.responseTimeEl = document.getElementById('responseTime');
        this.interactionsEl = document.getElementById('interactions');
        this.micStatusEl = document.getElementById('micStatus');
        this.carolinaStatusEl = document.getElementById('carolinaStatus');

        // CRM Elements
        this.totalPatientsEl = document.getElementById('totalPatients');
        this.callsTodayEl = document.getElementById('callsToday');
        this.confirmationRateEl = document.getElementById('confirmationRate');
        this.appointmentsMonthEl = document.getElementById('appointmentsMonth');
    }

    async initializeSystem() {
        console.log('ðŸš€ Inicializando Carolina IA System...');
        this.setupEventListeners();
        await this.initializeVoiceRecognition();
        this.updateCallStatus(this.getWelcomeMessage(), 'waiting');
        this.updateMicrophoneStatus(false);
        this.updateCRMDashboard();

        // Intentar listar modelos disponibles para diagnÃ³stico
        setTimeout(async () => {
            const models = await this.listAvailableModels();
            if (models.length > 0) {
                console.log('âœ… Modelos disponibles para esta API key:', models.map(m => m.name).join(', '));
            } else {
                console.warn('âš ï¸ No se pudieron listar modelos. Verifica que la API key sea vÃ¡lida.');
            }
        }, 1000);

        console.log('âœ… Sistema Carolina inicializado correctamente');
    }

    // === BASE DE DATOS SIMULADA ===
    initializeSimulatedDatabase() {
        // Doctores por especialidad
        this.doctorsDatabase = {
            'odontologia': [
                { name: 'Dr. Carlos RamÃ­rez', clinic: 'ClÃ­nica Colsanitas Calle 127', phone: '601-345-6789' },
                { name: 'Dra. MarÃ­a GonzÃ¡lez', clinic: 'ClÃ­nica Colsanitas Centro', phone: '601-234-5678' },
                { name: 'Dr. AndrÃ©s MartÃ­nez', clinic: 'ClÃ­nica Colsanitas Norte', phone: '601-456-7890' },
                { name: 'Dra. Laura SÃ¡nchez', clinic: 'ClÃ­nica Colsanitas Sur', phone: '601-567-8901' }
            ],
            'cardiologia': [
                { name: 'Dr. Roberto FernÃ¡ndez', clinic: 'ClÃ­nica Colsanitas Calle 127', phone: '601-345-6789' },
                { name: 'Dra. Ana Torres', clinic: 'ClÃ­nica Colsanitas Centro', phone: '601-234-5678' },
                { name: 'Dr. Juan PÃ©rez', clinic: 'ClÃ­nica Colsanitas Norte', phone: '601-456-7890' }
            ],
            'medicina_general': [
                { name: 'Dr. Pedro LÃ³pez', clinic: 'ClÃ­nica Colsanitas Calle 127', phone: '601-345-6789' },
                { name: 'Dra. Carmen DÃ­az', clinic: 'ClÃ­nica Colsanitas Centro', phone: '601-234-5678' },
                { name: 'Dr. Miguel RodrÃ­guez', clinic: 'ClÃ­nica Colsanitas Norte', phone: '601-456-7890' }
            ],
            'pediatria': [
                { name: 'Dra. SofÃ­a Morales', clinic: 'ClÃ­nica Colsanitas Calle 127', phone: '601-345-6789' },
                { name: 'Dr. Diego Herrera', clinic: 'ClÃ­nica Colsanitas Centro', phone: '601-234-5678' }
            ],
            'ginecologia': [
                { name: 'Dra. Patricia Vega', clinic: 'ClÃ­nica Colsanitas Calle 127', phone: '601-345-6789' },
                { name: 'Dra. Isabel Castro', clinic: 'ClÃ­nica Colsanitas Centro', phone: '601-234-5678' }
            ],
            'dermatologia': [
                { name: 'Dr. Fernando Ruiz', clinic: 'ClÃ­nica Colsanitas Calle 127', phone: '601-345-6789' },
                { name: 'Dra. Claudia Moreno', clinic: 'ClÃ­nica Colsanitas Norte', phone: '601-456-7890' }
            ],
            'ortopedia': [
                { name: 'Dr. Jorge Silva', clinic: 'ClÃ­nica Colsanitas Calle 127', phone: '601-345-6789' },
                { name: 'Dr. Ricardo Vargas', clinic: 'ClÃ­nica Colsanitas Centro', phone: '601-234-5678' }
            ]
        };

        // Horarios disponibles comunes
        this.availableTimes = [
            '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
            '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
            '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
        ];

        // Horarios prioritarios (mÃ¡s tempranos o flexibles)
        this.priorityTimes = [
            '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
            '10:00 AM', '10:30 AM', '11:00 AM', '1:00 PM', '1:30 PM', '2:00 PM'
        ];

        // ClÃ­nicas de urgencias con informaciÃ³n completa
        this.emergencyClinics = [
            {
                name: 'ClÃ­nica Colsanitas Calle 127',
                address: 'Calle 127 # 7-32, BogotÃ¡',
                phone: '601-345-6789',
                emergencyPhone: '601-345-6790',
                open24h: true,
                specialties: ['Todas las especialidades']
            },
            {
                name: 'ClÃ­nica Colsanitas Centro',
                address: 'Carrera 7 # 32-16, BogotÃ¡',
                phone: '601-234-5678',
                emergencyPhone: '601-234-5679',
                open24h: true,
                specialties: ['Todas las especialidades']
            },
            {
                name: 'ClÃ­nica Colsanitas Norte',
                address: 'Avenida 68 # 49-47, BogotÃ¡',
                phone: '601-456-7890',
                emergencyPhone: '601-456-7891',
                open24h: true,
                specialties: ['Todas las especialidades']
            },
            {
                name: 'ClÃ­nica Colsanitas Sur',
                address: 'Calle 13 Sur # 4-47, BogotÃ¡',
                phone: '601-567-8901',
                emergencyPhone: '601-567-8902',
                open24h: true,
                specialties: ['Todas las especialidades']
            }
        ];
    }

    // === SIMULACIÃ“N DE BÃšSQUEDA DE CITA ===
    simulateAppointmentSearch(patientName, documentNumber, specialty, dayOfWeek, serviceType = 'confirmacion') {
        // Normalizar especialidad
        const normalizedSpecialty = this.normalizeSpecialty(specialty);

        // Obtener doctores disponibles para la especialidad
        const doctors = this.doctorsDatabase[normalizedSpecialty] || this.doctorsDatabase['medicina_general'];

        // Seleccionar un doctor aleatorio
        const doctor = doctors[Math.floor(Math.random() * doctors.length)];

        let appointmentDate, time, status, appointmentId;

        if (serviceType === 'urgencia') {
            // Para urgencias: fecha y hora inmediatas (hoy o maÃ±ana temprano)
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            tomorrow.setHours(8, 0, 0, 0);

            appointmentDate = this.formatDate(tomorrow);
            time = '8:00 AM';
            status = 'urgencia activada';
            appointmentId = `URG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
        } else if (serviceType === 'prioritaria') {
            // Para prioritarias: maÃ±ana o pasado maÃ±ana
            const today = new Date();
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + (Math.random() > 0.5 ? 1 : 2));

            appointmentDate = this.formatDate(nextDay);
            time = this.priorityTimes[Math.floor(Math.random() * this.priorityTimes.length)];
            status = 'prioritaria confirmada';
            appointmentId = `PRI-${Date.now().toString().slice(-6)}`;
        } else {
            // ConfirmaciÃ³n normal: calcular fecha del prÃ³ximo dÃ­a de la semana solicitado
            appointmentDate = this.getNextDayOfWeek(dayOfWeek);
            time = this.availableTimes[Math.floor(Math.random() * this.availableTimes.length)];
            status = 'confirmada';
            appointmentId = `COL-${Date.now().toString().slice(-6)}`;
        }

        return {
            patientName: patientName,
            documentNumber: documentNumber,
            specialty: normalizedSpecialty,
            doctor: doctor.name,
            clinic: doctor.clinic,
            date: appointmentDate,
            time: time,
            status: status,
            appointmentId: appointmentId,
            serviceType: serviceType
        };
    }

    // === SIMULACIÃ“N DE URGENCIA MÃ‰DICA ===
    simulateEmergencyResponse(patientName, documentNumber, specialty, location = null) {
        // Seleccionar clÃ­nica de urgencias mÃ¡s cercana o aleatoria
        let clinic;
        if (location) {
            // Si hay ubicaciÃ³n, seleccionar la mÃ¡s cercana (simulado)
            clinic = this.emergencyClinics[Math.floor(Math.random() * this.emergencyClinics.length)];
        } else {
            clinic = this.emergencyClinics[Math.floor(Math.random() * this.emergencyClinics.length)];
        }

        // Generar cÃ³digo de urgencia Ãºnico
        const emergencyCode = `URG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;

        // Fecha y hora inmediatas
        const now = new Date();
        const arrivalTime = new Date(now.getTime() + 30 * 60000); // 30 minutos desde ahora

        return {
            patientName: patientName,
            documentNumber: documentNumber,
            specialty: specialty || 'Medicina General',
            clinic: clinic.name,
            address: clinic.address,
            phone: clinic.emergencyPhone,
            emergencyCode: emergencyCode,
            arrivalTime: this.formatDateTime(arrivalTime),
            status: 'urgencia activada',
            instructions: 'DirÃ­jase inmediatamente. El personal mÃ©dico ya estÃ¡ informado de su llegada.'
        };
    }

    formatDate(date) {
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const dayNames = ['domingo', 'lunes', 'martes', 'miÃ©rcoles', 'jueves', 'viernes', 'sÃ¡bado'];

        const dayName = dayNames[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${dayName} ${day} de ${month} de ${year}`;
    }

    formatDateTime(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');

        return `${day}/${month}/${year} a las ${displayHours}:${displayMinutes} ${ampm}`;
    }

    normalizeSpecialty(specialty) {
        const specialtyMap = {
            'odontologia': 'odontologia',
            'odontÃ³logo': 'odontologia',
            'odontologo': 'odontologia',
            'dental': 'odontologia',
            'diente': 'odontologia',
            'cardiologia': 'cardiologia',
            'cardiÃ³logo': 'cardiologia',
            'corazÃ³n': 'cardiologia',
            'pediatria': 'pediatria',
            'pediatra': 'pediatria',
            'niÃ±o': 'pediatria',
            'ginecologia': 'ginecologia',
            'ginecÃ³logo': 'ginecologia',
            'ginecologo': 'ginecologia',
            'dermatologia': 'dermatologia',
            'dermatÃ³logo': 'dermatologia',
            'piel': 'dermatologia',
            'ortopedia': 'ortopedia',
            'ortopedista': 'ortopedia',
            'hueso': 'ortopedia'
        };

        const lowerSpecialty = specialty.toLowerCase();
        for (const [key, value] of Object.entries(specialtyMap)) {
            if (lowerSpecialty.includes(key)) {
                return value;
            }
        }
        return 'medicina_general';
    }

    getNextDayOfWeek(dayOfWeek) {
        const days = {
            'lunes': 1, 'martes': 2, 'miÃ©rcoles': 3, 'miercoles': 3,
            'jueves': 4, 'viernes': 5, 'sÃ¡bado': 6, 'sabado': 6, 'domingo': 0
        };

        const today = new Date();
        const currentDay = today.getDay();
        const targetDay = days[dayOfWeek.toLowerCase()] || 6; // Default: sÃ¡bado

        let daysUntilTarget = targetDay - currentDay;
        if (daysUntilTarget <= 0) {
            daysUntilTarget += 7; // Si ya pasÃ³, buscar el prÃ³ximo
        }

        const appointmentDate = new Date(today);
        appointmentDate.setDate(today.getDate() + daysUntilTarget);

        // Formatear fecha en espaÃ±ol
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const dayNames = ['domingo', 'lunes', 'martes', 'miÃ©rcoles', 'jueves', 'viernes', 'sÃ¡bado'];

        const dayName = dayNames[appointmentDate.getDay()];
        const day = appointmentDate.getDate();
        const month = months[appointmentDate.getMonth()];
        const year = appointmentDate.getFullYear();

        return `${dayName} ${day} de ${month} de ${year}`;
    }

    getWelcomeMessage() {
        switch (this.currentServiceType) {
            case 'confirmacion':
                return 'ðŸ¥ Carolina lista para confirmar sus citas - Departamento ColsÃ¡nitas';
            case 'prioritaria':
                return 'âš¡ AtenciÃ³n Prioritaria activada - Carolina gestionando citas urgentes';
            case 'urgencia':
                return 'ðŸš¨ Protocolo de Urgencias - Carolina coordinando atenciÃ³n inmediata';
            default:
                return 'ðŸ¥ Carolina lista para confirmar sus citas - Departamento ColsÃ¡nitas';
        }
    }

    getInitialGreeting() {
        switch (this.currentServiceType) {
            case 'confirmacion':
                return 'Buenos dÃ­as, habla Carolina MÃ©ndez del departamento de confirmaciones de ColsÃ¡nitas. Â¿En quÃ© puedo ayudarle con su cita mÃ©dica?';
            case 'prioritaria':
                return 'Buenos dÃ­as, habla Carolina MÃ©ndez del departamento de atenciÃ³n prioritaria de ColsÃ¡nitas. Entiendo que necesita una cita con urgencia. Por favor, cuÃ©nteme quÃ© especialidad necesita y su situaciÃ³n para coordinarle la atenciÃ³n lo antes posible.';
            case 'urgencia':
                return 'Buenos dÃ­as, habla Carolina MÃ©ndez, protocolo de urgencias de ColsÃ¡nitas. Estoy aquÃ­ para coordinar su atenciÃ³n mÃ©dica inmediata. Por favor, indÃ­queme su nombre, nÃºmero de documento y su ubicaciÃ³n actual para dirigirle al centro mÃ¡s cercano.';
            default:
                return 'Buenos dÃ­as, habla Carolina MÃ©ndez del departamento de confirmaciones de ColsÃ¡nitas. Â¿En quÃ© puedo ayudarle con su cita mÃ©dica?';
        }
    }

    // === CONVERSIÃ“N PERFECTA DE NÃšMEROS A ESPAÃ‘OL ===
    numberToSpanishWords(number) {
        if (number === 0) return 'cero';
        if (number === 100) return 'cien';

        const ones = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
        const teens = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'diecisÃ©is', 'diecisiete', 'dieciocho', 'diecinueve'];
        const tens = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
        const hundreds = ['', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

        if (number < 10) return ones[number];

        if (number < 20) return teens[number - 10];

        if (number < 30) {
            return number === 20 ? 'veinte' : 'veinti' + ones[number % 10];
        }

        if (number < 100) {
            return tens[Math.floor(number / 10)] + (number % 10 > 0 ? ' y ' + ones[number % 10] : '');
        }

        if (number < 1000) {
            const hundred = Math.floor(number / 100);
            const remainder = number % 100;
            let result = hundreds[hundred];
            if (hundred === 1 && remainder > 0) result = 'ciento';
            return result + (remainder > 0 ? ' ' + this.numberToSpanishWords(remainder) : '');
        }

        if (number < 1000000) {
            const thousands = Math.floor(number / 1000);
            const remainder = number % 1000;
            let thousandsText;
            if (thousands === 1) {
                thousandsText = 'mil';
            } else {
                thousandsText = this.numberToSpanishWords(thousands) + ' mil';
            }
            return thousandsText + (remainder > 0 ? ' ' + this.numberToSpanishWords(remainder) : '');
        }

        // Millones
        const millions = Math.floor(number / 1000000);
        const remainder = number % 1000000;
        const millionsText = millions === 1 ? 'un millÃ³n' : this.numberToSpanishWords(millions) + ' millones';
        return millionsText + (remainder > 0 ? ' ' + this.numberToSpanishWords(remainder) : '');
    }

    // === OPTIMIZACIÃ“N PARA ELEVENLABS ===
    optimizeForElevenLabs(text) {
        let optimized = text;

        // Reemplazar abreviaciones mÃ©dicas por formas completas
        optimized = optimized.replace(/\bDr\.\s+/g, 'doctor ');
        optimized = optimized.replace(/\bDra\.\s+/g, 'doctora ');
        optimized = optimized.replace(/\bDr\s+/g, 'doctor ');
        optimized = optimized.replace(/\bDra\s+/g, 'doctora ');

        // Convertir horas en formato 12h AM/PM a palabras en espaÃ±ol
        optimized = optimized.replace(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)/g, (match, hour, minutes, period) => {
            const h = parseInt(hour);
            const m = parseInt(minutes);
            const isPM = period.toUpperCase() === 'PM';

            let hourText;
            if (h === 12) {
                hourText = isPM ? 'doce' : 'doce';
            } else if (h === 0 || h === 12) {
                hourText = 'doce';
            } else {
                hourText = this.numberToSpanishWords(isPM && h !== 12 ? h : (h === 0 ? 12 : h));
            }

            let minutesText = '';
            if (m > 0) {
                minutesText = m === 30 ? ' y media' : ` y ${this.numberToSpanishWords(m)}`;
            }

            const timeOfDay = isPM ? (h >= 1 && h < 7 ? 'de la tarde' : 'de la noche') : 'de la maÃ±ana';

            return `${hourText}${minutesText} ${timeOfDay}`;
        });

        // Convertir horas en formato 24h a palabras
        optimized = optimized.replace(/(\d{1,2}):(\d{2})/g, (match, hour, minutes) => {
            const h = parseInt(hour);
            const m = parseInt(minutes);

            let hourText, timeOfDay;
            if (h === 0) {
                hourText = 'doce';
                timeOfDay = 'de la noche';
            } else if (h < 12) {
                hourText = this.numberToSpanishWords(h);
                timeOfDay = 'de la maÃ±ana';
            } else if (h === 12) {
                hourText = 'doce';
                timeOfDay = 'del mediodÃ­a';
            } else if (h < 20) {
                hourText = this.numberToSpanishWords(h);
                timeOfDay = 'de la tarde';
            } else {
                hourText = this.numberToSpanishWords(h - 12);
                timeOfDay = 'de la noche';
            }

            let minutesText = '';
            if (m > 0) {
                minutesText = m === 30 ? ' y media' : ` y ${this.numberToSpanishWords(m)}`;
            }

            return `${hourText}${minutesText} ${timeOfDay}`;
        });

        // Fechas en formato DD/MM/YYYY
        optimized = optimized.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/g, (match, day, month, year) => {
            return `el ${this.numberToSpanishWords(parseInt(day))} del ${this.numberToSpanishWords(parseInt(month))} del ${this.numberToSpanishWords(parseInt(year))}`;
        });

        // NÃºmeros de cÃ©dula y telÃ©fonos (decirlos dÃ­gito por dÃ­gito)
        optimized = optimized.replace(/(\d{8,11})/g, (match, number) => {
            return number.split('').map(d => this.numberToSpanishWords(parseInt(d))).join(' ');
        });

        // CÃ³digos mÃ©dicos (decirlos letra por letra y nÃºmero por nÃºmero)
        optimized = optimized.replace(/([A-Z]{2,}-\d+)/g, (match) => {
            return match.split('').map(char => {
                if (/[A-Z]/.test(char)) {
                    return char.toLowerCase() === 'a' ? 'a' :
                        char.toLowerCase() === 'b' ? 'be' :
                            char.toLowerCase() === 'c' ? 'ce' :
                                char.toLowerCase() === 'd' ? 'de' :
                                    char.toLowerCase() === 'e' ? 'e' :
                                        char.toLowerCase() === 'f' ? 'efe' :
                                            char.toLowerCase() === 'g' ? 'ge' :
                                                char.toLowerCase() === 'h' ? 'hache' :
                                                    char.toLowerCase() === 'i' ? 'i' :
                                                        char.toLowerCase() === 'j' ? 'jota' :
                                                            char.toLowerCase() === 'k' ? 'ka' :
                                                                char.toLowerCase() === 'l' ? 'ele' :
                                                                    char.toLowerCase() === 'm' ? 'eme' :
                                                                        char.toLowerCase() === 'n' ? 'ene' :
                                                                            char.toLowerCase() === 'o' ? 'o' :
                                                                                char.toLowerCase() === 'p' ? 'pe' :
                                                                                    char.toLowerCase() === 'q' ? 'cu' :
                                                                                        char.toLowerCase() === 'r' ? 'erre' :
                                                                                            char.toLowerCase() === 's' ? 'ese' :
                                                                                                char.toLowerCase() === 't' ? 'te' :
                                                                                                    char.toLowerCase() === 'u' ? 'u' :
                                                                                                        char.toLowerCase() === 'v' ? 'uve' :
                                                                                                            char.toLowerCase() === 'w' ? 'doble u' :
                                                                                                                char.toLowerCase() === 'x' ? 'equis' :
                                                                                                                    char.toLowerCase() === 'y' ? 'ye' :
                                                                                                                        'zeta';
                } else if (/\d/.test(char)) {
                    return this.numberToSpanishWords(parseInt(char));
                }
                return char;
            }).join(' ');
        });

        // Reemplazar otras abreviaciones comunes
        optimized = optimized.replace(/\betc\./g, 'etcÃ©tera');
        optimized = optimized.replace(/\bvs\./g, 'versus');
        optimized = optimized.replace(/\bSr\./g, 'seÃ±or');
        optimized = optimized.replace(/\bSra\./g, 'seÃ±ora');
        optimized = optimized.replace(/\bSrta\./g, 'seÃ±orita');

        // Convertir signos de puntuaciÃ³n a palabras explÃ­citas
        // Puntos y comas (solo en contextos donde sea necesario)
        optimized = optimized.replace(/\.\s+/g, ' punto ');
        optimized = optimized.replace(/,\s+/g, ' coma ');
        optimized = optimized.replace(/;\s+/g, ' punto y coma ');
        optimized = optimized.replace(/:\s+/g, ' dos puntos ');

        // Signos de interrogaciÃ³n y exclamaciÃ³n
        optimized = optimized.replace(/\?/g, ' signo de interrogaciÃ³n ');
        optimized = optimized.replace(/!/g, ' signo de exclamaciÃ³n ');

        // Guiones y rayas
        optimized = optimized.replace(/-\s+/g, ' guion ');
        optimized = optimized.replace(/\s+-/g, ' guion ');
        optimized = optimized.replace(/â€”/g, ' raya ');

        // ParÃ©ntesis (convertir contenido)
        optimized = optimized.replace(/\(([^)]+)\)/g, ' entre parÃ©ntesis $1 cierra parÃ©ntesis ');

        // Corchetes
        optimized = optimized.replace(/\[([^\]]+)\]/g, ' entre corchetes $1 cierra corchetes ');

        // Comillas
        optimized = optimized.replace(/"([^"]+)"/g, ' comillas $1 cierra comillas ');
        optimized = optimized.replace(/'([^']+)'/g, ' comillas $1 cierra comillas ');

        // Porcentajes
        optimized = optimized.replace(/(\d+)%/g, '$1 por ciento');

        // SÃ­mbolos matemÃ¡ticos comunes
        optimized = optimized.replace(/\+/g, ' mÃ¡s ');
        optimized = optimized.replace(/=/g, ' igual ');

        // Limpiar espacios mÃºltiples
        optimized = optimized.replace(/\s+/g, ' ').trim();

        return optimized;
    }

    // === CONTROL DE ESTADOS ===
    updateCallStatus(message, type) {
        this.callStatus.textContent = message;
        this.callStatus.className = `call-status ${type}`;
    }

    updateMicrophoneStatus(active) {
        this.isMicrophoneActive = active;
        this.micStatusEl.textContent = active ? 'ON' : 'OFF';
        this.micIndicator.className = `microphone-indicator ${active ? 'active' : ''}`;
    }

    updateCarolinaStatus(status) {
        this.carolinaStatusEl.textContent = status;
    }

    updateStats() {
        this.interactionsEl.textContent = this.interactionCount;
    }

    updateCRMDashboard() {
        this.totalPatientsEl.textContent = this.patientsDatabase.length;

        const today = new Date().toDateString();
        const callsToday = this.callsDatabase.filter(call =>
            new Date(call.date).toDateString() === today
        ).length;
        this.callsTodayEl.textContent = callsToday;

        const confirmedCalls = this.callsDatabase.filter(call => call.result === 'confirmed').length;
        const confirmationRate = this.callsDatabase.length > 0
            ? Math.round((confirmedCalls / this.callsDatabase.length) * 100)
            : 0;
        this.confirmationRateEl.textContent = `${confirmationRate}%`;

        const thisMonth = new Date().getMonth();
        const appointmentsThisMonth = this.callsDatabase
            .filter(call => new Date(call.date).getMonth() === thisMonth)
            .length;
        this.appointmentsMonthEl.textContent = appointmentsThisMonth;
    }

    // === CONFIGURACIÃ“N DE EVENTOS ===
    setupEventListeners() {
        this.callButton.addEventListener('click', () => {
            if (this.isCallActive) {
                this.endCall();
            } else {
                this.startCall();
            }
        });

        this.volumeButton.addEventListener('click', () => {
            this.toggleVolume();
        });

        this.stopButton.addEventListener('click', () => {
            this.stopAudio();
        });
    }

    // === RECONOCIMIENTO DE VOZ ===
    async initializeVoiceRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.error('âŒ Reconocimiento de voz no soportado');
            return;
        }

        // Solicitar permisos del micrÃ³fono si estÃ¡n disponibles
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                console.log('âœ… Permisos del micrÃ³fono otorgados');
            } catch (error) {
                console.warn('âš ï¸ No se pudieron obtener permisos del micrÃ³fono:', error);
                // Continuar de todas formas, algunos navegadores no requieren esto
            }
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'es-CO';
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
            console.log('ðŸŽ¤ Reconocimiento iniciado');
            this.updateMicrophoneStatus(true);
            this.updateCallStatus('ðŸŽ§ Carolina escucha - Habla cuando quiera', 'listening');
            this.finalTranscript = '';
            this.interimTranscript = '';
        };

        this.recognition.onresult = (event) => {
            this.interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    this.finalTranscript += transcript + ' ';
                } else {
                    this.interimTranscript += transcript;
                }
            }

            const currentText = this.finalTranscript + this.interimTranscript;
            if (currentText.trim()) {
                this.transcript.textContent = `ðŸŽ¤ "${currentText.trim()}"`;
            }

            clearTimeout(this.silenceTimer);
            this.silenceTimer = setTimeout(() => {
                if (this.finalTranscript.trim()) {
                    this.processUserInput();
                }
            }, 1500);
        };

        this.recognition.onerror = (event) => {
            console.warn('âŒ Error reconocimiento:', event.error);
            clearTimeout(this.silenceTimer);
            this.updateMicrophoneStatus(false);

            // Errores que no requieren reintento
            if (event.error === 'aborted') {
                console.log('â„¹ï¸ Reconocimiento abortado (normal)');
                return;
            }

            if (event.error === 'no-speech') {
                console.log('â„¹ï¸ No se detectÃ³ habla (normal)');
                // Reactivar si la llamada sigue activa
                if (this.isCallActive && !this.isCarolinaSpeaking && !this.isProcessingResponse) {
                    setTimeout(() => this.activateMicrophone(), 500);
                }
                return;
            }

            // Para otros errores, intentar reactivar
            if (this.isCallActive && !this.isCarolinaSpeaking && !this.isProcessingResponse) {
                console.log('ðŸ”„ Reintentando reconocimiento despuÃ©s de error...');
                setTimeout(() => this.activateMicrophone(), 1000);
            }
        };

        this.recognition.onend = () => {
            console.log('ðŸ”š Reconocimiento terminado');
            this.updateMicrophoneStatus(false);

            if (this.finalTranscript.trim()) {
                this.processUserInput();
            } else if (this.isCallActive && !this.isCarolinaSpeaking && !this.isProcessingResponse) {
                // Esperar un poco mÃ¡s antes de reactivar para evitar conflictos
                setTimeout(() => {
                    if (this.isCallActive && !this.isCarolinaSpeaking && !this.isProcessingResponse && !this.isMicrophoneActive) {
                        this.activateMicrophone();
                    }
                }, 800);
            }
        };
    }

    // === CONTROL DE MICRÃ“FONO ===
    activateMicrophone() {
        if (!this.isCallActive || this.isCarolinaSpeaking || this.isProcessingResponse) {
            console.log('â¸ï¸ MicrÃ³fono no activado - condiciones no cumplidas:', {
                isCallActive: this.isCallActive,
                isCarolinaSpeaking: this.isCarolinaSpeaking,
                isProcessingResponse: this.isProcessingResponse
            });
            return;
        }

        if (!this.recognition) {
            console.error('âŒ Reconocimiento no inicializado');
            return;
        }

        // Verificar el estado del reconocimiento antes de iniciar
        const state = this.recognition.state || 'unknown';
        if (state === 'listening' || state === 'starting') {
            console.log('âœ… MicrÃ³fono ya estÃ¡ activo, estado:', state);
            this.updateMicrophoneStatus(true);
            return;
        }

        console.log('ðŸŽ¤ Activando micrÃ³fono... Estado actual:', state);

        try {
            this.recognition.start();
            console.log('âœ… Comando start() enviado al reconocimiento');
        } catch (error) {
            console.error('âŒ Error activando micrÃ³fono:', error.name, error.message);

            // Si el error es porque ya estÃ¡ activo, actualizar estado
            if (error.name === 'InvalidStateError') {
                console.log('âš ï¸ Reconocimiento ya estaba activo, actualizando estado');
                this.updateMicrophoneStatus(true);
            } else {
                // Para otros errores, reintentar despuÃ©s de un tiempo
                console.log('ðŸ”„ Reintentando activaciÃ³n en 1 segundo...');
                setTimeout(() => {
                    if (this.isCallActive && !this.isCarolinaSpeaking && !this.isProcessingResponse) {
                        this.activateMicrophone();
                    }
                }, 1000);
            }
        }
    }

    deactivateMicrophone() {
        console.log('ðŸ”‡ Desactivando micrÃ³fono...');

        clearTimeout(this.silenceTimer);
        clearTimeout(this.microphoneTimer);

        this.updateMicrophoneStatus(false);

        if (this.recognition) {
            try {
                this.recognition.stop();
            } catch (e) {
                // Ignorar errores
            }
        }

        this.finalTranscript = '';
        this.interimTranscript = '';
    }

    // === PROCESAMIENTO DE ENTRADA DEL USUARIO ===
    async processUserInput() {
        const userMessage = this.finalTranscript.trim();
        if (!userMessage) return;

        console.log('ðŸ§  Procesando:', userMessage);

        this.deactivateMicrophone();
        this.addToConversation(userMessage, 'patient');
        this.interactionCount++;
        this.updateStats();

        this.isProcessingResponse = true;
        this.updateCallStatus('âš¡ Carolina procesando consulta mÃ©dica...', 'processing');
        this.updateCarolinaStatus('Procesando');

        const startTime = performance.now();

        try {
            const response = await this.generateMedicalResponse(userMessage);
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);

            this.responseTimeEl.textContent = `${responseTime}ms`;
            this.addToConversation(response, 'carolina');

            this.isProcessingResponse = false;

            // Detectar si es cierre de gestiÃ³n mÃ©dica
            if (this.isEndOfServiceMessage(response)) {
                this.saveCallToDatabase();
                setTimeout(() => this.endCall(), 3000);
            } else {
                await this.speak(response);
            }

        } catch (error) {
            console.error('âŒ Error generando respuesta:', error);
            this.isProcessingResponse = false;
            const fallbackResponse = this.getFallbackMedicalResponse();
            this.addToConversation(fallbackResponse, 'carolina');
            await this.speak(fallbackResponse);
        }
    }

    // === LISTAR MODELOS DISPONIBLES ===
    async listAvailableModels() {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${this.GEMINI_API_KEY}`);
            if (response.ok) {
                const data = await response.json();
                console.log('ðŸ“‹ Modelos disponibles:', data.models?.map(m => m.name) || []);
                return data.models || [];
            }
        } catch (error) {
            console.warn('âš ï¸ No se pudieron listar modelos:', error);
        }
        return [];
    }

    // === EXTRACCIÃ“N DE INFORMACIÃ“N DEL MENSAJE ===
    extractAppointmentInfo(userMessage, conversationHistory) {
        let patientName = null;
        let documentNumber = null;
        let specialty = null;
        let dayOfWeek = null;

        // Buscar nombre y documento en el historial y mensaje actual
        const allMessages = conversationHistory.map(m => m.message).join(' ') + ' ' + userMessage;
        const fullText = allMessages.toLowerCase();

        // Extraer nÃºmero de documento (formato colombiano: 8-11 dÃ­gitos, puede tener espacios)
        const docPatterns = [
            /(?:documento|cedula|cÃ©dula|identificaciÃ³n|identificacion|numero|nÃºmero)[\s:]*(\d{1,3}(?:\s?\d{3}){2,3})/i,
            /(\d{8,11})/g
        ];

        for (const pattern of docPatterns) {
            const match = allMessages.match(pattern);
            if (match) {
                documentNumber = match[1].replace(/\s/g, ''); // Quitar espacios
                break;
            }
        }

        // Extraer nombre (patrones comunes, buscar en texto original para mantener mayÃºsculas)
        const namePatterns = [
            /(?:mi nombre (?:es|completo es|es completo) |me llamo |soy |nombre completo:?\s*)([A-ZÃÃ‰ÃÃ“ÃšÃ‘][a-zÃ¡Ã©Ã­Ã³ÃºÃ±]+(?:\s+[A-ZÃÃ‰ÃÃ“ÃšÃ‘][a-zÃ¡Ã©Ã­Ã³ÃºÃ±]+)+)/i,
            /(?:nombre:?\s*)([A-ZÃÃ‰ÃÃ“ÃšÃ‘][a-zÃ¡Ã©Ã­Ã³ÃºÃ±]+(?:\s+[A-ZÃÃ‰ÃÃ“ÃšÃ‘][a-zÃ¡Ã©Ã­Ã³ÃºÃ±]+)+)/i,
            /([A-ZÃÃ‰ÃÃ“ÃšÃ‘][a-zÃ¡Ã©Ã­Ã³ÃºÃ±]+\s+[A-ZÃÃ‰ÃÃ“ÃšÃ‘][a-zÃ¡Ã©Ã­Ã³ÃºÃ±]+\s+[A-ZÃÃ‰ÃÃ“ÃšÃ‘][a-zÃ¡Ã©Ã­Ã³ÃºÃ±]+)/ // Tres palabras con mayÃºscula
        ];

        for (const pattern of namePatterns) {
            const match = allMessages.match(pattern);
            if (match && match[1].split(' ').length >= 2) {
                patientName = match[1].trim();
                break;
            }
        }

        // Extraer especialidad (buscar variaciones)
        const specialtyMap = {
            'odontologia': ['odontologia', 'odontÃ³logo', 'odontologo', 'dental', 'diente', 'dientes', 'odontologÃ­a'],
            'cardiologia': ['cardiologia', 'cardiÃ³logo', 'cardiaco', 'corazÃ³n', 'corazon', 'cardiologÃ­a'],
            'pediatria': ['pediatria', 'pediatra', 'niÃ±o', 'niÃ±os', 'niÃ±a', 'niÃ±as', 'pediatrÃ­a'],
            'ginecologia': ['ginecologia', 'ginecÃ³logo', 'ginecologo', 'ginecologÃ­a'],
            'dermatologia': ['dermatologia', 'dermatÃ³logo', 'dermatologo', 'piel', 'dermatologÃ­a'],
            'ortopedia': ['ortopedia', 'ortopedista', 'hueso', 'huesos', 'fractura']
        };

        for (const [spec, keywords] of Object.entries(specialtyMap)) {
            for (const keyword of keywords) {
                if (fullText.includes(keyword)) {
                    specialty = spec;
                    break;
                }
            }
            if (specialty) break;
        }

        // Extraer dÃ­a de la semana (buscar variaciones)
        const dayMap = {
            'lunes': ['lunes'],
            'martes': ['martes'],
            'miÃ©rcoles': ['miÃ©rcoles', 'miercoles'],
            'jueves': ['jueves'],
            'viernes': ['viernes'],
            'sÃ¡bado': ['sÃ¡bado', 'sabado'],
            'domingo': ['domingo']
        };

        for (const [day, keywords] of Object.entries(dayMap)) {
            for (const keyword of keywords) {
                if (fullText.includes(keyword)) {
                    dayOfWeek = day;
                    break;
                }
            }
            if (dayOfWeek) break;
        }

        // Si tenemos suficiente informaciÃ³n, simular bÃºsqueda de cita
        if (patientName && documentNumber) {
            // Para urgencias y prioritarias, no necesitamos dÃ­a de la semana
            if (this.currentServiceType === 'urgencia' || this.currentServiceType === 'prioritaria') {
                if (patientName && documentNumber) {
                    console.log('ðŸ“‹ InformaciÃ³n extraÃ­da:', { patientName, documentNumber, specialty });
                    return this.simulateAppointmentSearch(patientName, documentNumber, specialty, null, this.currentServiceType);
                }
            } else {
                // Para confirmaciones normales, necesitamos dÃ­a de la semana
                if (patientName && documentNumber && specialty && dayOfWeek) {
                    console.log('ðŸ“‹ InformaciÃ³n extraÃ­da:', { patientName, documentNumber, specialty, dayOfWeek });
                    return this.simulateAppointmentSearch(patientName, documentNumber, specialty, dayOfWeek, this.currentServiceType);
                }
            }
        }

        return null;
    }

    // === EXTRACCIÃ“N DE INFORMACIÃ“N DE URGENCIA ===
    extractEmergencyInfo(userMessage, conversationHistory) {
        let patientName = null;
        let documentNumber = null;
        let specialty = null;
        let location = null;

        // Buscar informaciÃ³n en el historial y mensaje actual
        const allMessages = conversationHistory.map(m => m.message).join(' ') + ' ' + userMessage;
        const fullText = allMessages.toLowerCase();

        // Extraer nÃºmero de documento
        // Primero intentar con patrÃ³n especÃ­fico (con grupos)
        const specificDocPattern = /(?:documento|cedula|cÃ©dula|identificaciÃ³n|identificacion|numero|nÃºmero)[\s:]*(\d{1,3}(?:\s?\d{3}){2,3})/i;
        const specificMatch = allMessages.match(specificDocPattern);
        if (specificMatch && specificMatch[1]) {
            documentNumber = specificMatch[1].replace(/\s/g, '');
        } else {
            // Si no encuentra con patrÃ³n especÃ­fico, buscar cualquier nÃºmero de 8-11 dÃ­gitos
            const generalDocPattern = /(\d{8,11})/;
            const generalMatch = allMessages.match(generalDocPattern);
            if (generalMatch && generalMatch[1]) {
                documentNumber = generalMatch[1].replace(/\s/g, '');
            }
        }

        // Extraer nombre
        const namePatterns = [
            /(?:mi nombre (?:es|completo es|es completo) |me llamo |soy |nombre completo:?\s*)([A-ZÃÃ‰ÃÃ“ÃšÃ‘][a-zÃ¡Ã©Ã­Ã³ÃºÃ±]+(?:\s+[A-ZÃÃ‰ÃÃ“ÃšÃ‘][a-zÃ¡Ã©Ã­Ã³ÃºÃ±]+)+)/i,
            /(?:nombre:?\s*)([A-ZÃÃ‰ÃÃ“ÃšÃ‘][a-zÃ¡Ã©Ã­Ã³ÃºÃ±]+(?:\s+[A-ZÃÃ‰ÃÃ“ÃšÃ‘][a-zÃ¡Ã©Ã­Ã³ÃºÃ±]+)+)/i
        ];

        for (const pattern of namePatterns) {
            const match = allMessages.match(pattern);
            if (match && match[1] && match[1].split(' ').length >= 2) {
                patientName = match[1].trim();
                break;
            }
        }

        // Extraer especialidad si se menciona
        const specialtyMap = {
            'odontologia': ['odontologia', 'odontÃ³logo', 'dental'],
            'cardiologia': ['cardiologia', 'cardiÃ³logo', 'corazÃ³n'],
            'pediatria': ['pediatria', 'pediatra', 'niÃ±o'],
            'ginecologia': ['ginecologia', 'ginecÃ³logo'],
            'dermatologia': ['dermatologia', 'dermatÃ³logo'],
            'ortopedia': ['ortopedia', 'ortopedista']
        };

        for (const [spec, keywords] of Object.entries(specialtyMap)) {
            for (const keyword of keywords) {
                if (fullText.includes(keyword)) {
                    specialty = spec;
                    break;
                }
            }
            if (specialty) break;
        }

        // Extraer ubicaciÃ³n si se menciona (incluyendo municipios)
        const locationKeywords = ['bogotÃ¡', 'bogota', 'medellÃ­n', 'medellin', 'cali', 'barranquilla',
            'norte', 'sur', 'centro', 'mosquera', 'cundinamarca', 'soacha', 'chia'];
        for (const keyword of locationKeywords) {
            if (fullText.includes(keyword)) {
                location = keyword;
                break;
            }
        }

        // Si tenemos informaciÃ³n mÃ­nima, generar respuesta de urgencia
        if (patientName && documentNumber) {
            console.log('ðŸš¨ InformaciÃ³n de urgencia extraÃ­da:', { patientName, documentNumber, specialty, location });
            return this.simulateEmergencyResponse(patientName, documentNumber, specialty, location);
        }

        return null;
    }

    // === GENERACIÃ“N DE RESPUESTA MÃ‰DICA ===
    async generateMedicalResponse(userMessage) {
        const systemPrompt = this.getMedicalSystemPrompt();

        // Usando solo gemini-2.5-flash-lite para optimizar tiempo de respuesta
        // VersiÃ³n ligera y rÃ¡pida del modelo
        const modelConfigs = [
            { version: 'v1beta', model: 'gemini-2.5-flash-lite' },
            { version: 'v1', model: 'gemini-2.5-flash-lite' },
        ];

        // Construir el historial de conversaciÃ³n para contexto
        let conversationContext = '';
        if (this.conversationHistory.length > 0) {
            // Incluir las Ãºltimas 6 interacciones para contexto (3 turnos de cada uno)
            const recentHistory = this.conversationHistory.slice(-6);
            conversationContext = recentHistory.map(msg => {
                const role = msg.speaker === 'patient' ? 'Paciente' : 'Carolina';
                return `${role}: ${msg.message}`;
            }).join('\n') + '\n\n';
        }

        // Intentar extraer informaciÃ³n segÃºn el tipo de servicio
        let appointmentContext = '';

        if (this.currentServiceType === 'urgencia') {
            // Para urgencias, buscar informaciÃ³n mÃ­nima y generar respuesta de emergencia
            const emergencyInfo = this.extractEmergencyInfo(userMessage, this.conversationHistory);
            if (emergencyInfo) {
                appointmentContext = `\n\nINFORMACIÃ“N DE URGENCIA MÃ‰DICA (usa estos datos exactos):
- Nombre del paciente: ${emergencyInfo.patientName}
- NÃºmero de documento: ${emergencyInfo.documentNumber}
- CÃ³digo de urgencia: ${emergencyInfo.emergencyCode}
- ClÃ­nica asignada: ${emergencyInfo.clinic}
- DirecciÃ³n: ${emergencyInfo.address}
- TelÃ©fono de urgencias: ${emergencyInfo.phone}
- Hora de llegada estimada: ${emergencyInfo.arrivalTime}
- Instrucciones: ${emergencyInfo.instructions}

IMPORTANTE: Proporciona TODA esta informaciÃ³n de forma clara y urgente. El paciente debe dirigirse INMEDIATAMENTE.`;
            }
        } else {
            // Para confirmaciones y prioritarias, extraer informaciÃ³n completa de cita
            const appointmentInfo = this.extractAppointmentInfo(userMessage, this.conversationHistory);
            if (appointmentInfo) {
                appointmentContext = `\n\nINFORMACIÃ“N DE LA CITA DEL PACIENTE (usa estos datos exactos, NO uses placeholders):
- Nombre del paciente: ${appointmentInfo.patientName}
- NÃºmero de documento: ${appointmentInfo.documentNumber}
- Especialidad: ${appointmentInfo.specialty}
- Doctor asignado: ${appointmentInfo.doctor}
- ClÃ­nica: ${appointmentInfo.clinic}
- Fecha: ${appointmentInfo.date}
- Hora: ${appointmentInfo.time}
- Estado: ${appointmentInfo.status}
- ID de cita: ${appointmentInfo.appointmentId}

IMPORTANTE: Cuando confirmes la cita, usa EXACTAMENTE estos datos. NO uses placeholders como [insertar fecha] o [insertar hora]. Di la fecha completa, la hora exacta y el nombre completo del doctor.`;
            }
        }

        const requestBody = {
            contents: [{
                parts: [{
                    text: `${systemPrompt}${appointmentContext}

${conversationContext}Paciente: ${userMessage}

Carolina:`
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        };

        // Intentar con cada configuraciÃ³n hasta que una funcione
        for (const config of modelConfigs) {
            try {
                // Probar primero con API key en query parameter
                let endpoint = `https://generativelanguage.googleapis.com/${config.version}/models/${config.model}:generateContent?key=${this.GEMINI_API_KEY}`;
                let headers = {
                    'Content-Type': 'application/json',
                };

                console.log(`ðŸ”„ Intentando con modelo: ${config.model} (${config.version})`);
                console.log(`ðŸ“ Endpoint: ${endpoint.replace(this.GEMINI_API_KEY, 'API_KEY_HIDDEN')}`);

                let response = await fetch(endpoint, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(requestBody),
                });

                // Si falla con 404, probar con API key en header
                if (!response.ok && response.status === 404) {
                    console.log(`ðŸ”„ Probando con API key en header...`);
                    endpoint = `https://generativelanguage.googleapis.com/${config.version}/models/${config.model}:generateContent`;
                    headers = {
                        'Content-Type': 'application/json',
                        'x-goog-api-key': this.GEMINI_API_KEY,
                    };

                    response = await fetch(endpoint, {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify(requestBody),
                    });
                }

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const errorMessage = errorData.error?.message || errorData.message || 'Unknown error';
                    console.warn(`âŒ Error con ${config.model} (${config.version}):`, response.status);
                    console.warn(`ðŸ“ Mensaje de error:`, errorMessage);
                    console.warn(`ðŸ“‹ Detalles completos:`, errorData);

                    // Si es 404, probar siguiente modelo
                    if (response.status === 404) {
                        continue;
                    }

                    // Para otros errores, lanzar excepciÃ³n
                    throw new Error(`Gemini API error: ${response.status} - ${errorMessage}`);
                }

                const data = await response.json();

                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    console.log(`âœ… Ã‰xito con modelo: ${config.model} (${config.version})`);
                    return data.candidates[0].content.parts[0].text.trim();
                } else {
                    console.error('Respuesta invÃ¡lida de Gemini:', data);
                    continue; // Probar siguiente modelo
                }

            } catch (error) {
                // Si no es un error de red, continuar con siguiente modelo
                if (error.message && error.message.includes('404')) {
                    console.warn(`âš ï¸ Modelo ${config.model} no disponible, probando siguiente...`);
                    continue;
                }

                // Si es el Ãºltimo modelo, lanzar el error
                if (config === modelConfigs[modelConfigs.length - 1]) {
                    console.error('âŒ Error con Gemini API:', error);
                    throw error;
                }
            }
        }

        // Si ningÃºn modelo funcionÃ³, usar respuesta de fallback
        console.warn('âš ï¸ NingÃºn modelo de Gemini funcionÃ³, usando respuesta de fallback');
        return this.getFallbackMedicalResponse();
    }

    getMedicalSystemPrompt() {
        const basePrompt = `Eres Carolina MÃ©ndez, especialista en confirmaciones de citas mÃ©dicas de ColsÃ¡nitas. Trabajas en el departamento de gestiÃ³n de citas mÃ©dicas y tu objetivo es ayudar a los pacientes con sus necesidades mÃ©dicas.

PROTOCOLO DE ATENCIÃ“N:
1. Saluda profesionalmente SOLO en la primera interacciÃ³n
2. Escucha atentamente la necesidad del paciente
3. Proporciona una SOLUCIÃ“N CONCRETA
4. NO repitas tu presentaciÃ³n si ya te presentaste anteriormente en la conversaciÃ³n
5. MantÃ©n el contexto de la conversaciÃ³n y continÃºa de forma natural
6. Cuando tengas informaciÃ³n de una cita confirmada, proporciona TODOS los detalles de forma clara y natural

Tu personalidad: Profesional, MUY EMPÃTICA, CARIÃ‘OSA, ATENTA, cÃ¡lida, comprensiva, eficiente, orientada a soluciones mÃ©dicas. Muestra genuino interÃ©s por el bienestar del paciente.

TONO Y ESTILO:
- SÃ© cÃ¡lida y cariÃ±osa en tu trato
- Muestra empatÃ­a y comprensiÃ³n
- Usa expresiones amables como "por supuesto", "con mucho gusto", "estoy aquÃ­ para ayudarle"
- Reconoce las preocupaciones del paciente
- Ofrece tranquilidad y confianza
- SÃ© paciente y comprensiva

IMPORTANTE: 
- Si ya te presentaste en mensajes anteriores, NO vuelvas a presentarte
- ContinÃºa la conversaciÃ³n de forma natural basÃ¡ndote en el contexto previo
- Siempre proporciona respuestas que sean SOLUCIONES PRÃCTICAS Y CONCRETAS
- Si se te proporciona informaciÃ³n de una cita (fecha, hora, doctor, clÃ­nica), ÃšSALA DIRECTAMENTE en tu respuesta
- NUNCA uses placeholders como [insertar fecha], [insertar hora] o [insertar nombre del doctor]
- Di la informaciÃ³n completa y real que se te proporciona
- Muestra siempre una actitud cariÃ±osa y atenta hacia el paciente`;

        switch (this.currentServiceType) {
            case 'confirmacion':
                return `${basePrompt}

MODO: CONFIRMACIÃ“N DE CITAS
- Verifica citas existentes
- Confirma fechas, horarios y especialistas
- Proporciona informaciÃ³n de preparativos
- EnvÃ­a recordatorios
- Soluciona problemas de confirmaciÃ³n

ESTILO ESPECÃFICO PARA CONFIRMACIÃ“N:
- SÃ© especialmente cariÃ±osa y atenta
- Reconoce la importancia de su cita mÃ©dica
- Ofrece tranquilidad sobre la confirmaciÃ³n
- Muestra interÃ©s genuino en ayudarle
- Usa expresiones como "con mucho gusto", "por supuesto", "estoy aquÃ­ para ayudarle"
- SÃ© paciente si el paciente tiene dudas o necesita aclaraciones

Ejemplo de respuesta: "Por supuesto, con mucho gusto le ayudo. He verificado su cita y me complace confirmarle que estÃ¡ programada para el viernes quince de marzo a las diez y media de la maÃ±ana con el doctor GarcÃ­a en CardiologÃ­a. Le enviaremos un recordatorio veinticuatro horas antes para que no se le olvide. Â¿Hay algo mÃ¡s en lo que pueda ayudarle o alguna duda que tenga sobre su cita?"`;

            case 'prioritaria':
                return `${basePrompt}

MODO: CITAS PRIORITARIAS
- EvalÃºa la urgencia mÃ©dica del paciente
- Coordina citas con prioridad (maÃ±ana o pasado maÃ±ana como mÃ¡ximo)
- Gestiona reprogramaciones rÃ¡pidas
- Contacta especialistas directamente
- Proporciona alternativas inmediatas
- Usa horarios prioritarios (mÃ¡s tempranos en el dÃ­a)

ESTILO ESPECÃFICO PARA CITAS PRIORITARIAS:
- SÃ© MUY empÃ¡tica y comprensiva con la situaciÃ³n del paciente
- Reconoce su preocupaciÃ³n y urgencia
- Tranquiliza al paciente asegurÃ¡ndole que se le darÃ¡ prioridad
- Muestra que entiendes la importancia de su situaciÃ³n
- SÃ© cariÃ±osa pero eficiente
- Ofrece apoyo y tranquilidad
- Usa expresiones como "entiendo perfectamente", "no se preocupe", "estoy aquÃ­ para ayudarle"

INSTRUCCIONES ESPECÃFICAS:
- Si se te proporciona informaciÃ³n de cita prioritaria, proporciona TODOS los detalles: fecha completa, hora exacta, doctor, clÃ­nica
- Confirma que la cita prioritaria estÃ¡ coordinada con calidez
- Menciona que se enviarÃ¡ confirmaciÃ³n por mensaje
- NUNCA uses placeholders, usa la informaciÃ³n exacta proporcionada
- Muestra que te importa su bienestar

Ejemplo de respuesta: "Entiendo perfectamente su situaciÃ³n y no se preocupe, estoy aquÃ­ para ayudarle. He coordinado una cita prioritaria con el doctor [nombre] para [fecha completa] a las [hora exacta] en [clÃ­nica]. Su cÃ³digo de cita es [ID]. Le enviaremos un mensaje de confirmaciÃ³n con todos los detalles para que tenga toda la informaciÃ³n. Â¿Hay algo mÃ¡s en lo que pueda ayudarle o alguna preocupaciÃ³n que tenga?"`;

            case 'urgencia':
                return `${basePrompt}

MODO: URGENCIAS MÃ‰DICAS
- Activa protocolos de emergencia INMEDIATAMENTE
- Coordina atenciÃ³n inmediata (dentro de 30 minutos)
- Dirige al centro mÃ©dico mÃ¡s cercano disponible 24 horas
- Proporciona cÃ³digos de referencia de urgencia
- Gestiona atenciÃ³n sin cita previa
- Proporciona direcciÃ³n completa y telÃ©fono de urgencias

ESTILO ESPECÃFICO PARA URGENCIAS:
- SÃ© MUY empÃ¡tica, cariÃ±osa y comprensiva con la situaciÃ³n del paciente
- Reconoce su preocupaciÃ³n y urgencia con calidez
- Tranquiliza al paciente asegurÃ¡ndole que se le darÃ¡ atenciÃ³n inmediata
- Muestra que te importa su bienestar y salud
- SÃ© clara y directa pero mantÃ©n un tono cariÃ±oso y calmante
- Ofrece apoyo emocional ademÃ¡s de la informaciÃ³n mÃ©dica
- Usa expresiones como "no se preocupe", "estamos aquÃ­ para ayudarle", "todo va a estar bien"
- Confirma que el personal mÃ©dico estÃ¡ preparado para recibirle

INSTRUCCIONES ESPECÃFICAS:
- Si se te proporciona informaciÃ³n de urgencia, proporciona TODOS los detalles: cÃ³digo de urgencia, clÃ­nica, direcciÃ³n completa, telÃ©fono, hora de llegada
- Confirma que el personal mÃ©dico ya estÃ¡ informado con calidez
- Instruye al paciente a dirigirse INMEDIATAMENTE pero de forma cariÃ±osa
- NUNCA uses placeholders, usa la informaciÃ³n exacta proporcionada
- Muestra preocupaciÃ³n genuina por su bienestar

Ejemplo de respuesta: "Entiendo su situaciÃ³n y no se preocupe, estamos aquÃ­ para ayudarle. He activado el protocolo de emergencia y el personal mÃ©dico ya estÃ¡ informado de su llegada. Por favor, dirÃ­jase INMEDIATAMENTE a [clÃ­nica] ubicada en [direcciÃ³n completa]. Su cÃ³digo de urgencia es [cÃ³digo]. El telÃ©fono de urgencias es [telÃ©fono]. La hora estimada de llegada es [hora]. Todo va a estar bien, el equipo mÃ©dico estÃ¡ preparado para atenderle. Â¿Tiene alguna pregunta o necesita algo mÃ¡s antes de dirigirse?"`;

            default:
                return basePrompt;
        }
    }

    getFallbackMedicalResponse() {
        switch (this.currentServiceType) {
            case 'confirmacion':
                return 'Disculpe, permÃ­tame verificar su informaciÃ³n en el sistema. Â¿PodrÃ­a proporcionarme su nÃºmero de cÃ©dula para confirmar su cita mÃ©dica?';
            case 'prioritaria':
                return 'Entiendo que necesita atenciÃ³n prioritaria. PermÃ­tame revisar la disponibilidad inmediata de especialistas. Â¿PodrÃ­a contarme brevemente cuÃ¡l es su situaciÃ³n mÃ©dica?';
            case 'urgencia':
                return 'Comprendo que es una urgencia mÃ©dica. Voy a activar el protocolo inmediatamente. Â¿PodrÃ­a decirme cuÃ¡l es su ubicaciÃ³n actual para dirigirle al centro mÃ¡s cercano?';
            default:
                return 'PermÃ­tame ayudarle con su consulta mÃ©dica. Â¿PodrÃ­a proporcionarme mÃ¡s detalles sobre lo que necesita?';
        }
    }

    isEndOfServiceMessage(message) {
        const endPatterns = [
            'gracias por contactar',
            'que tenga un buen dÃ­a',
            'cuidese mucho',
            'nos vemos en su cita',
            'hasta la prÃ³xima',
            'esperamos verle pronto'
        ];

        const lowerMessage = message.toLowerCase();
        return endPatterns.some(pattern => lowerMessage.includes(pattern));
    }

    // === SÃNTESIS DE VOZ ===
    async speak(text) {
        if (!text || this.volume === 0) return;

        const optimizedText = this.optimizeForElevenLabs(text);
        console.log('ðŸ—£ï¸ Carolina hablando:', optimizedText);

        this.isCarolinaSpeaking = true;
        this.updateCallStatus('ðŸ—£ï¸ Carolina respondiendo...', 'speaking');
        this.updateCarolinaStatus('Hablando');
        this.audioVisualizer.style.display = 'block';

        try {
            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.ELEVENLABS_VOICE_ID}`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': this.ELEVENLABS_API_KEY
                },
                body: JSON.stringify({
                    text: optimizedText,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: {
                        "stability": 0.7,
                        "similarity_boost": 0.8,
                        "style": 0.3,
                        "use_speaker_boost": true,
                        "speaking_rate": 1.3
                    }

                })
            });

            if (response.ok) {
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);

                this.currentAudio = new Audio(audioUrl);
                this.currentAudio.volume = this.volume;

                this.currentAudio.onended = () => {
                    this.onSpeechEnded();
                };

                this.currentAudio.onerror = () => {
                    console.error('âŒ Error reproduciendo audio');
                    this.onSpeechEnded();
                };

                await this.currentAudio.play();

            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error ElevenLabs API:', response.status, errorData);
                throw new Error(`ElevenLabs API error: ${response.status} - ${errorData.detail?.message || errorData.message || 'Unknown error'}`);
            }

        } catch (error) {
            console.error('âŒ Error sÃ­ntesis de voz:', error);
            // Continuar sin audio si hay error
            this.onSpeechEnded();
        }
    }

    onSpeechEnded() {
        console.log('âœ… Carolina terminÃ³ de hablar');
        this.isCarolinaSpeaking = false;
        this.audioVisualizer.style.display = 'none';
        this.updateCarolinaStatus('Lista');

        if (this.isCallActive) {
            this.updateCallStatus('ðŸŽ§ Carolina escucha - Habla cuando quiera', 'listening');
            // Activar micrÃ³fono despuÃ©s de que Carolina termine de hablar
            setTimeout(() => {
                console.log('ðŸŽ¤ Intentando activar micrÃ³fono despuÃ©s de que Carolina hablÃ³...');
                this.activateMicrophone();
            }, 500);
        }

        if (this.currentAudio) {
            URL.revokeObjectURL(this.currentAudio.src);
            this.currentAudio = null;
        }
    }

    // === CONTROL DE LLAMADAS ===
    async startCall() {
        console.log('ðŸ“ž Iniciando llamada mÃ©dica...');

        this.isCallActive = true;
        this.callButton.innerHTML = '<i class="fas fa-phone-slash"></i> Finalizar Llamada';
        this.callButton.classList.add('active');
        this.stopButton.style.display = 'inline-block';

        this.updateCallStatus('ðŸ“ž Llamada conectada - Departamento MÃ©dico', 'connected');
        this.updateCarolinaStatus('Conectada');

        // Carolina saluda segÃºn el tipo de servicio
        const greeting = this.getInitialGreeting();
        this.addToConversation(greeting, 'carolina');

        // Hablar el saludo
        await this.speak(greeting);

        // El micrÃ³fono se activarÃ¡ automÃ¡ticamente despuÃ©s de que Carolina termine de hablar
        // en la funciÃ³n onSpeechEnded()

        console.log('âœ… Llamada mÃ©dica iniciada');
    }

    endCall() {
        console.log('ðŸ“ž Finalizando llamada mÃ©dica...');

        this.isCallActive = false;

        this.deactivateMicrophone();
        this.stopAudio();

        this.callButton.innerHTML = '<i class="fas fa-phone"></i> Iniciar Llamada';
        this.callButton.classList.remove('active');
        this.stopButton.style.display = 'none';

        this.updateCallStatus(this.getWelcomeMessage(), 'waiting');
        this.updateCarolinaStatus('Lista');

        this.finalTranscript = '';
        this.interimTranscript = '';
        this.transcript.textContent = 'Sistema mÃ©dico optimizado para gestiÃ³n de citas ColsÃ¡nitas ðŸ¥';

        console.log('âœ… Llamada mÃ©dica finalizada');
    }

    stopAudio() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.onSpeechEnded();
        }
    }

    toggleVolume() {
        if (this.volume > 0) {
            this.volume = 0;
            this.volumeButton.innerHTML = '<i class="fas fa-volume-mute"></i> Volumen: Mudo';
        } else {
            this.volume = 0.8;
            this.volumeButton.innerHTML = '<i class="fas fa-volume-up"></i> Volumen: Alto';
        }
    }

    // === GESTIÃ“N DE CONVERSACIÃ“N ===
    addToConversation(message, speaker) {
        const conversationItem = document.createElement('div');
        conversationItem.className = `conversation-item ${speaker === 'patient' ? 'patient-speech' : 'carolina-speech'}`;

        const label = document.createElement('div');
        label.className = 'speech-label';
        label.textContent = speaker === 'patient' ? 'ðŸ‘¤ Paciente:' : 'ðŸ¥ Carolina:';

        const content = document.createElement('div');
        content.textContent = message;

        conversationItem.appendChild(label);
        conversationItem.appendChild(content);

        this.conversationDisplay.appendChild(conversationItem);
        this.conversationDisplay.scrollTop = this.conversationDisplay.scrollHeight;

        this.conversationHistory.push({
            speaker: speaker,
            message: message,
            timestamp: new Date().toISOString()
        });
    }

    // === BASE DE DATOS Y ALMACENAMIENTO ===
    saveCallToDatabase() {
        const callRecord = {
            id: Date.now(),
            date: new Date().toISOString(),
            serviceType: this.currentServiceType,
            duration: this.interactionCount,
            patientName: this.patientName || 'No identificado',
            result: this.determineCallResult(),
            conversation: [...this.conversationHistory]
        };

        this.callsDatabase.push(callRecord);
        this.saveDatabaseToStorage();
        this.updateCRMDashboard();
    }

    determineCallResult() {
        const lastMessages = this.conversationHistory.slice(-3);
        const hasConfirmation = lastMessages.some(msg =>
            msg.message.toLowerCase().includes('confirmada') ||
            msg.message.toLowerCase().includes('programada')
        );

        return hasConfirmation ? 'confirmed' : 'incomplete';
    }

    loadDatabaseFromStorage() {
        try {
            const patientsData = localStorage.getItem('colsanitas_patients');
            const callsData = localStorage.getItem('colsanitas_calls');
            const reportsData = localStorage.getItem('colsanitas_reports');

            if (patientsData) this.patientsDatabase = JSON.parse(patientsData);
            if (callsData) this.callsDatabase = JSON.parse(callsData);
            if (reportsData) this.reportsDatabase = JSON.parse(reportsData);

            this.generateSamplePatients();
        } catch (error) {
            console.error('Error cargando datos:', error);
            this.generateSamplePatients();
        }
    }

    saveDatabaseToStorage() {
        try {
            localStorage.setItem('colsanitas_patients', JSON.stringify(this.patientsDatabase));
            localStorage.setItem('colsanitas_calls', JSON.stringify(this.callsDatabase));
            localStorage.setItem('colsanitas_reports', JSON.stringify(this.reportsDatabase));
        } catch (error) {
            console.error('Error guardando datos:', error);
        }
    }

    generateSamplePatients() {
        if (this.patientsDatabase.length > 0) return;

        const samplePatients = [
            {
                id: 1,
                name: 'MarÃ­a GonzÃ¡lez',
                phone: '3001234567',
                cedula: '1234567890',
                city: 'BogotÃ¡',
                specialty: 'CardiologÃ­a',
                lastAppointment: '2024-03-15',
                status: 'confirmada'
            },
            {
                id: 2,
                name: 'Carlos RodrÃ­guez',
                phone: '3109876543',
                cedula: '0987654321',
                city: 'MedellÃ­n',
                specialty: 'Ortopedia',
                lastAppointment: '2024-03-20',
                status: 'pendiente'
            },
            {
                id: 3,
                name: 'Ana MartÃ­nez',
                phone: '3157894561',
                cedula: '1122334455',
                city: 'Cali',
                specialty: 'GinecologÃ­a',
                lastAppointment: '2024-03-18',
                status: 'programada'
            }
        ];

        this.patientsDatabase = samplePatients;
        this.saveDatabaseToStorage();
    }
}

// === FUNCIONES GLOBALES ===
let carolinaSistema;

function initializeCarolinaSystem() {
    carolinaSistema = new CarolinaColsanitasSistema();
}

function changeServiceType(type) {
    if (!carolinaSistema) return;

    // Actualizar botones
    document.querySelectorAll('.service-button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Cambiar tipo de servicio
    carolinaSistema.currentServiceType = type;

    // Actualizar mensaje de bienvenida
    carolinaSistema.updateCallStatus(carolinaSistema.getWelcomeMessage(), 'waiting');

    console.log(`ðŸ”„ Tipo de servicio cambiado a: ${type}`);
}

function switchTab(tabName) {
    // Ocultar todos los contenidos
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Desactivar todos los botones
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Mostrar contenido seleccionado
    document.getElementById(tabName).classList.add('active');

    // Activar botÃ³n seleccionado
    event.target.classList.add('active');
}

// === FUNCIONES DE BÃšSQUEDA Y CRM ===
function searchPatients() {
    const patientType = document.getElementById('patientTypeFilter').value;
    const specialty = document.getElementById('specialtyFilter').value;
    const city = document.getElementById('cityFilter').value;
    const status = document.getElementById('statusFilter').value;

    let filteredPatients = carolinaSistema.patientsDatabase.filter(patient => {
        return (!patientType || patient.type === patientType) &&
            (!specialty || patient.specialty === specialty) &&
            (!city || patient.city === city) &&
            (!status || patient.status === status);
    });

    displayPatientsList(filteredPatients, 'patientsList');
}

function displayPatientsList(patients, containerId) {
    const container = document.getElementById(containerId);

    if (patients.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #888888; padding: 20px;">No se encontraron pacientes</div>';
        return;
    }

    container.innerHTML = patients.map(patient => `
                <div class="patient-card">
                    <div class="patient-name">${patient.name}</div>
                    <div class="patient-info">ðŸ“± ${patient.phone}</div>
                    <div class="patient-info">ðŸ†” ${patient.cedula}</div>
                    <div class="patient-info">ðŸ¥ ${patient.specialty}</div>
                    <div class="patient-info">ðŸ“ ${patient.city}</div>
                    <div class="patient-info">ðŸ“… Ãšltima cita: ${patient.lastAppointment}</div>
                    <div class="patient-info">ðŸ“Š Estado: <strong>${patient.status}</strong></div>
                    <div class="patient-actions">
                        <button class="action-button" onclick="callPatient('${patient.id}')">
                            <i class="fas fa-phone"></i> Llamar
                        </button>
                        <button class="action-button" onclick="editPatient('${patient.id}')">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="action-button" onclick="viewHistory('${patient.id}')">
                            <i class="fas fa-history"></i> Historial
                        </button>
                    </div>
                </div>
            `).join('');
}

function filterPatients() {
    const searchTerm = document.getElementById('searchPatient').value.toLowerCase();
    const filteredPatients = carolinaSistema.patientsDatabase.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.phone.includes(searchTerm) ||
        patient.cedula.includes(searchTerm)
    );

    displayPatientsList(filteredPatients, 'crmPatientsList');
}

function callPatient(patientId) {
    const patient = carolinaSistema.patientsDatabase.find(p => p.id == patientId);
    if (patient) {
        carolinaSistema.currentPatient = patient;
        carolinaSistema.patientName = patient.name;
        alert(`Llamando a ${patient.name} - ${patient.phone}`);
    }
}

function editPatient(patientId) {
    alert(`Editando paciente ID: ${patientId}`);
}

function viewHistory(patientId) {
    alert(`Historial mÃ©dico del paciente ID: ${patientId}`);
}

function exportData() {
    const data = {
        patients: carolinaSistema.patientsDatabase,
        calls: carolinaSistema.callsDatabase,
        reports: carolinaSistema.reportsDatabase
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'colsanitas_data.json';
    a.click();
    URL.revokeObjectURL(url);
}

// === FUNCIONES DE INFORMES ===
function generateReport() {
    const report = {
        id: Date.now(),
        date: new Date().toISOString(),
        type: 'medical_summary',
        data: {
            totalPatients: carolinaSistema.patientsDatabase.length,
            callsToday: carolinaSistema.callsDatabase.filter(call =>
                new Date(call.date).toDateString() === new Date().toDateString()
            ).length,
            confirmationRate: calculateConfirmationRate(),
            topSpecialties: getTopSpecialties()
        }
    };

    carolinaSistema.reportsDatabase.push(report);
    carolinaSistema.saveDatabaseToStorage();
    displayReports();
}

function calculateConfirmationRate() {
    const confirmed = carolinaSistema.callsDatabase.filter(call => call.result === 'confirmed').length;
    const total = carolinaSistema.callsDatabase.length;
    return total > 0 ? Math.round((confirmed / total) * 100) : 0;
}

function getTopSpecialties() {
    const specialtyCount = {};
    carolinaSistema.patientsDatabase.forEach(patient => {
        specialtyCount[patient.specialty] = (specialtyCount[patient.specialty] || 0) + 1;
    });

    return Object.entries(specialtyCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([specialty, count]) => ({ specialty, count }));
}

function displayReports() {
    const container = document.getElementById('reportDisplay');

    if (carolinaSistema.reportsDatabase.length === 0) {
        container.innerHTML = `
                    <div style="text-align: center; color: #888888; padding: 40px;">
                        <i class="fas fa-clipboard" style="font-size: 3rem; margin-bottom: 20px; color: #0066cc;"></i>
                        <h3>No hay informes generados aÃºn</h3>
                        <p>Realiza una llamada y genera un informe automÃ¡tico mÃ©dico</p>
                    </div>
                `;
        return;
    }

    container.innerHTML = carolinaSistema.reportsDatabase.map(report => `
                <div style="background: #ffffff; border: 1px solid #e0e0e0; border-radius: 6px; padding: 20px; margin: 10px 0;">
                    <h4 style="color: #0066cc; margin-bottom: 10px;">
                        ðŸ“Š Informe MÃ©dico - ${new Date(report.date).toLocaleDateString()}
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <div>
                            <strong>Total Pacientes:</strong> ${report.data.totalPatients}
                        </div>
                        <div>
                            <strong>Llamadas Hoy:</strong> ${report.data.callsToday}
                        </div>
                        <div>
                            <strong>Tasa ConfirmaciÃ³n:</strong> ${report.data.confirmationRate}%
                        </div>
                        <div>
                            <strong>Especialidades Top:</strong> 
                            ${report.data.topSpecialties.map(s => `${s.specialty} (${s.count})`).join(', ')}
                        </div>
                    </div>
                </div>
            `).join('');
}

function exportReport() {
    if (carolinaSistema.reportsDatabase.length === 0) {
        alert('No hay informes para exportar');
        return;
    }

    const blob = new Blob([JSON.stringify(carolinaSistema.reportsDatabase, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'informes_medicos_colsanitas.json';
    a.click();
    URL.revokeObjectURL(url);
}

function clearAllReports() {
    if (confirm('Â¿EstÃ¡ seguro de que desea eliminar todos los informes?')) {
        carolinaSistema.reportsDatabase = [];
        carolinaSistema.saveDatabaseToStorage();
        displayReports();
    }
}

// === INICIALIZACIÃ“N ===
document.addEventListener('DOMContentLoaded', function () {
    console.log('ðŸ¥ Inicializando Sistema Carolina Colsanitas...');
    initializeCarolinaSystem();

    // Cargar datos iniciales
    setTimeout(() => {
        if (carolinaSistema.patientsDatabase.length > 0) {
            displayPatientsList(carolinaSistema.patientsDatabase.slice(0, 5), 'crmPatientsList');
        }
        displayReports();
    }, 1000);
});