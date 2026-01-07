/**
 * Resend Email Service
 * Servicio para envío directo de OTP por email usando Resend API sin backend.
 * API KEY: re_NcebB7UA_Ee6uifkPMUSyPMFPYYoSiz9b
 * Plan: 100 emails/día GRATIS, 3000 emails/mes GRATIS
 * Dominio: onboarding@resend.dev (temporal de Resend)
 */

const RESEND_API_KEY = 're_NcebB7UA_Ee6uifkPMUSyPMFPYYoSiz9b';
const RESEND_API_URL = 'https://api.resend.com/emails';

/**
 * Envía un código OTP por email usando Resend (directo, sin backend)
 * @param {string} email - Email destino
 * @param {string} name - Nombre del destinatario
 * @param {string} otp - Código OTP de 4 dígitos
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
export const sendOTPEmail = async (email, name, otp) => {
    try {
        console.log('[Resend] Enviando OTP por email...');
        console.log('[Resend] Destinatario:', email);
        console.log('[Resend] Código:', otp);

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
                html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1F2937; margin: 0; padding: 0; background-color: #F3F4F6; }
        .container { max-width: 600px; margin: 40px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #018f64 0%, #00d084 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; color: #1F2937; margin-bottom: 20px; }
        .code-box { background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%); border: 3px solid #018f64; border-radius: 16px; padding: 32px; margin: 32px 0; text-align: center; }
        .code-label { font-size: 14px; color: #047857; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
        .code { font-size: 56px; font-weight: 900; color: #018f64; letter-spacing: 16px; font-family: 'Courier New', monospace; }
        .expiry { color: #059669; margin-top: 16px; font-size: 16px; font-weight: 600; }
        .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; margin: 24px 0; border-radius: 8px; }
        .warning-title { color: #92400E; font-weight: 700; font-size: 16px; margin: 0 0 8px 0; }
        .warning-text { color: #78350F; margin: 0; font-size: 14px; }
        .info-text { color: #6B7280; font-size: 15px; line-height: 1.7; margin: 16px 0; }
        .footer { background: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB; }
        .footer-text { color: #9CA3AF; font-size: 13px; margin: 0; }
        .app-name { color: #018f64; font-weight: 700; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header"><h1>🔐 Código de Verificación</h1></div>
        <div class="content">
            <p class="greeting">Hola <strong>${name}</strong>,</p>
            <p class="info-text">Has solicitado activar la <strong>verificación en 2 pasos</strong> en Recycle App. Para continuar, ingresa el siguiente código:</p>
            <div class="code-box">
                <div class="code-label">Tu Código de Seguridad</div>
                <div class="code">${otp}</div>
                <p class="expiry">⏰ Válido por 10 minutos</p>
            </div>
            <div class="warning">
                <p class="warning-title">⚠️ Importante - Seguridad</p>
                <p class="warning-text">Nunca compartas este código con nadie. El equipo de Recycle App nunca te pedirá este código.</p>
            </div>
            <p class="info-text">Si no solicitaste este código, ignora este mensaje. Tu cuenta permanece protegida.</p>
        </div>
        <div class="footer">
            <p class="footer-text">© ${new Date().getFullYear()} <span class="app-name">Recycle App</span> - Todos los derechos reservados</p>
            <p class="footer-text" style="margin-top: 8px;">Protegiendo el medio ambiente, un paso a la vez 🌱</p>
        </div>
    </div>
</body>
</html>
                `,
            }),
        });

        const result = await response.json();

        if (response.ok && result.id) {
            console.log('[Resend] ✅ Email enviado exitosamente');
            console.log('[Resend] Message ID:', result.id);
            return { success: true, messageId: result.id };
        } else {
            console.error('[Resend] ❌ Error al enviar:', result);
            return { success: false, error: result.message || 'Error desconocido' };
        }
    } catch (error) {
        console.error('[Resend] ❌ Error de conexión:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Plantilla HTML del email (usado en el backend)
 * Este es el código que debes usar en tu servidor Node.js/Express
 */
export const EMAIL_TEMPLATE_BACKEND_CODE = `
// Backend Node.js + Express + Resend
const { Resend } = require('resend');
const resend = new Resend('tu_api_key_de_resend');

app.post('/api/send-otp', async (req, res) => {
    const { to, name, otp } = req.body;
    
    try {
        const { data, error } = await resend.emails.send({
            from: 'Recycle App <onboarding@resend.dev>', // Cambiar por tu dominio
            to: [to],
            subject: 'Tu código de verificación - Recycle App',
            html: \`
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Código de Verificación</title>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #059669, #047857); padding: 40px; text-align: center; }
    .logo { background: white; border-radius: 50%; padding: 20px; display: inline-block; }
    .content { padding: 40px; }
    .otp-box { background: #ecfdf5; border: 3px solid #059669; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
    .otp-code { font-size: 36px; font-weight: bold; color: #065f46; letter-spacing: 8px; }
    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <img src="https://i.postimg.cc/fyFSyfVn/image.png" alt="Logo" width="60">
      </div>
    </div>
    <div class="content">
      <h1 style="color: #111827; text-align: center;">Código de verificación</h1>
      <p>Hola <strong>\${name}</strong>,</p>
      <p>Tu código de verificación para <strong style="color: #059669;">Recycle App</strong> es:</p>
      <div class="otp-box">
        <div style="font-size: 12px; color: #059669; font-weight: bold; margin-bottom: 10px;">TU CÓDIGO</div>
        <div class="otp-code">\${otp}</div>
      </div>
      <div class="warning">
        <strong>⏱️ Importante:</strong> Este código es válido por <strong>10 minutos</strong>.
      </div>
      <div class="warning" style="background: #fee2e2; border-left-color: #ef4444;">
        <strong>🔒 Seguridad:</strong> Nunca compartas este código. Si no solicitaste esto, ignora este mensaje.
      </div>
    </div>
  </div>
</body>
</html>
            \`
        });
        
        if (error) {
            return res.status(400).json({ error });
        }
        
        res.json({ success: true, id: data.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
`;
