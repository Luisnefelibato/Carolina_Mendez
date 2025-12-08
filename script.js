// === FLORIDA MEDICAL CENTER AI SYSTEM ===
class CarolinaFloridaMedicalSystem {

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

        // Datos de conversación y CRM
        this.finalTranscript = '';
        this.interimTranscript = '';
        this.conversationHistory = [];
        this.interactionCount = 0;
        this.patientName = null;
        this.currentPatient = null;

        // Base de datos médica
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

        // Estadísticas
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
        console.log('🚀 Inicializando Carolina IA System...');
        this.setupEventListeners();
        await this.initializeVoiceRecognition();
        this.updateCallStatus(this.getWelcomeMessage(), 'waiting');
        this.updateMicrophoneStatus(false);
        this.updateCRMDashboard();

        // Intentar listar modelos disponibles para diagnóstico
        setTimeout(async () => {
            const models = await this.listAvailableModels();
            if (models.length > 0) {
                console.log('⚠Modelos disponibles para esta API key:', models.map(m => m.name).join(', '));
            } else {
                console.warn('✅  No se pudieron listar modelos. Verifica que la API key sea válida.');
            }
        }, 1000);

        console.log('⚠Sistema Carolina inicializado correctamente');
    }

    // === DATABASE - FLORIDA MEDICAL CENTER ===
    initializeSimulatedDatabase() {
        // Doctors by specialty (Florida Medical Center network)
        this.doctorsDatabase = {
            'odontologia': [
                { name: 'Dr. James Mitchell', clinic: 'Florida Medical Center - Miami', phone: '305-555-0100' },
                { name: 'Dr. Sarah Johnson', clinic: 'Florida Medical Center - Orlando', phone: '407-555-0100' },
                { name: 'Dr. Michael Chen', clinic: 'Florida Medical Center - Tampa', phone: '813-555-0100' },
                { name: 'Dr. Emily Rodriguez', clinic: 'Florida Medical Center - Jacksonville', phone: '904-555-0100' }
            ],
            'cardiologia': [
                { name: 'Dr. Robert Anderson', clinic: 'Florida Medical Center - Miami', phone: '305-555-0200' },
                { name: 'Dr. Jennifer Williams', clinic: 'Florida Medical Center - Orlando', phone: '407-555-0200' },
                { name: 'Dr. David Martinez', clinic: 'Florida Medical Center - Tampa', phone: '813-555-0200' }
            ],
            'medicina_general': [
                { name: 'Dr. Lisa Thompson', clinic: 'Florida Medical Center - Miami', phone: '305-555-0300' },
                { name: 'Dr. Kevin Brown', clinic: 'Florida Medical Center - Orlando', phone: '407-555-0300' },
                { name: 'Dr. Amanda Garcia', clinic: 'Florida Medical Center - Tampa', phone: '813-555-0300' }
            ],
            'pediatria': [
                { name: 'Dr. Maria Santos', clinic: 'Florida Medical Center - Miami', phone: '305-555-0400' },
                { name: 'Dr. Christopher Lee', clinic: 'Florida Medical Center - Orlando', phone: '407-555-0400' }
            ],
            'ginecologia': [
                { name: 'Dr. Patricia Davis', clinic: 'Florida Medical Center - Miami', phone: '305-555-0500' },
                { name: 'Dr. Rachel Green', clinic: 'Florida Medical Center - Tampa', phone: '813-555-0500' }
            ],
            'dermatologia': [
                { name: 'Dr. Steven Wilson', clinic: 'Florida Medical Center - Miami', phone: '305-555-0600' },
                { name: 'Dr. Nicole Martinez', clinic: 'Florida Medical Center - Orlando', phone: '407-555-0600' }
            ],
            'ortopedia': [
                { name: 'Dr. Thomas Robinson', clinic: 'Florida Medical Center - Miami', phone: '305-555-0700' },
                { name: 'Dr. Daniel Taylor', clinic: 'Florida Medical Center - Tampa', phone: '813-555-0700' }
            ]
        };

        // Horarios disponibles comunes
        this.availableTimes = [
            '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
            '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
            '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
        ];

        // Horarios prioritarios (más tempranos o flexibles)
        this.priorityTimes = [
            '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
            '10:00 AM', '10:30 AM', '11:00 AM', '1:00 PM', '1:30 PM', '2:00 PM'
        ];

        // Emergency Clinics and Urgent Care Centers - Florida Medical Center network
        this.emergencyClinics = [
            {
                name: 'Florida Medical Center - Miami Emergency',
                address: '1500 NW 12th Ave, Miami, FL 33136',
                phone: '305-555-1000',
                emergencyPhone: '305-555-1911',
                open24h: true,
                specialties: ['All specialties', 'Level 1 Trauma Center']
            },
            {
                name: 'Florida Medical Center - Orlando Emergency',
                address: '6535 Nemours Parkway, Orlando, FL 32827',
                phone: '407-555-2000',
                emergencyPhone: '407-555-2911',
                open24h: true,
                specialties: ['All specialties', 'Pediatric Emergency']
            },
            {
                name: 'Florida Medical Center - Tampa Emergency',
                address: '2 Tampa General Circle, Tampa, FL 33606',
                phone: '813-555-3000',
                emergencyPhone: '813-555-3911',
                open24h: true,
                specialties: ['All specialties', 'Cardiac Emergency']
            },
            {
                name: 'Florida Medical Center - Jacksonville ER',
                address: '655 W 8th St, Jacksonville, FL 32209',
                phone: '904-555-4000',
                emergencyPhone: '904-555-4911',
                open24h: true,
                specialties: ['All specialties', 'Stroke Center']
            },
            {
                name: 'Florida Medical Center - Fort Lauderdale Urgent Care',
                address: '1600 S Andrews Ave, Fort Lauderdale, FL 33316',
                phone: '954-555-5000',
                emergencyPhone: '954-555-5911',
                open24h: false,
                specialties: ['Urgent Care', 'Minor Injuries', 'Illness']
            }
        ];
    }

    // === SIMULACIÃN DE BÃSQUEDA DE CITA ===
    simulateAppointmentSearch(patientName, documentNumber, specialty, dayOfWeek, serviceType = 'confirmacion') {
        // Normalizar especialidad
        const normalizedSpecialty = this.normalizeSpecialty(specialty);

        // Obtener doctores disponibles para la especialidad
        const doctors = this.doctorsDatabase[normalizedSpecialty] || this.doctorsDatabase['medicina_general'];

        // Seleccionar un doctor aleatorio
        const doctor = doctors[Math.floor(Math.random() * doctors.length)];

        let appointmentDate, time, status, appointmentId;

        if (serviceType === 'urgencia') {
            // Para urgencias: fecha y hora inmediatas (hoy o mañana temprano)
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            tomorrow.setHours(8, 0, 0, 0);

            appointmentDate = this.formatDate(tomorrow);
            time = '8:00 AM';
            status = 'urgencia activada';
            appointmentId = `URG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
        } else if (serviceType === 'prioritaria') {
            // Para prioritarias: mañana o pasado mañana
            const today = new Date();
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + (Math.random() > 0.5 ? 1 : 2));

            appointmentDate = this.formatDate(nextDay);
            time = this.priorityTimes[Math.floor(Math.random() * this.priorityTimes.length)];
            status = 'prioritaria confirmada';
            appointmentId = `PRI-${Date.now().toString().slice(-6)}`;
        } else {
            // Confirmación normal: calcular fecha del próximo día de la semana solicitado
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

    // === SIMULACIÃN DE URGENCIA MÃDICA ===
    simulateEmergencyResponse(patientName, documentNumber, specialty, location = null) {
        // Seleccionar clínica de urgencias más cercana o aleatoria
        let clinic;
        if (location) {
            // Si hay ubicación, seleccionar la más cercana (simulado)
            clinic = this.emergencyClinics[Math.floor(Math.random() * this.emergencyClinics.length)];
        } else {
            clinic = this.emergencyClinics[Math.floor(Math.random() * this.emergencyClinics.length)];
        }

        // Generar código de urgencia único
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
            instructions: 'Diríjase inmediatamente. El personal médico ya está informado de su llegada.'
        };
    }

    formatDate(date) {
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

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
            'odontólogo': 'odontologia',
            'odontologo': 'odontologia',
            'dental': 'odontologia',
            'diente': 'odontologia',
            'cardiologia': 'cardiologia',
            'cardiólogo': 'cardiologia',
            'corazón': 'cardiologia',
            'pediatria': 'pediatria',
            'pediatra': 'pediatria',
            'niño': 'pediatria',
            'ginecologia': 'ginecologia',
            'ginecólogo': 'ginecologia',
            'ginecologo': 'ginecologia',
            'dermatologia': 'dermatologia',
            'dermatólogo': 'dermatologia',
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
            'lunes': 1, 'martes': 2, 'miércoles': 3, 'miercoles': 3,
            'jueves': 4, 'viernes': 5, 'sábado': 6, 'sabado': 6, 'domingo': 0
        };

        const today = new Date();
        const currentDay = today.getDay();
        const targetDay = days[dayOfWeek.toLowerCase()] || 6; // Default: sábado

        let daysUntilTarget = targetDay - currentDay;
        if (daysUntilTarget <= 0) {
            daysUntilTarget += 7; // Si ya pasó, buscar el próximo
        }

        const appointmentDate = new Date(today);
        appointmentDate.setDate(today.getDate() + daysUntilTarget);

        // Formatear fecha en español
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

        const dayName = dayNames[appointmentDate.getDay()];
        const day = appointmentDate.getDate();
        const month = months[appointmentDate.getMonth()];
        const year = appointmentDate.getFullYear();

        return `${dayName} ${day} de ${month} de ${year}`;
    }

    getWelcomeMessage() {
        switch (this.currentServiceType) {
            case 'confirmacion':
                return '🏥 Carolina lista para asistirle - Florida Medical Center';
            case 'prioritaria':
                return '⚡ Atención Prioritaria activada - Carolina gestionando citas urgentes';
            case 'urgencia':
                return '🚨 Protocolo de Urgencias - Carolina coordinando atención inmediata';
            default:
                return '🏥 Carolina lista para asistirle - Florida Medical Center';
        }
    }

    getInitialGreeting() {
        switch (this.currentServiceType) {
            case 'confirmacion':
                return 'Buenos días, habla Carolina del departamento de confirmaciones de Florida Medical Center. ¿En qué puedo ayudarle con su cita médica?';
            case 'prioritaria':
                return 'Buenos días, habla Carolina del departamento de atención prioritaria de Florida Medical Center. Entiendo que necesita una cita con urgencia. Por favor, cuénteme qué especialidad necesita y su situación para coordinarle la atención lo antes posible.';
            case 'urgencia':
                return 'Buenos días, habla Carolina, protocolo de urgencias de Florida Medical Center. Estoy aquí para coordinar su atención médica inmediata. Por favor, indíqueme su nombre, número de seguro médico y su ubicación actual para dirigirle al centro más cercano.';
            default:
                return 'Buenos días, habla Carolina del departamento de confirmaciones de Florida Medical Center. ¿En qué puedo ayudarle con su cita médica?';
        }
    }

    // === CONVERSIÃN PERFECTA DE NÃMEROS A ESPAÃOL ===
    numberToSpanishWords(number) {
        if (number === 0) return 'cero';
        if (number === 100) return 'cien';

        const ones = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
        const teens = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
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
        const millionsText = millions === 1 ? 'un millón' : this.numberToSpanishWords(millions) + ' millones';
        return millionsText + (remainder > 0 ? ' ' + this.numberToSpanishWords(remainder) : '');
    }

    // === OPTIMIZACIÃN PARA ELEVENLABS ===
    optimizeForElevenLabs(text) {
        let optimized = text;

        // Reemplazar abreviaciones médicas por formas completas
        optimized = optimized.replace(/\bDr\.\s+/g, 'doctor ');
        optimized = optimized.replace(/\bDra\.\s+/g, 'doctora ');
        optimized = optimized.replace(/\bDr\s+/g, 'doctor ');
        optimized = optimized.replace(/\bDra\s+/g, 'doctora ');

        // Convertir horas en formato 12h AM/PM a palabras en español
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

            const timeOfDay = isPM ? (h >= 1 && h < 7 ? 'de la tarde' : 'de la noche') : 'de la mañana';

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
                timeOfDay = 'de la mañana';
            } else if (h === 12) {
                hourText = 'doce';
                timeOfDay = 'del mediodía';
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

        // Números de insurance ID y teléfonos (decirlos dígito por dígito)
        optimized = optimized.replace(/(\d{8,11})/g, (match, number) => {
            return number.split('').map(d => this.numberToSpanishWords(parseInt(d))).join(' ');
        });

        // Códigos médicos (decirlos letra por letra y número por número)
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
        optimized = optimized.replace(/\betc\./g, 'etcétera');
        optimized = optimized.replace(/\bvs\./g, 'versus');
        optimized = optimized.replace(/\bSr\./g, 'señor');
        optimized = optimized.replace(/\bSra\./g, 'señora');
        optimized = optimized.replace(/\bSrta\./g, 'señorita');

        // Convertir signos de puntuación a palabras explícitas
        // Puntos y comas (solo en contextos donde sea necesario)
        optimized = optimized.replace(/\.\s+/g, ' punto ');
        optimized = optimized.replace(/,\s+/g, ' coma ');
        optimized = optimized.replace(/;\s+/g, ' punto y coma ');
        optimized = optimized.replace(/:\s+/g, ' dos puntos ');

        // Signos de interrogación y exclamación
        optimized = optimized.replace(/\?/g, ' signo de interrogación ');
        optimized = optimized.replace(/!/g, ' signo de exclamación ');

        // Guiones y rayas
        optimized = optimized.replace(/-\s+/g, ' guion ');
        optimized = optimized.replace(/\s+-/g, ' guion ');
        optimized = optimized.replace(/✅/g, ' raya ');

        // Paréntesis (convertir contenido)
        optimized = optimized.replace(/\(([^)]+)\)/g, ' entre paréntesis $1 cierra paréntesis ');

        // Corchetes
        optimized = optimized.replace(/\[([^\]]+)\]/g, ' entre corchetes $1 cierra corchetes ');

        // Comillas
        optimized = optimized.replace(/"([^"]+)"/g, ' comillas $1 cierra comillas ');
        optimized = optimized.replace(/'([^']+)'/g, ' comillas $1 cierra comillas ');

        // Porcentajes
        optimized = optimized.replace(/(\d+)%/g, '$1 por ciento');

        // Símbolos matemáticos comunes
        optimized = optimized.replace(/\+/g, ' más ');
        optimized = optimized.replace(/=/g, ' igual ');

        // Limpiar espacios múltiples
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

    // === CONFIGURACIÃN DE EVENTOS ===
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
            console.error('✅ Reconocimiento de voz no soportado');
            return;
        }

        // Solicitar permisos del micrófono si están disponibles
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                console.log('⚠Permisos del micrófono otorgados');
            } catch (error) {
                console.warn('✅  No se pudieron obtener permisos del micrófono:', error);
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
            console.log('📋¤ Reconocimiento iniciado');
            this.updateMicrophoneStatus(true);
            this.updateCallStatus('📋§ Carolina escucha - Habla cuando quiera', 'listening');
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
                this.transcript.textContent = "Florida Medical Center - Sistema de gestión de citas médicas 🏥";
            }

            clearTimeout(this.silenceTimer);
            this.silenceTimer = setTimeout(() => {
                if (this.finalTranscript.trim()) {
                    this.processUserInput();
                }
            }, 1500);
        };

        this.recognition.onerror = (event) => {
            console.warn('✅ Error reconocimiento:', event.error);
            clearTimeout(this.silenceTimer);
            this.updateMicrophoneStatus(false);

            // Errores que no requieren reintento
            if (event.error === 'aborted') {
                console.log('✅¹ Reconocimiento abortado (normal)');
                return;
            }

            if (event.error === 'no-speech') {
                console.log('✅¹ No se detectó habla (normal)');
                // Reactivar si la llamada sigue activa
                if (this.isCallActive && !this.isCarolinaSpeaking && !this.isProcessingResponse) {
                    setTimeout(() => this.activateMicrophone(), 500);
                }
                return;
            }

            // Para otros errores, intentar reactivar
            if (this.isCallActive && !this.isCarolinaSpeaking && !this.isProcessingResponse) {
                console.log('📋 Reintentando reconocimiento después de error...');
                setTimeout(() => this.activateMicrophone(), 1000);
            }
        };

        this.recognition.onend = () => {
            console.log('📋 Reconocimiento terminado');
            this.updateMicrophoneStatus(false);

            if (this.finalTranscript.trim()) {
                this.processUserInput();
            } else if (this.isCallActive && !this.isCarolinaSpeaking && !this.isProcessingResponse) {
                // Esperar un poco más antes de reactivar para evitar conflictos
                setTimeout(() => {
                    if (this.isCallActive && !this.isCarolinaSpeaking && !this.isProcessingResponse && !this.isMicrophoneActive) {
                        this.activateMicrophone();
                    }
                }, 800);
            }
        };
    }

    // === CONTROL DE MICRÃFONO ===
    activateMicrophone() {
        if (!this.isCallActive || this.isCarolinaSpeaking || this.isProcessingResponse) {
            console.log('✅¸ Micrófono no activado - condiciones no cumplidas:', {
                isCallActive: this.isCallActive,
                isCarolinaSpeaking: this.isCarolinaSpeaking,
                isProcessingResponse: this.isProcessingResponse
            });
            return;
        }

        if (!this.recognition) {
            console.error('✅ Reconocimiento no inicializado');
            return;
        }

        // Verificar el estado del reconocimiento antes de iniciar
        const state = this.recognition.state || 'unknown';
        if (state === 'listening' || state === 'starting') {
            console.log('⚠Micrófono ya está activo, estado:', state);
            this.updateMicrophoneStatus(true);
            return;
        }

        console.log('📋¤ Activando micrófono... Estado actual:', state);

        try {
            this.recognition.start();
            console.log('⚠Comando start() enviado al reconocimiento');
        } catch (error) {
            console.error('✅ Error activando micrófono:', error.name, error.message);

            // Si el error es porque ya está activo, actualizar estado
            if (error.name === 'InvalidStateError') {
                console.log('✅  Reconocimiento ya estaba activo, actualizando estado');
                this.updateMicrophoneStatus(true);
            } else {
                // Para otros errores, reintentar después de un tiempo
                console.log('📋 Reintentando activación en 1 segundo...');
                setTimeout(() => {
                    if (this.isCallActive && !this.isCarolinaSpeaking && !this.isProcessingResponse) {
                        this.activateMicrophone();
                    }
                }, 1000);
            }
        }
    }

    deactivateMicrophone() {
        console.log('📋 Desactivando micrófono...');

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

        console.log('📋§  Procesando:', userMessage);

        this.deactivateMicrophone();
        this.addToConversation(userMessage, 'patient');
        this.interactionCount++;
        this.updateStats();

        this.isProcessingResponse = true;
        this.updateCallStatus('✅¡ Carolina procesando consulta médica...', 'processing');
        this.updateCarolinaStatus('Procesando');

        const startTime = performance.now();

        try {
            const response = await this.generateMedicalResponse(userMessage);
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);

            this.responseTimeEl.textContent = `${responseTime}ms`;
            this.addToConversation(response, 'carolina');

            this.isProcessingResponse = false;

            // Detectar si es cierre de gestión médica
            if (this.isEndOfServiceMessage(response)) {
                this.saveCallToDatabase();
                setTimeout(() => this.endCall(), 3000);
            } else {
                await this.speak(response);
            }

        } catch (error) {
            console.error('✅ Error generando respuesta:', error);
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
                console.log('📋 Modelos disponibles:', data.models?.map(m => m.name) || []);
                return data.models || [];
            }
        } catch (error) {
            console.warn('✅  No se pudieron listar modelos:', error);
        }
        return [];
    }

    // === EXTRACCIÃN DE INFORMACIÃN DEL MENSAJE ===
    extractAppointmentInfo(userMessage, conversationHistory) {
        let patientName = null;
        let documentNumber = null;
        let specialty = null;
        let dayOfWeek = null;

        // Buscar nombre y ID en el historial y mensaje actual
        const allMessages = conversationHistory.map(m => m.message).join(' ') + ' ' + userMessage;
        const fullText = allMessages.toLowerCase();

        // Extraer número de ID (formato colombiano: 8-11 dígitos, puede tener espacios)
        const docPatterns = [
            /(?:ID|insurance ID|insurance ID|identificación|identificacion|numero|número)[\s:]*(\d{1,3}(?:\s?\d{3}){2,3})/i,
            /(\d{8,11})/g
        ];

        for (const pattern of docPatterns) {
            const match = allMessages.match(pattern);
            if (match) {
                documentNumber = match[1].replace(/\s/g, ''); // Quitar espacios
                break;
            }
        }

        // Extraer nombre (patrones comunes, buscar en texto original para mantener mayúsculas)
        const namePatterns = [
            /(?:mi nombre (?:es|completo es|es completo) |me llamo |soy |nombre completo:?\s*)([A-ZÃÃÃÃÃÃ][a-záéíóúñ]+(?:\s+[A-ZÃÃÃÃÃÃ][a-záéíóúñ]+)+)/i,
            /(?:nombre:?\s*)([A-ZÃÃÃÃÃÃ][a-záéíóúñ]+(?:\s+[A-ZÃÃÃÃÃÃ][a-záéíóúñ]+)+)/i,
            /([A-ZÃÃÃÃÃÃ][a-záéíóúñ]+\s+[A-ZÃÃÃÃÃÃ][a-záéíóúñ]+\s+[A-ZÃÃÃÃÃÃ][a-záéíóúñ]+)/ // Tres palabras con mayúscula
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
            'odontologia': ['odontologia', 'odontólogo', 'odontologo', 'dental', 'diente', 'dientes', 'odontología'],
            'cardiologia': ['cardiologia', 'cardiólogo', 'cardiaco', 'corazón', 'corazon', 'cardiología'],
            'pediatria': ['pediatria', 'pediatra', 'niño', 'niños', 'niña', 'niñas', 'pediatría'],
            'ginecologia': ['ginecologia', 'ginecólogo', 'ginecologo', 'ginecología'],
            'dermatologia': ['dermatologia', 'dermatólogo', 'dermatologo', 'piel', 'dermatología'],
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

        // Extraer día de la semana (buscar variaciones)
        const dayMap = {
            'lunes': ['lunes'],
            'martes': ['martes'],
            'miércoles': ['miércoles', 'miercoles'],
            'jueves': ['jueves'],
            'viernes': ['viernes'],
            'sábado': ['sábado', 'sabado'],
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

        // Si tenemos suficiente información, simular búsqueda de cita
        if (patientName && documentNumber) {
            // Para urgencias y prioritarias, no necesitamos día de la semana
            if (this.currentServiceType === 'urgencia' || this.currentServiceType === 'prioritaria') {
                if (patientName && documentNumber) {
                    console.log('📋 Información extraída:', { patientName, documentNumber, specialty });
                    return this.simulateAppointmentSearch(patientName, documentNumber, specialty, null, this.currentServiceType);
                }
            } else {
                // Para confirmaciones normales, necesitamos día de la semana
                if (patientName && documentNumber && specialty && dayOfWeek) {
                    console.log('📋 Información extraída:', { patientName, documentNumber, specialty, dayOfWeek });
                    return this.simulateAppointmentSearch(patientName, documentNumber, specialty, dayOfWeek, this.currentServiceType);
                }
            }
        }

        return null;
    }

    // === EXTRACCIÃN DE INFORMACIÃN DE URGENCIA ===
    extractEmergencyInfo(userMessage, conversationHistory) {
        let patientName = null;
        let documentNumber = null;
        let specialty = null;
        let location = null;

        // Buscar información en el historial y mensaje actual
        const allMessages = conversationHistory.map(m => m.message).join(' ') + ' ' + userMessage;
        const fullText = allMessages.toLowerCase();

        // Extraer número de ID
        // Primero intentar con patrón específico (con grupos)
        const specificDocPattern = /(?:ID|insurance ID|insurance ID|identificación|identificacion|numero|número)[\s:]*(\d{1,3}(?:\s?\d{3}){2,3})/i;
        const specificMatch = allMessages.match(specificDocPattern);
        if (specificMatch && specificMatch[1]) {
            documentNumber = specificMatch[1].replace(/\s/g, '');
        } else {
            // Si no encuentra con patrón específico, buscar cualquier número de 8-11 dígitos
            const generalDocPattern = /(\d{8,11})/;
            const generalMatch = allMessages.match(generalDocPattern);
            if (generalMatch && generalMatch[1]) {
                documentNumber = generalMatch[1].replace(/\s/g, '');
            }
        }

        // Extraer nombre
        const namePatterns = [
            /(?:mi nombre (?:es|completo es|es completo) |me llamo |soy |nombre completo:?\s*)([A-ZÃÃÃÃÃÃ][a-záéíóúñ]+(?:\s+[A-ZÃÃÃÃÃÃ][a-záéíóúñ]+)+)/i,
            /(?:nombre:?\s*)([A-ZÃÃÃÃÃÃ][a-záéíóúñ]+(?:\s+[A-ZÃÃÃÃÃÃ][a-záéíóúñ]+)+)/i
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
            'odontologia': ['odontologia', 'odontólogo', 'dental'],
            'cardiologia': ['cardiologia', 'cardiólogo', 'corazón'],
            'pediatria': ['pediatria', 'pediatra', 'niño'],
            'ginecologia': ['ginecologia', 'ginecólogo'],
            'dermatologia': ['dermatologia', 'dermatólogo'],
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

        // Extraer ubicación si se menciona (incluyendo municipios)
        const locationKeywords = ['bogotá', 'bogota', 'medellín', 'medellin', 'cali', 'barranquilla',
            'norte', 'sur', 'centro', 'mosquera', 'cundinamarca', 'soacha', 'chia'];
        for (const keyword of locationKeywords) {
            if (fullText.includes(keyword)) {
                location = keyword;
                break;
            }
        }

        // Si tenemos información mínima, generar respuesta de urgencia
        if (patientName && documentNumber) {
            console.log('📋¨ Información de urgencia extraída:', { patientName, documentNumber, specialty, location });
            return this.simulateEmergencyResponse(patientName, documentNumber, specialty, location);
        }

        return null;
    }

    // === GENERACIÃN DE RESPUESTA MÃDICA ===
    async generateMedicalResponse(userMessage) {
        const systemPrompt = this.getMedicalSystemPrompt();

        // Usando solo gemini-2.5-flash-lite para optimizar tiempo de respuesta
        // Versión ligera y rápida del modelo
        const modelConfigs = [
            { version: 'v1beta', model: 'gemini-2.5-flash-lite' },
            { version: 'v1', model: 'gemini-2.5-flash-lite' },
        ];

        // Construir el historial de conversación para contexto
        let conversationContext = '';
        if (this.conversationHistory.length > 0) {
            // Incluir las últimas 6 interacciones para contexto (3 turnos de cada uno)
            const recentHistory = this.conversationHistory.slice(-6);
            conversationContext = recentHistory.map(msg => {
                const role = msg.speaker === 'patient' ? 'Paciente' : 'Carolina';
                return `${role}: ${msg.message}`;
            }).join('\n') + '\n\n';
        }

        // Intentar extraer información según el tipo de servicio
        let appointmentContext = '';

        if (this.currentServiceType === 'urgencia') {
            // Para urgencias, buscar información mínima y generar respuesta de emergencia
            const emergencyInfo = this.extractEmergencyInfo(userMessage, this.conversationHistory);
            if (emergencyInfo) {
                appointmentContext = `\n\nINFORMACIÃN DE URGENCIA MÃDICA (usa estos datos exactos):
- Nombre del paciente: ${emergencyInfo.patientName}
- Número de ID: ${emergencyInfo.documentNumber}
- Código de urgencia: ${emergencyInfo.emergencyCode}
- Clínica asignada: ${emergencyInfo.clinic}
- Dirección: ${emergencyInfo.address}
- Teléfono de urgencias: ${emergencyInfo.phone}
- Hora de llegada estimada: ${emergencyInfo.arrivalTime}
- Instrucciones: ${emergencyInfo.instructions}

IMPORTANTE: Proporciona TODA esta información de forma clara y urgente. El paciente debe dirigirse INMEDIATAMENTE.`;
            }
        } else {
            // Para confirmaciones y prioritarias, extraer información completa de cita
            const appointmentInfo = this.extractAppointmentInfo(userMessage, this.conversationHistory);
            if (appointmentInfo) {
                appointmentContext = `\n\nINFORMACIÃN DE LA CITA DEL PACIENTE (usa estos datos exactos, NO uses placeholders):
- Nombre del paciente: ${appointmentInfo.patientName}
- Número de ID: ${appointmentInfo.documentNumber}
- Especialidad: ${appointmentInfo.specialty}
- Doctor asignado: ${appointmentInfo.doctor}
- Clínica: ${appointmentInfo.clinic}
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

        // Intentar con cada configuración hasta que una funcione
        for (const config of modelConfigs) {
            try {
                // Probar primero con API key en query parameter
                let endpoint = `https://generativelanguage.googleapis.com/${config.version}/models/${config.model}:generateContent?key=${this.GEMINI_API_KEY}`;
                let headers = {
                    'Content-Type': 'application/json',
                };

                console.log(`📋 Intentando con modelo: ${config.model} (${config.version})`);
                console.log(`📋 Endpoint: ${endpoint.replace(this.GEMINI_API_KEY, 'API_KEY_HIDDEN')}`);

                let response = await fetch(endpoint, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(requestBody),
                });

                // Si falla con 404, probar con API key en header
                if (!response.ok && response.status === 404) {
                    console.log(`📋 Probando con API key en header...`);
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
                    console.warn(`✅ Error con ${config.model} (${config.version}):`, response.status);
                    console.warn(`📋 Mensaje de error:`, errorMessage);
                    console.warn(`📋 Detalles completos:`, errorData);

                    // Si es 404, probar siguiente modelo
                    if (response.status === 404) {
                        continue;
                    }

                    // Para otros errores, lanzar excepción
                    throw new Error(`Gemini API error: ${response.status} - ${errorMessage}`);
                }

                const data = await response.json();

                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    console.log(`⚠Ãxito con modelo: ${config.model} (${config.version})`);
                    return data.candidates[0].content.parts[0].text.trim();
                } else {
                    console.error('Respuesta inválida de Gemini:', data);
                    continue; // Probar siguiente modelo
                }

            } catch (error) {
                // Si no es un error de red, continuar con siguiente modelo
                if (error.message && error.message.includes('404')) {
                    console.warn(`✅  Modelo ${config.model} no disponible, probando siguiente...`);
                    continue;
                }

                // Si es el último modelo, lanzar el error
                if (config === modelConfigs[modelConfigs.length - 1]) {
                    console.error('✅ Error con Gemini API:', error);
                    throw error;
                }
            }
        }

        // Si ningún modelo funcionó, usar respuesta de fallback
        console.warn('✅  Ningún modelo de Gemini funcionó, usando respuesta de fallback');
        return this.getFallbackMedicalResponse();
    }

    getMedicalSystemPrompt() {
        const basePrompt = `Eres Carolina Méndez, especialista en confirmaciones de citas médicas de Florida Medical Center. Trabajas en el departamento de gestión de citas médicas y tu objetivo es ayudar a los pacientes con sus necesidades médicas.

PROTOCOLO DE ATENCIÃN:
1. Saluda profesionalmente SOLO en la primera interacción
2. Escucha atentamente la necesidad del paciente
3. Proporciona una SOLUCIÃN CONCRETA
4. NO repitas tu presentación si ya te presentaste anteriormente en la conversación
5. Mantén el contexto de la conversación y continúa de forma natural
6. Cuando tengas información de una cita confirmada, proporciona TODOS los detalles de forma clara y natural

Tu personalidad: Profesional, MUY EMPÃTICA, CARIÃOSA, ATENTA, cálida, comprensiva, eficiente, orientada a soluciones médicas. Muestra genuino interés por el bienestar del paciente.

TONO Y ESTILO:
- Sé cálida y cariñosa en tu trato
- Muestra empatía y comprensión
- Usa expresiones amables como "por supuesto", "con mucho gusto", "estoy aquí para ayudarle"
- Reconoce las preocupaciones del paciente
- Ofrece tranquilidad y confianza
- Sé paciente y comprensiva

IMPORTANTE: 
- Si ya te presentaste en mensajes anteriores, NO vuelvas a presentarte
- Continúa la conversación de forma natural basándote en el contexto previo
- Siempre proporciona respuestas que sean SOLUCIONES PRÃCTICAS Y CONCRETAS
- Si se te proporciona información de una cita (fecha, hora, doctor, clínica), ÃSALA DIRECTAMENTE en tu respuesta
- NUNCA uses placeholders como [insertar fecha], [insertar hora] o [insertar nombre del doctor]
- Di la información completa y real que se te proporciona
- Muestra siempre una actitud cariñosa y atenta hacia el paciente`;

        switch (this.currentServiceType) {
            case 'confirmacion':
                return `${basePrompt}

MODO: CONFIRMACIÃN DE CITAS
- Verifica citas existentes
- Confirma fechas, horarios y especialistas
- Proporciona información de preparativos
- Envía recordatorios
- Soluciona problemas de confirmación

ESTILO ESPECÃFICO PARA CONFIRMACIÃN:
- Sé especialmente cariñosa y atenta
- Reconoce la importancia de su cita médica
- Ofrece tranquilidad sobre la confirmación
- Muestra interés genuino en ayudarle
- Usa expresiones como "con mucho gusto", "por supuesto", "estoy aquí para ayudarle"
- Sé paciente si el paciente tiene dudas o necesita aclaraciones

Ejemplo de respuesta: "Por supuesto, con mucho gusto le ayudo. He verificado su cita y me complace confirmarle que está programada para el viernes quince de marzo a las diez y media de la mañana con el doctor García en Cardiología. Le enviaremos un recordatorio veinticuatro horas antes para que no se le olvide. ¿Hay algo más en lo que pueda ayudarle o alguna duda que tenga sobre su cita?"`;

            case 'prioritaria':
                return `${basePrompt}

MODO: CITAS PRIORITARIAS
- Evalúa la urgencia médica del paciente
- Coordina citas con prioridad (mañana o pasado mañana como máximo)
- Gestiona reprogramaciones rápidas
- Contacta especialistas directamente
- Proporciona alternativas inmediatas
- Usa horarios prioritarios (más tempranos en el día)

ESTILO ESPECÃFICO PARA CITAS PRIORITARIAS:
- Sé MUY empática y comprensiva con la situación del paciente
- Reconoce su preocupación y urgencia
- Tranquiliza al paciente asegurándole que se le dará prioridad
- Muestra que entiendes la importancia de su situación
- Sé cariñosa pero eficiente
- Ofrece apoyo y tranquilidad
- Usa expresiones como "entiendo perfectamente", "no se preocupe", "estoy aquí para ayudarle"

INSTRUCCIONES ESPECÃFICAS:
- Si se te proporciona información de cita prioritaria, proporciona TODOS los detalles: fecha completa, hora exacta, doctor, clínica
- Confirma que la cita prioritaria está coordinada con calidez
- Menciona que se enviará confirmación por mensaje
- NUNCA uses placeholders, usa la información exacta proporcionada
- Muestra que te importa su bienestar

Ejemplo de respuesta: "Entiendo perfectamente su situación y no se preocupe, estoy aquí para ayudarle. He coordinado una cita prioritaria con el doctor [nombre] para [fecha completa] a las [hora exacta] en [clínica]. Su código de cita es [ID]. Le enviaremos un mensaje de confirmación con todos los detalles para que tenga toda la información. ¿Hay algo más en lo que pueda ayudarle o alguna preocupación que tenga?"`;

            case 'urgencia':
                return `${basePrompt}

MODO: URGENCIAS MÃDICAS
- Activa protocolos de emergencia INMEDIATAMENTE
- Coordina atención inmediata (dentro de 30 minutos)
- Dirige al centro médico más cercano disponible 24 horas
- Proporciona códigos de referencia de urgencia
- Gestiona atención sin cita previa
- Proporciona dirección completa y teléfono de urgencias

ESTILO ESPECÃFICO PARA URGENCIAS:
- Sé MUY empática, cariñosa y comprensiva con la situación del paciente
- Reconoce su preocupación y urgencia con calidez
- Tranquiliza al paciente asegurándole que se le dará atención inmediata
- Muestra que te importa su bienestar y salud
- Sé clara y directa pero mantén un tono cariñoso y calmante
- Ofrece apoyo emocional además de la información médica
- Usa expresiones como "no se preocupe", "estamos aquí para ayudarle", "todo va a estar bien"
- Confirma que el personal médico está preparado para recibirle

INSTRUCCIONES ESPECÃFICAS:
- Si se te proporciona información de urgencia, proporciona TODOS los detalles: código de urgencia, clínica, dirección completa, teléfono, hora de llegada
- Confirma que el personal médico ya está informado con calidez
- Instruye al paciente a dirigirse INMEDIATAMENTE pero de forma cariñosa
- NUNCA uses placeholders, usa la información exacta proporcionada
- Muestra preocupación genuina por su bienestar

Ejemplo de respuesta: "Entiendo su situación y no se preocupe, estamos aquí para ayudarle. He activado el protocolo de emergencia y el personal médico ya está informado de su llegada. Por favor, diríjase INMEDIATAMENTE a [clínica] ubicada en [dirección completa]. Su código de urgencia es [código]. El teléfono de urgencias es [teléfono]. La hora estimada de llegada es [hora]. Todo va a estar bien, el equipo médico está preparado para atenderle. ¿Tiene alguna pregunta o necesita algo más antes de dirigirse?"`;

            default:
                return basePrompt;
        }
    }

    getFallbackMedicalResponse() {
        switch (this.currentServiceType) {
            case 'confirmacion':
                return 'Disculpe, permítame verificar su información en el sistema. ¿Podría proporcionarme su número de insurance ID para confirmar su cita médica?';
            case 'prioritaria':
                return 'Entiendo que necesita atención prioritaria. Permítame revisar la disponibilidad inmediata de especialistas. ¿Podría contarme brevemente cuál es su situación médica?';
            case 'urgencia':
                return 'Comprendo que es una urgencia médica. Voy a activar el protocolo inmediatamente. ¿Podría decirme cuál es su ubicación actual para dirigirle al centro más cercano?';
            default:
                return 'Permítame ayudarle con su consulta médica. ¿Podría proporcionarme más detalles sobre lo que necesita?';
        }
    }

    isEndOfServiceMessage(message) {
        const endPatterns = [
            'gracias por contactar',
            'que tenga un buen día',
            'cuidese mucho',
            'nos vemos en su cita',
            'hasta la próxima',
            'esperamos verle pronto'
        ];

        const lowerMessage = message.toLowerCase();
        return endPatterns.some(pattern => lowerMessage.includes(pattern));
    }

    // === SÃNTESIS DE VOZ ===
    async speak(text) {
        if (!text || this.volume === 0) return;

        const optimizedText = this.optimizeForElevenLabs(text);
        console.log('📋£ Carolina hablando:', optimizedText);

        this.isCarolinaSpeaking = true;
        this.updateCallStatus('📋£ Carolina respondiendo...', 'speaking');
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
                    console.error('✅ Error reproduciendo audio');
                    this.onSpeechEnded();
                };

                await this.currentAudio.play();

            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error ElevenLabs API:', response.status, errorData);
                throw new Error(`ElevenLabs API error: ${response.status} - ${errorData.detail?.message || errorData.message || 'Unknown error'}`);
            }

        } catch (error) {
            console.error('✅ Error síntesis de voz:', error);
            // Continuar sin audio si hay error
            this.onSpeechEnded();
        }
    }

    onSpeechEnded() {
        console.log('⚠Carolina terminó de hablar');
        this.isCarolinaSpeaking = false;
        this.audioVisualizer.style.display = 'none';
        this.updateCarolinaStatus('Lista');

        if (this.isCallActive) {
            this.updateCallStatus('📋§ Carolina escucha - Habla cuando quiera', 'listening');
            // Activar micrófono después de que Carolina termine de hablar
            setTimeout(() => {
                console.log('📋¤ Intentando activar micrófono después de que Carolina habló...');
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
        console.log('📋 Iniciando llamada médica...');

        this.isCallActive = true;
        this.callButton.innerHTML = '<i class="fas fa-phone-slash"></i> Finalizar Llamada';
        this.callButton.classList.add('active');
        this.stopButton.style.display = 'inline-block';

        this.updateCallStatus('📋 Llamada conectada - Departamento Médico', 'connected');
        this.updateCarolinaStatus('Conectada');

        // Carolina saluda según el tipo de servicio
        const greeting = this.getInitialGreeting();
        this.addToConversation(greeting, 'carolina');

        // Hablar el saludo
        await this.speak(greeting);

        // El micrófono se activará automáticamente después de que Carolina termine de hablar
        // en la función onSpeechEnded()

        console.log('⚠Llamada médica iniciada');
    }

    endCall() {
        console.log('📋 Finalizando llamada médica...');

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
        this.transcript.textContent = "Florida Medical Center - Sistema de gestión de citas médicas 🏥";

        console.log('⚠Llamada médica finalizada');
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

    // === GESTIÃN DE CONVERSACIÃN ===
    addToConversation(message, speaker) {
        const conversationItem = document.createElement('div');
        conversationItem.className = `conversation-item ${speaker === 'patient' ? 'patient-speech' : 'carolina-speech'}`;

        const label = document.createElement('div');
        label.className = 'speech-label';
        label.textContent = speaker === 'patient' ? '📋¤ Paciente:' : '📋¥ Carolina:';

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
                name: 'María González',
                phone: '3001234567',
                insurance ID: '1234567890',
                city: 'Miami',
                specialty: 'Cardiología',
                lastAppointment: '2024-03-15',
                status: 'confirmada'
            },
            {
                id: 2,
                name: 'Carlos Rodríguez',
                phone: '3109876543',
                insurance ID: '0987654321',
                city: 'Medellín',
                specialty: 'Ortopedia',
                lastAppointment: '2024-03-20',
                status: 'pendiente'
            },
            {
                id: 3,
                name: 'Ana Martínez',
                phone: '3157894561',
                insurance ID: '1122334455',
                city: 'Cali',
                specialty: 'Ginecología',
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
    carolinaSistema = new CarolinaFloridaMedicalSystem();
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

    console.log(`📋 Tipo de servicio cambiado a: ${type}`);
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

    // Activar botón seleccionado
    event.target.classList.add('active');
}

// === FUNCIONES DE BÃSQUEDA Y CRM ===
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
                    <div class="patient-info">📋± ${patient.phone}</div>
                    <div class="patient-info">📋 ${patient.insurance ID}</div>
                    <div class="patient-info">📋¥ ${patient.specialty}</div>
                    <div class="patient-info">📋 ${patient.city}</div>
                    <div class="patient-info">📋 Ãltima cita: ${patient.lastAppointment}</div>
                    <div class="patient-info">📋 Estado: <strong>${patient.status}</strong></div>
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
        patient.insurance ID.includes(searchTerm)
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
    alert(`Historial médico del paciente ID: ${patientId}`);
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
                        <h3>No hay informes generados aún</h3>
                        <p>Realiza una llamada y genera un informe automático médico</p>
                    </div>
                `;
        return;
    }

    container.innerHTML = carolinaSistema.reportsDatabase.map(report => `
                <div style="background: #ffffff; border: 1px solid #e0e0e0; border-radius: 6px; padding: 20px; margin: 10px 0;">
                    <h4 style="color: #0066cc; margin-bottom: 10px;">
                        📋 Informe Médico - ${new Date(report.date).toLocaleDateString()}
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <div>
                            <strong>Total Pacientes:</strong> ${report.data.totalPatients}
                        </div>
                        <div>
                            <strong>Llamadas Hoy:</strong> ${report.data.callsToday}
                        </div>
                        <div>
                            <strong>Tasa Confirmación:</strong> ${report.data.confirmationRate}%
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
    if (confirm('¿Está seguro de que desea eliminar todos los informes?')) {
        carolinaSistema.reportsDatabase = [];
        carolinaSistema.saveDatabaseToStorage();
        displayReports();
    }
}

// === INICIALIZACIÃN ===
document.addEventListener('DOMContentLoaded', function () {
    console.log('🏥 Inicializando Sistema Carolina Florida Medical Center...');
    initializeCarolinaSystem();

    // Cargar datos iniciales
    setTimeout(() => {
        if (carolinaSistema.patientsDatabase.length > 0) {
            displayPatientsList(carolinaSistema.patientsDatabase.slice(0, 5), 'crmPatientsList');
        }
        displayReports();
    }, 1000);
});