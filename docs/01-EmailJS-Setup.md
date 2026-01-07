# Configuración EmailJS para Verificación 2FA

## Pasos para activar el envío de emails GRATIS:

### 1. Crear cuenta en EmailJS
- Ve a: https://www.emailjs.com/
- Crea una cuenta gratuita (100 emails/mes gratis)

### 2. Configurar el servicio de email
1. En el dashboard, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona tu proveedor (Gmail, Outlook, etc.)
4. Conecta tu cuenta de email
5. Copia el **Service ID** (ej: `service_abc123`)

### 3. Crear plantilla de email
1. Ve a "Email Templates"
2. Haz clic en "Create New Template"
3. Usa este contenido:

**Subject:**
```
Tu código de verificación - Recycle App
```

**Body:**
```
Hola {{to_name}},

Tu código de verificación en 2 pasos es:

{{verification_code}}

Este código es válido por 10 minutos.

Si no solicitaste este código, ignora este mensaje.

Saludos,
Equipo Recycle App
```

4. Guarda y copia el **Template ID** (ej: `template_xyz789`)

### 4. Obtener Public Key
1. Ve a "Account" en el menú
2. Copia tu **Public Key** (ej: `YOUR_PUBLIC_KEY`)

### 5. Actualizar el código
Abre: `src/modules/settings/two-factor-auth/two-factor-method-screen.jsx`

Reemplaza en la línea ~35:
```javascript
service_id: 'service_recycle',     // TU Service ID
template_id: 'template_2fa',       // TU Template ID  
user_id: 'YOUR_PUBLIC_KEY',        // TU Public Key
```

Con tus valores reales:
```javascript
service_id: 'service_abc123',      // El que copiaste en paso 2
template_id: 'template_xyz789',    // El que copiaste en paso 3
user_id: 'tu_public_key_aqui',     // El que copiaste en paso 4
```

## ¡Listo!
Ahora cuando selecciones "Correo Electrónico" en la app, se enviará un email real a raulquintanazinc@gmail.com con el código de verificación.

## Modo Testing (Actual)
Si no configuras EmailJS aún, la app mostrará el código en un Alert para que puedas probarlo igual.
