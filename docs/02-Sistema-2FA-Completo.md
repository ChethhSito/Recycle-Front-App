# Sistema de Verificación en 2 Pasos (2FA)

Sistema completo de autenticación de dos factores con OTP de 4 dígitos, expiración de 10 minutos y envío por Email (Resend) o SMS (Firebase).

## 📋 Características

### ✅ Implementado
- 🔐 **Generación Segura de OTP**: Códigos de 4 dígitos sin patrones débiles (0000, 1111, 1234, etc.)
- ⏰ **Expiración Temporal**: Códigos válidos por 10 minutos
- 🔒 **Uso Único**: Cada código se puede usar solo una vez
- 📧 **Email (Resend)**: Envío de códigos por correo electrónico
- 📱 **SMS (Firebase)**: Preparado para envío por SMS
- 🧪 **Modo Testing**: Modal visual para desarrollo sin servicios externos
- 📊 **Temporizador Visual**: Muestra tiempo restante del código
- 🎨 **UI Moderna**: Diseño limpio y profesional

### 🚧 Pendiente de Configuración
- Backend API para Resend (código de ejemplo incluido)
- Configuración de Firebase Phone Authentication
- Variables de entorno para credenciales

## 📁 Estructura de Archivos

```
src/modules/settings/two-factor-auth/
├── two-factor-info-screen.jsx      # Paso 1: Información y beneficios
├── two-factor-method-screen.jsx    # Paso 2: Selección SMS/Email
├── two-factor-verify-screen.jsx    # Paso 3: Ingreso de código
├── two-factor-success-screen.jsx   # Paso 4: Confirmación exitosa
├── otpManager.js                   # Gestión de OTP (generación, almacenamiento, validación)
├── resendService.js                # Servicio de email con Resend
├── firebaseService.js              # Servicio de SMS con Firebase
├── emailLimiter.js                 # Limitador de emails (200/mes)
└── README.md                       # Este archivo
```

## 🔄 Flujo de Usuario

### 1. Información (two-factor-info-screen)
- Explica qué es la verificación en 2 pasos
- Lista beneficios de seguridad
- Botón "Empezar" → Paso 2

### 2. Selección de Método (two-factor-method-screen)
- Tarjetas para elegir Email o SMS
- Genera OTP seguro al seleccionar
- Intenta envío real (Email/SMS)
- Si falla, muestra modal de testing con código
- Navega a verificación con método y destino

### 3. Verificación de Código (two-factor-verify-screen)
- 4 inputs para dígitos del código
- Temporizador de 10 minutos visible
- Validación contra OTP almacenado
- Verificación de expiración y uso único
- Botón "Reenviar" para nuevo código
- Navega a éxito si es correcto

### 4. Confirmación (two-factor-success-screen)
- Animación de éxito
- Mensaje de activación exitosa
- Botón "Finalizar" → Regresa a Settings
- Pasa parámetro `twoFactorActivated=true`

## 🔐 Sistema de OTP

### Generación Segura (`otpManager.js`)

```javascript
generateSecureOTP()
```

- Genera códigos de 4 dígitos (1000-9999)
- Evita patrones débiles:
  - Todos iguales: 0000, 1111, 2222...
  - Secuenciales: 1234, 4321, 0123...
  - Parejas: 1122, 3344, 5566...
- Máximo 10 intentos para encontrar código seguro

### Almacenamiento

```javascript
await storeOTP(code, destination)
```

- Guarda en AsyncStorage:
  - `twoFactor_otp`: Código cifrado
  - `twoFactor_destination`: Email o teléfono
  - `twoFactor_expiry`: Timestamp de expiración (10 min)
  - `twoFactor_used`: Flag de uso único

### Verificación

```javascript
const isValid = await verifyOTP(enteredCode)
```

- Compara código ingresado con almacenado
- Verifica que no haya expirado
- Verifica que no haya sido usado
- Marca como usado si es válido
- Retorna `true`/`false`

### Tiempo Restante

```javascript
const seconds = await getOTPTimeRemaining()
```

- Calcula segundos restantes hasta expiración
- Retorna 0 si ya expiró
- Usado para mostrar temporizador visual

### Limpieza

```javascript
await clearOTP()
```

- Elimina todos los datos de OTP de AsyncStorage
- Ejecutar después de verificación exitosa

## 📧 Servicio de Email (Resend)

### Archivo: `resendService.js`

```javascript
const result = await sendOTPEmail(email, name, otp);
// { success: true/false, messageId: string }
```

### Configuración Requerida

#### 1. Backend API
El servicio requiere un endpoint backend como intermediario:

