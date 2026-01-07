# Sistema de Verificación en 2 Pasos (2FA) - Versión Final

Sistema completo de autenticación de dos factores con dos métodos: **Email (Real)** y **SMS (Simulación)**.

## 📱 Métodos Disponibles

### 1. ✉️ Email - Envío Real con Resend
- ✅ **Funciona sin backend**
- ✅ Usa API directa de Resend
- ✅ API Key: `re_NcebB7UA_Ee6uifkPMUSyPMFPYYoSiz9b`
- ✅ Dominio: `onboarding@resend.dev`
- ✅ Plan gratuito: 100 emails/día, 3000/mes
- ✅ Email real enviado con template HTML profesional
- ✅ Destinatario: raulquintanazinc@gmail.com

### 2. 📱 SMS - Simulación de Mensaje
- ✅ **Modo testing/desarrollo**
- ✅ Modal que simula mensaje SMS real
- ✅ Diseño tipo burbuja de mensaje
- ✅ Muestra código como si fuera SMS del teléfono
- ✅ Auto-cierre o manual
- ✅ Teléfono simulado: +51 982 109 407

## 🎨 Interfaz de Usuario

### Pantalla de Selección de Método
Muestra **DOS tarjetas**:

1. **SMS (Morado)**
   - Icono: Teléfono
   - Badge: "Modo Testing"
   - Descripción: "Simulación - Código en modal"
   
2. **Email (Verde)** ⭐ Recomendado
   - Icono: Correo
   - Badge: "Envío Real"
   - Descripción: Email del usuario
   - Borde destacado verde

### Modal de Simulación SMS
Cuando seleccionas SMS, aparece un modal que **simula un mensaje de texto real**:

```
┌─────────────────────────────┐
│ 📱 Nuevo Mensaje SMS    [X] │
├─────────────────────────────┤
│ 💬 Recycle App              │
│ Ahora                       │
│                             │
│ ╭─────────────────────────╮ │
│ │ Tu código es:           │ │
│ │                         │ │
│ │      1234               │ │
│ │                         │ │
│ │ Válido por 10 minutos   │ │
│ ╰─────────────────────────╯ │
│                             │
│ 🛡️ Mensaje simulado         │
├─────────────────────────────┤
│   [Continuar verificación]  │
└─────────────────────────────┘
```

### Modal de Desarrollo Email
Si Resend falla, muestra modal alternativo con el código.

## 🔄 Flujo Completo

```
Settings
   ↓ (Activar 2FA)
TwoFactorInfo
   ↓ (Empezar)
TwoFactorMethod
   ├─→ SMS (Simulación)
   │    ↓
   │   Modal SMS (3 seg)
   │    ↓
   └─→ Email (Real Resend)
        ↓
       Email enviado
        ↓
TwoFactorVerify
   ↓ (Código correcto)
TwoFactorSuccess
   ↓
Settings (2FA Activado)
```

## 📂 Archivos del Sistema

```
src/modules/settings/two-factor-auth/
├── two-factor-info-screen.jsx       # Paso 1: Información
├── two-factor-method-screen.jsx     # Paso 2: Selección (SMS o Email)
├── two-factor-verify-screen.jsx     # Paso 3: Ingreso de código
├── two-factor-success-screen.jsx    # Paso 4: Confirmación
├── otpManager.js                    # Generación y validación OTP
└── resendService.js                 # Envío real con Resend

src/componentes/modal/settings/
└── TestingModeModal.jsx             # Modal SMS + Email testing

docs/
├── 01-EmailJS-Setup.md              # Guía EmailJS (deprecada)
├── 02-Sistema-2FA-Completo.md       # Documentación completa
└── 03-Sistema-2FA-Solo-Email.md     # Versión anterior
```

## 🔐 Seguridad OTP

### Generación (otpManager.js)
```javascript
generateSecureOTP()
// - Códigos de 4 dígitos: 1000-9999
// - Evita: 0000, 1111, 2222...9999
// - Evita: 1234, 4321, 0123, 9876
// - Evita: 1122, 3344, 5566...
// - Máximo 10 intentos
```

### Características
- ✅ Expiración: 10 minutos
- ✅ Uso único
- ✅ Timer visible en pantalla
- ✅ Función reenviar
- ✅ Validación estricta

## 📧 Configuración Resend

### Código Actual (resendService.js)
```javascript
const RESEND_API_KEY = 're_NcebB7UA_Ee6uifkPMUSyPMFPYYoSiz9b';
const RESEND_API_URL = 'https://api.resend.com/emails';

export const sendOTPEmail = async (email, name, otp) => {
    const response = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: 'Recycle App <onboarding@resend.dev>',
            to: [email],
            subject: '🔐 Código de Verificación - Recycle App',
            html: `...template HTML profesional...`,
        }),
    });
    // ...
};
```

### Template HTML
El email incluye:
- 🎨 Diseño responsive
- 🔐 Código destacado en grande
- ⏰ Indicador de 10 minutos
- ⚠️ Advertencia de seguridad
- 🌱 Branding Recycle App

## 🧪 Testing

### Probar SMS (Simulación)
1. Settings → Activar "Verificación en 2 pasos"
2. Click "Empezar"
3. Seleccionar "Mensaje de Texto (SMS)"
4. Ver modal simulando SMS con código
5. Copiar código del modal
6. Ingresar en pantalla de verificación
7. Completar flujo

### Probar Email (Real)
1. Settings → Activar "Verificación en 2 pasos"
2. Click "Empezar"
3. Seleccionar "Correo Electrónico"
4. Verificar email enviado a raulquintanazinc@gmail.com
5. Copiar código del email
6. Ingresar en pantalla de verificación
7. Completar flujo

### Si Email Falla
Si Resend no puede enviar:
- Se muestra modal de desarrollo
- Código visible en pantalla
- Continuar verificación normalmente

## 💡 Diferencias Visuales

### SMS Modal
- Color morado (#8B5CF6)
- Diseño tipo burbuja de mensaje
- Apariencia de notificación SMS
- Texto "Mensaje SMS"
- Badge "Modo Testing"

### Email Modal (Fallback)
- Color verde (#018f64)
- Diseño card moderno
- Icono de email
- Texto "Modo Desarrollo"
- Información de Resend

## 🎯 Estado Actual

✅ **Completamente Funcional**
- Dos métodos disponibles (SMS simulado + Email real)
- UI diferenciada por método
- SMS con apariencia de mensaje real
- Email con envío real vía Resend
- Modal elegante para cada método
- Sin errores de compilación

## 🚀 Cómo Ejecutar

```bash
# Instalar dependencias si es necesario
npm install

# Iniciar la app
npm start
# o
npx expo start

# Probar flujo completo
# 1. Ir a Settings
# 2. Activar toggle 2FA
# 3. Elegir método (SMS o Email)
# 4. Ver código en modal o email
# 5. Ingresar código
# 6. Completar verificación
```

## 📞 Contactos de Prueba

- **Email**: raulquintanazinc@gmail.com
- **Teléfono** (simulado): +51 982 109 407
- **API Key Resend**: re_NcebB7UA_Ee6uifkPMUSyPMFPYYoSiz9b

---

**Versión**: 3.0.0 (SMS Simulado + Email Real)  
**Última actualización**: Enero 2026  
**Estado**: ✅ Producción (Email) + Testing (SMS)
