# 📧 API Email Services

Servicios de email organizados por funcionalidad usando **Resend API**.

## 📁 Estructura de Carpetas

```
src/api/email/
├── index.js                    # Exportaciones centralizadas
├── suspension/                 # Servicios de suspensión de cuenta
│   └── suspension-email.js     # Envío de notificaciones de suspensión
└── two-factor/                 # Servicios de autenticación 2FA
    ├── resendService.js        # Envío de códigos OTP por email
    └── otpManager.js           # Generación y validación de códigos OTP
```

## 🚀 Uso

### Importación Centralizada (Recomendado)

```javascript
import { 
    sendSuspensionEmail,      // Suspensión
    sendOTPEmail,             // 2FA Email
    generateSecureOTP,        // Generar OTP
    verifyOTP                 // Verificar OTP
} from '../../../api/email';
```

### Importación Directa

```javascript
// Suspensión
import { sendSuspensionEmail } from '../../../api/email/suspension/suspension-email';

// 2FA
import { sendOTPEmail } from '../../../api/email/two-factor/resendService';
import { generateSecureOTP, verifyOTP } from '../../../api/email/two-factor/otpManager';
```

## 📋 Servicios Disponibles

### 1️⃣ Suspensión de Cuenta

**Archivo:** `suspension/suspension-email.js`

```javascript
const result = await sendSuspensionEmail(
    'user@example.com',
    'Juan Pérez',
    new Date()
);

if (result.success) {
    console.log('Email enviado:', result.messageId);
} else {
    console.error('Error:', result.error);
}
```

**Características:**
- ✅ Email HTML con diseño profesional
- ✅ Contador de 30 días de gracia
- ✅ Fecha de eliminación programada
- ✅ Instrucciones de restauración

### 2️⃣ Autenticación de Dos Factores (2FA)

**Archivos:** `two-factor/resendService.js` + `two-factor/otpManager.js`

#### Generar y Enviar OTP

```javascript
// 1. Generar código
const otp = generateSecureOTP(); // '2551'

// 2. Guardar en AsyncStorage
await storeOTP(otp, 'user@example.com');

// 3. Enviar por email
const result = await sendOTPEmail(
    'user@example.com',
    'Juan Pérez',
    otp
);
```

#### Verificar OTP

```javascript
const isValid = await verifyOTP(userInput, 'user@example.com');

if (isValid) {
    console.log('✅ Código correcto');
    await clearOTP(); // Limpiar código usado
} else {
    console.log('❌ Código incorrecto o expirado');
}
```

**Características:**
- ✅ Código de 4 dígitos
- ✅ Validez de 10 minutos
- ✅ Almacenamiento seguro en AsyncStorage
- ✅ Email HTML con diseño verde Recycle App

## 🔑 Configuración de API Key

Archivo: `.env`

```env
EXPO_PUBLIC_RESEND_API_KEY=re_HghWgCkW_PJUE8NZDmSGKg4tPwHmXovsK
```

**Nota:** Resend en modo prueba solo envía a `raulquintanazinc@gmail.com`. Para producción, verifica tu dominio en [resend.com/domains](https://resend.com/domains).

## 📊 Límites de Resend (Plan Gratuito)

- ✅ 100 emails/día
- ✅ 3,000 emails/mes
- ⚠️ Solo emails de prueba a `raulquintanazinc@gmail.com`
- 📧 Remitente: `Recycle App <onboarding@resend.dev>`

## 🛠️ Solución de Problemas

### Error 403: "You can only send testing emails..."

Este es un comportamiento normal en modo prueba. Para enviar a cualquier email:

1. Verifica tu dominio en [resend.com/domains](https://resend.com/domains)
2. Cambia el `from` de `onboarding@resend.dev` a `noreply@tudominio.com`
3. Actualiza DNS con los registros proporcionados por Resend

### El email no llega

1. **Revisa la consola** para ver el `messageId`
2. **Revisa spam/correo no deseado**
3. **Verifica el email destino** (debe ser `raulquintanazinc@gmail.com` en modo prueba)
4. **Chequea logs** de Resend en [resend.com/emails](https://resend.com/emails)

## 📝 Migración desde Versión Anterior

**Antes:**
```javascript
import { sendSuspensionEmail } from '../../../api/email/suspension-email';
```

**Ahora:**
```javascript
import { sendSuspensionEmail } from '../../../api/email/suspension/suspension-email';
// O mejor:
import { sendSuspensionEmail } from '../../../api/email';
```

## ✅ Estado de Migración

- ✅ `DeleteAccountModal.jsx` - Import actualizado
- ✅ `two-factor-auth/` - Archivos copiados (mantener originales por compatibilidad)
- ✅ Verificado con `get_errors` - 0 errores

## 📚 Documentación Adicional

- [Resend API Docs](https://resend.com/docs)
- [React Native AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)

---

**Última actualización:** 13 de enero de 2026  
**Autor:** Raul Quintana  
**Proyecto:** Recycle App