```javascript
// backend/routes/email.js
const express = require('express');
const { Resend } = require('resend');
const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/send-otp', async (req, res) => {
  const { email, name, otp } = req.body;
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Recycle App <noreply@tudominio.com>',
      to: [email],
      subject: 'Código de Verificación - Recycle App',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #018f64 0%, #00d084 100%); 
                        color: white; padding: 30px; text-align: center; border-radius: 12px; }
              .code-box { background: #f3f4f6; border: 2px solid #018f64; 
                          border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
              .code { font-size: 48px; font-weight: bold; color: #018f64; 
                      letter-spacing: 8px; }
              .warning { background: #fef3c7; border-left: 4px solid #f59e0b; 
                        padding: 16px; margin: 24px 0; border-radius: 8px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Código de Verificación</h1>
              </div>
              
              <p>Hola ${name},</p>
              <p>Has solicitado activar la verificación en 2 pasos. Usa este código:</p>
              
              <div class="code-box">
                <div class="code">${otp}</div>
                <p style="color: #6b7280; margin-top: 12px;">Válido por 10 minutos</p>
              </div>
              
              <div class="warning">
                <strong>⚠️ Importante:</strong> Nunca compartas este código con nadie.
              </div>
              
              <p>Si no solicitaste este código, ignora este mensaje.</p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
              <p style="color: #9ca3af; font-size: 12px; text-align: center;">
                © 2024 Recycle App. Todos los derechos reservados.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.json({ success: true, messageId: data.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

#### 2. Configurar Resend

1. **Crear cuenta en Resend**: https://resend.com/signup
2. **Obtener API Key**: Dashboard → API Keys → Create API Key
3. **Configurar dominio** (opcional pero recomendado):
   - Dashboard → Domains → Add Domain
   - Agregar registros DNS según instrucciones
   - Sin dominio, usar: `onboarding@resend.dev` (limitado)

4. **Variables de entorno** (`.env`):
```env
RESEND_API_KEY=re_tu_api_key_aqui
```

#### 3. Actualizar URL en `resendService.js`

```javascript
const BACKEND_URL = 'https://tu-backend.com/api/email/send-otp';
```

### Precios Resend
- **100 emails/día**: GRATIS
- **3,000 emails/mes**: GRATIS
- Después: $1 por cada 1,000 emails adicionales

## 📱 Servicio de SMS (Firebase)

### Archivo: `firebaseService.js`

```javascript
await sendOTPSMS(phoneNumber, otp);
```

### Configuración Requerida

#### 1. Instalar Dependencias

```bash
npm install @react-native-firebase/app @react-native-firebase/auth
```

#### 2. Configurar Firebase

**Android** (`android/app/google-services.json`):
1. Ir a [Firebase Console](https://console.firebase.google.com)
2. Crear proyecto o usar existente
3. Agregar aplicación Android
4. Descargar `google-services.json`
5. Colocar en `android/app/`
6. Modificar `android/build.gradle`:
```gradle
buildscript {
  dependencies {
    classpath 'com.google.gms:google-services:4.3.15'
  }
}
```
7. Modificar `android/app/build.gradle`:
```gradle
apply plugin: 'com.google.gms.google-services'
```

**iOS** (`ios/GoogleService-Info.plist`):
1. Agregar aplicación iOS en Firebase
2. Descargar `GoogleService-Info.plist`
3. Arrastrar a proyecto Xcode
4. Modificar `ios/AppDelegate.m`:
```objc
#import <Firebase.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  // ...
}
```

#### 3. Habilitar Phone Authentication

1. Firebase Console → Authentication
2. Sign-in method → Phone → Enable
3. Para testing: agregar número de prueba (+51 982 109 407, código: 123456)

#### 4. Descomentar Código en `firebaseService.js`

```javascript
import auth from '@react-native-firebase/auth';

export const sendOTPSMS = async (phoneNumber, otp) => {
  const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
  return confirmation;
};
```

### Precios Firebase
- **Primeros 10,000 SMS/mes**: GRATIS
- Después: $0.01 - $0.06 por SMS según país
- Perú: ~$0.03 por SMS

### Alternativas SMS

**Twilio** (más económico):
```bash
npm install twilio
```
- 1000 SMS gratis al registrarse
- $0.0075 por SMS después
- Documentación: https://www.twilio.com/docs/sms/quickstart/node

## 🎨 Modal de Testing

### Archivo: `TestingModeModal.jsx`

Modal visual mostrado cuando no se puede enviar código real (desarrollo o error):

**Características**:
- 🎨 Colores específicos por método (email: azul, SMS: morado)
- 🔢 Código OTP destacado visualmente
- 📋 Instrucciones paso a paso
- 📌 Muestra destino (email o teléfono)
- ✅ Botón "Entendido" para continuar

**Cuándo se muestra**:
- Email: Si Resend no está configurado o falla
- SMS: Si Firebase no está configurado o falla
- Desarrollo: `__DEV__` es `true`

## ⚙️ Integración en Settings

### Archivo: `settings-screen.jsx`

```javascript
// Toggle de 2FA
<TouchableOpacity 
  style={styles.optionRow}
  onPress={() => {
    if (!twoFactorEnabled) {
      navigation.navigate('TwoFactorInfo'); // Iniciar flujo
    } else {
      setTwoFactorEnabled(false); // Desactivar
    }
  }}
