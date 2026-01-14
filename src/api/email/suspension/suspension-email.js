/**
 * Suspension Email Service
 * Servicio para envío de notificaciones de suspensión de cuenta usando Resend API
 * Usa la MISMA configuración que resendService.js (que SÍ funciona)
 */

const RESEND_API_KEY = process.env.EXPO_PUBLIC_RESEND_API_KEY;
const RESEND_API_URL = 'https://api.resend.com/emails';

/**
 * Envía notificación de suspensión de cuenta
 * @param {string} email - Email del usuario
 * @param {string} name - Nombre del usuario
 * @param {Date} suspensionDate - Fecha de suspensión
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
export const sendSuspensionEmail = async (email, name , suspensionDate) => {
    try {
        // FORZAR EMAIL A raulquintanazinc@gmail.com (Resend solo permite este email en modo prueba)
        const destinationEmail = 'raulquintanazinc@gmail.com';
        const name = "Raul Quintana";

        console.log('[Suspension Email] Enviando notificación a:', destinationEmail);
        console.log('[Suspension Email] Email original era:', email);

        // Validar API Key
        if (!RESEND_API_KEY) {
            console.error('❌ RESEND_API_KEY no configurada');
            return {
                success: false,
                error: 'API Key no configurada'
            };
        }

        // Calcular fecha límite (30 días después)
        const deletionDate = new Date(suspensionDate);
        deletionDate.setDate(deletionDate.getDate() + 30);

        const deletionDateFormatted = deletionDate.toLocaleDateString('es-PE', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const response = await fetch(RESEND_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Recycle App <onboarding@resend.dev>',
                to: [destinationEmail],
                subject: '⚠️ Cuenta Suspendida Temporalmente - Recycle App',
                html: `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1F2937; margin: 0; padding: 0; background-color: #F3F4F6;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: white; padding: 40px 30px; text-align: center;">
            <div style="font-size: 64px; margin-bottom: 10px;">⚠️</div>
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Cuenta Suspendida Temporalmente</h1>
        </div>
        
        <!-- Body -->
        <div style="padding: 40px 30px;">
            <p style="font-size: 18px; color: #1F2937; margin-bottom: 20px;">Hola <strong>${name}</strong>,</p>
            
            <p style="color: #4B5563; font-size: 16px; line-height: 1.6;">Tu cuenta de <strong>Recycle App</strong> ha sido suspendida temporalmente según tu solicitud.</p>
            
            <!-- Countdown Box -->
            <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border: 3px solid #F59E0B; border-radius: 16px; padding: 32px; margin: 32px 0; text-align: center;">
                <div style="font-size: 14px; color: #92400E; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">Tiempo de Gracia</div>
                <div style="font-size: 72px; font-weight: 900; color: #D97706; line-height: 1; margin: 16px 0;">30</div>
                <div style="font-size: 20px; color: #92400E; font-weight: 600;">días</div>
                <div style="font-size: 16px; color: #DC2626; font-weight: 700; margin-top: 20px; padding: 12px; background: rgba(255,255,255,0.6); border-radius: 8px;">
                    📅 Eliminación programada: ${deletionDateFormatted}
                </div>
            </div>
            
            <!-- What does this mean? -->
            <div style="background: #F9FAFB; border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 4px solid #F59E0B;">
                <div style="font-size: 18px; font-weight: 700; color: #1F2937; margin-bottom: 16px;">📋 ¿Qué significa esto?</div>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; color: #4B5563; font-size: 15px;">
                        <span style="color: #10B981; font-weight: 700;">✓</span> Puedes restaurar tu cuenta en cualquier momento durante estos 30 días
                    </li>
                    <li style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; color: #4B5563; font-size: 15px;">
                        <span style="color: #10B981; font-weight: 700;">✓</span> Tus datos permanecen seguros durante el período de gracia
                    </li>
                    <li style="padding: 12px 0; border-bottom: 1px solid #E5E7EB; color: #4B5563; font-size: 15px;">
                        <span style="color: #EF4444; font-weight: 700;">✗</span> Después de 30 días, tu cuenta se eliminará permanentemente
                    </li>
                    <li style="padding: 12px 0; color: #4B5563; font-size: 15px;">
                        <span style="color: #EF4444; font-weight: 700;">✗</span> Perderás todos tus EcoPuntos, historial y recompensas
                    </li>
                </ul>
            </div>
            
            <!-- Restore Account CTA -->
            <div style="background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); border-radius: 12px; padding: 32px; margin: 24px 0; text-align: center; border: 2px solid #10B981;">
                <div style="font-size: 24px; margin-bottom: 8px;">🔄</div>
                <p style="font-size: 18px; color: #059669; font-weight: 700; margin: 0 0 8px 0;">¿Cambiaste de opinión?</p>
                <p style="font-size: 15px; color: #065F46; margin: 0;">Solo inicia sesión en la app para recuperar tu cuenta instantáneamente</p>
            </div>
            
            <!-- Farewell Message -->
            <div style="background: #F9FAFB; border-radius: 12px; padding: 24px; margin: 24px 0;">
                <div style="font-size: 18px; font-weight: 700; color: #1F2937; margin-bottom: 12px;">🌱 Te extrañaremos</div>
                <p style="color: #6B7280; margin: 0; font-size: 15px; line-height: 1.6;">
                    En Recycle App estamos comprometidos con el medio ambiente y con nuestros usuarios. 
                    Si decides volver, estaremos aquí para ayudarte a seguir reciclando y cuidando nuestro planeta.
                </p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #F3F4F6; padding: 32px 30px; text-align: center; color: #6B7280; font-size: 13px; border-top: 1px solid #E5E7EB;">
            <div style="font-size: 32px; margin-bottom: 12px;">♻️</div>
            <p style="margin: 4px 0; font-weight: 600; color: #1F2937;">Recycle App</p>
            <p style="margin: 4px 0;">Juntos por un planeta más limpio</p>
            <p style="margin: 16px 0 0 0; font-size: 12px; color: #9CA3AF;">
                Este email fue enviado automáticamente. No respondas a este correo.
            </p>
        </div>
    </div>
</body>
</html>
                `
            })
        });

        // Parsear respuesta
        const result = await response.json();

        // Manejo de errores (igual que resendService.js)
        if (response.ok && result.id) {
            console.log('✅ Email de suspensión enviado correctamente');
            console.log('   Message ID:', result.id);
            return { success: true, messageId: result.id };
        } else {
            console.error('❌ Error Resend:', result);
            return { success: false, error: result.message || 'Error desconocido' };
        }

    } catch (error) {
        console.error('❌ Error de red al enviar email:', error);
        return {
            success: false,
            error: error.message || 'Error de conexión'
        };
    }
};

/**
 * Verificar configuración de Resend
 * @returns {boolean} true si está configurado correctamente
 */
export const checkResendConfig = () => {
    const isConfigured = !!RESEND_API_KEY;
    
    if (!isConfigured) {
        console.error('❌ RESEND_API_KEY no encontrada en process.env');
        console.error('   Verifica tu archivo .env');
    } else {
        console.log('✅ RESEND_API_KEY configurada');
    }
    
    return isConfigured;
};