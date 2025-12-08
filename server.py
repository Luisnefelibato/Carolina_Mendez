#!/usr/bin/env python3
"""
Servidor proxy seguro para Carolina AI Assistant
Oculta las API keys del cliente y las gestiona en el backend
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import urllib.request
import urllib.error
import os
from urllib.parse import urlparse, parse_qs

# 🔐 API KEYS - CONFIGURAR AQUÍ (NO SE EXPONEN AL CLIENTE)
GEMINI_API_KEY = "TU_NUEVA_GEMINI_API_KEY_AQUI"  # ⚠️ REEMPLAZA CON TU KEY
ELEVENLABS_API_KEY = "2ee18909c2d84d715bbb7e856c7658c3b124a266fc5186a3f486ab9c9dc51304"
ELEVENLABS_VOICE_ID = "UNIruiz09F4kWYjRpOvy"

# URLs de las APIs
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent"
ELEVENLABS_TTS_URL = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}"

class SecureProxyHandler(SimpleHTTPRequestHandler):
    """Handler que sirve archivos estáticos y hace proxy a las APIs"""
    
    def end_headers(self):
        """Agregar headers CORS"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        """Manejar preflight requests"""
        self.send_response(200)
        self.end_headers()
    
    def do_POST(self):
        """Manejar requests POST a las APIs"""
        parsed_path = urlparse(self.path)
        
        # Proxy para Gemini API
        if parsed_path.path == '/api/gemini':
            self.proxy_gemini_request()
        
        # Proxy para ElevenLabs TTS
        elif parsed_path.path == '/api/tts':
            self.proxy_elevenlabs_request()
        
        else:
            self.send_error(404, "API endpoint not found")
    
    def do_GET(self):
        """Manejar requests GET"""
        parsed_path = urlparse(self.path)
        
        # Endpoint para obtener configuración (sin exponer las keys completas)
        if parsed_path.path == '/api/config':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            config = {
                'gemini_configured': bool(GEMINI_API_KEY and GEMINI_API_KEY != "TU_NUEVA_GEMINI_API_KEY_AQUI"),
                'elevenlabs_configured': bool(ELEVENLABS_API_KEY),
                'voice_id': ELEVENLABS_VOICE_ID,
                'api_proxy_enabled': True
            }
            self.wfile.write(json.dumps(config).encode())
        
        # Servir archivos estáticos
        else:
            super().do_GET()
    
    def proxy_gemini_request(self):
        """Proxy para Gemini API - oculta la API key del cliente"""
        try:
            # Verificar que la API key esté configurada
            if not GEMINI_API_KEY or GEMINI_API_KEY == "TU_NUEVA_GEMINI_API_KEY_AQUI":
                self.send_error(500, "Gemini API key not configured on server")
                return
            
            # Leer el body del request del cliente
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            
            # Hacer request a Gemini API con la key del servidor
            url_with_key = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"
            
            req = urllib.request.Request(
                url_with_key,
                data=body,
                headers={
                    'Content-Type': 'application/json'
                }
            )
            
            # Hacer el request
            with urllib.request.urlopen(req) as response:
                result = response.read()
                
                # Enviar respuesta al cliente
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(result)
                
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            print(f"❌ Gemini API Error: {e.code} - {error_body}")
            
            self.send_response(e.code)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(error_body.encode())
            
        except Exception as e:
            print(f"❌ Server Error: {str(e)}")
            self.send_error(500, f"Server error: {str(e)}")
    
    def proxy_elevenlabs_request(self):
        """Proxy para ElevenLabs TTS API - oculta la API key del cliente"""
        try:
            # Leer el body del request del cliente
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            
            # Hacer request a ElevenLabs API con la key del servidor
            req = urllib.request.Request(
                ELEVENLABS_TTS_URL,
                data=body,
                headers={
                    'Content-Type': 'application/json',
                    'xi-api-key': ELEVENLABS_API_KEY
                }
            )
            
            # Hacer el request
            with urllib.request.urlopen(req) as response:
                result = response.read()
                
                # Enviar respuesta al cliente
                self.send_response(200)
                self.send_header('Content-type', 'audio/mpeg')
                self.end_headers()
                self.wfile.write(result)
                
        except urllib.error.HTTPError as e:
            error_body = e.read().decode('utf-8')
            print(f"❌ ElevenLabs API Error: {e.code} - {error_body}")
            
            self.send_response(e.code)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(error_body.encode())
            
        except Exception as e:
            print(f"❌ Server Error: {str(e)}")
            self.send_error(500, f"Server error: {str(e)}")
    
    def log_message(self, format, *args):
        """Log personalizado con emojis"""
        path = args[0].split()[0] if args else ''
        
        if '/api/' in path:
            emoji = '🔐'
        elif path.endswith(('.js', '.css', '.html')):
            emoji = '📄'
        else:
            emoji = '📡'
        
        print(f"{emoji} {self.address_string()} - {format % args}")

def run_server(port=8080):
    """Iniciar el servidor seguro"""
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, SecureProxyHandler)
    
    print("╔════════════════════════════════════════════════════════════════╗")
    print("║                                                                ║")
    print("║      🏥 CAROLINA - SERVIDOR SEGURO CON PROXY DE APIs         ║")
    print("║                                                                ║")
    print("╚════════════════════════════════════════════════════════════════╝")
    print()
    print(f"🚀 Servidor iniciado en: http://0.0.0.0:{port}")
    print()
    print("✅ Ventajas de este servidor:")
    print("   • 🔐 API keys ocultas del cliente (seguras)")
    print("   • 🛡️  Proxy que protege las credenciales")
    print("   • 📡 CORS habilitado para desarrollo")
    print("   • 📊 Logs detallados con emojis")
    print()
    print("⚠️  IMPORTANTE:")
    print(f"   • Configura GEMINI_API_KEY en server.py (línea 14)")
    print(f"   • Configuración actual:")
    
    gemini_ok = bool(GEMINI_API_KEY and GEMINI_API_KEY != "TU_NUEVA_GEMINI_API_KEY_AQUI")
    print(f"     {'✅' if gemini_ok else '❌'} Gemini API Key: {'Configurada' if gemini_ok else 'NO CONFIGURADA'}")
    print(f"     ✅ ElevenLabs API Key: Configurada")
    print(f"     ✅ Voice ID: {ELEVENLABS_VOICE_ID}")
    print()
    print("🌐 Endpoints disponibles:")
    print("   • GET  /              → Interface web")
    print("   • GET  /api/config    → Verificar configuración")
    print("   • POST /api/gemini    → Proxy a Gemini API")
    print("   • POST /api/tts       → Proxy a ElevenLabs TTS")
    print()
    print("🛑 Para detener: Ctrl + C")
    print("═" * 64)
    print()
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n🛑 Servidor detenido")
        httpd.shutdown()

if __name__ == '__main__':
    run_server(8080)