>
  {/* UI del toggle */}
</TouchableOpacity>

// Escuchar activación exitosa
useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    if (route.params?.twoFactorActivated) {
      setTwoFactorEnabled(true);
      navigation.setParams({ twoFactorActivated: undefined });
    }
  });
  return unsubscribe;
}, [navigation]);
```

## 🧪 Testing

### Modo Desarrollo

1. **Sin configuración externa**:
   - No requiere Resend ni Firebase
   - Modal muestra código generado
   - Flujo completo funcional

2. **Verificar generación segura**:
```javascript
import { generateSecureOTP } from './otpManager';

for (let i = 0; i < 100; i++) {
  const code = generateSecureOTP();
  console.log(code); // Nunca debe mostrar 0000, 1111, 1234, etc.
}
```

3. **Probar expiración**:
```javascript
// Modificar temporalmente en otpManager.js
const EXPIRY_TIME = 30 * 1000; // 30 segundos para testing
```

### Modo Producción

1. **Email con Resend**:
   - Configurar backend y API key
   - Actualizar URL en `resendService.js`
   - Verificar dominio verificado
   - Probar envío real

2. **SMS con Firebase**:
   - Configurar Firebase Phone Auth
   - Agregar números de testing
   - Descomentar código en `firebaseService.js`
   - Probar con número real

## 📊 Monitoreo

### Logs Disponibles

```javascript
// Generación
console.log('[2FA] Código generado: 1234');
console.log('[2FA] Método: Email');

// Envío
console.log('[2FA] Email enviado exitosamente');
console.log('[2FA] SMS enviado exitosamente');
console.log('[2FA] Fallback a modo testing');

// Verificación
console.log('[2FA] ✅ Código correcto');
console.log('[2FA] ❌ Código incorrecto');
console.log('[2FA] ❌ Código expirado');

// Estadísticas
const stats = await getOTPStats();
console.log(stats);
// {
//   hasOTP: true,
//   isExpired: false,
//   isUsed: false,
//   timeRemaining: 547,
//   destination: 'raulquintanazinc@gmail.com'
// }
```

### AsyncStorage Keys

- `twoFactor_otp`: Código OTP actual
- `twoFactor_destination`: Email o teléfono
- `twoFactor_expiry`: Timestamp de expiración
- `twoFactor_used`: Flag de uso único
- `email_counter`: Contador de emails enviados
- `email_month`: Mes actual del contador

## 🔒 Seguridad

### Mejores Prácticas Implementadas

✅ **Códigos Seguros**: Sin patrones fáciles de adivinar  
✅ **Expiración Temporal**: Ventana de 10 minutos  
✅ **Uso Único**: No se puede reusar el mismo código  
✅ **Almacenamiento Local**: AsyncStorage (solo dispositivo)  
✅ **Validación Estricta**: Verificación lado cliente  

### Recomendaciones Adicionales

🔐 **Backend Validation**: Verificar también en servidor  
🔐 **Rate Limiting**: Limitar intentos de verificación  
🔐 **HTTPS Only**: Usar SSL/TLS en todas las comunicaciones  
🔐 **Logs Sanitized**: No logear códigos en producción  
🔐 **Cifrado**: Cifrar códigos en AsyncStorage (opcional)  

## 🚀 Próximos Pasos

### Para Testing Local
1. ✅ Probar flujo completo con modal de testing
2. ✅ Verificar expiración de códigos
3. ✅ Verificar uso único
4. ✅ Probar navegación entre pantallas

### Para Producción
1. ⬜ Desplegar backend con Resend
2. ⬜ Configurar Firebase Phone Auth
3. ⬜ Agregar variables de entorno
4. ⬜ Probar envío real de emails
5. ⬜ Probar envío real de SMS
6. ⬜ Implementar rate limiting en backend
7. ⬜ Agregar logging en servidor
8. ⬜ Configurar monitoreo de errores

## 📞 Soporte

### Información de Contacto
- **Email de prueba**: raulquintanazinc@gmail.com
- **Teléfono de prueba**: +51 982 109 407

### Recursos
- **Resend Docs**: https://resend.com/docs
- **Firebase Auth Docs**: https://firebase.google.com/docs/auth/android/phone-auth
- **React Native Firebase**: https://rnfirebase.io/auth/phone-auth

---

**Versión**: 1.0.0  
**Última actualización**: 2024  
**Desarrollado para**: Recycle App
