# Límites y Costos de Resend

## 📊 Plan Gratuito de Resend

Resend ofrece un **plan gratuito generoso** sin necesidad de tarjeta de crédito:

### Límites Gratuitos
- ✅ **100 emails por día**
- ✅ **3,000 emails por mes**
- ✅ Sin costo alguno
- ✅ No requiere tarjeta de crédito
- ✅ API completa disponible

### ¿Cuándo se cobra?
**NUNCA** mientras te mantengas dentro de los límites gratuitos.

Solo se cobra si:
1. Superas los 100 emails/día
2. Superas los 3,000 emails/mes
3. Decides actualizar a un plan pagado voluntariamente

### Costos si Excedes el Límite
Si llegas al límite gratuito, Resend simplemente **detiene el envío** hasta el siguiente período. No te cobra automáticamente.

Para aumentar el límite necesitas actualizar a plan pagado:
- **$20/mes**: 50,000 emails
- **$80/mes**: 250,000 emails
- **Personalizado**: Para más volumen

## 🔒 Sistema de Límite Eliminado

### ¿Por qué eliminamos emailLimiter.js?

Antes teníamos un sistema local que limitaba a 200 emails/mes, pero lo eliminamos porque:

1. **No era necesario**: Resend ya tiene su propio límite (3,000/mes)
2. **Menos código**: Sistema más simple sin lógica de contador local
3. **Más confiable**: Resend maneja los límites en su servidor
4. **Sin mantenimiento**: No hay que preocuparse por resetear contadores

### ¿Cómo sabe Resend cuántos emails envías?
Resend controla todo en su backend:
- Cada llamada a la API cuenta hacia tu límite
- El servidor responde con error 429 si excedes el límite
- Dashboard de Resend muestra estadísticas en tiempo real

## 📈 Monitoreo de Uso

### Ver cuántos emails has enviado:
1. Ir a [Resend Dashboard](https://resend.com/emails)
2. Login con tu cuenta
3. Ver "Usage" en el menú lateral
4. Estadísticas:
   - Emails enviados hoy
   - Emails enviados este mes
   - Porcentaje usado
   - Límite restante

### Respuesta de API cuando se excede:
```javascript
{
  "statusCode": 429,
  "message": "Too Many Requests",
  "error": "Rate limit exceeded"
}
```

## 🛡️ Protección del Sistema

### ¿Qué pasa si llegamos al límite?
Nuestro código maneja esto automáticamente:

```javascript
// En resendService.js
if (!response.ok) {
    if (response.status === 429) {
        console.log('[Resend] Límite alcanzado');
        return { 
            success: false, 
            error: 'Límite de envíos alcanzado. Intenta mañana.' 
        };
    }
}
```

**Resultado para el usuario:**
1. Email no se envía
2. Se muestra modal de testing con código
3. Usuario puede continuar con verificación
4. Sistema sigue funcionando normalmente

## 💡 Recomendaciones

### Para Desarrollo/Testing
- ✅ 100 emails/día son **más que suficientes**
- ✅ Perfecto para pruebas
- ✅ No hay riesgo de cargos

### Para Producción
**Si esperas más de 3,000 verificaciones/mes:**
1. Monitorea el dashboard de Resend
2. Considera plan pagado ($20/mes para 50k emails)
3. O implementa límite de intentos por usuario:
   - Máximo 3 reenvíos por hora
   - Máximo 10 reenvíos por día por usuario

### Cálculo de Uso Estimado
Si tienes **X usuarios activos:**
- Cada usuario activa 2FA: 1 email
- Usuario reenvía código 2 veces: 2 emails
- **Total por usuario: ~3 emails**

Para 1,000 usuarios:
- 1,000 × 3 = 3,000 emails/mes
- **Justo en el límite gratuito** ✅

## 🔐 Seguridad de la API Key

### API Key Actual
```
re_NcebB7UA_Ee6uifkPMUSyPMFPYYoSiz9b
```

### ⚠️ IMPORTANTE
Esta API key está **hardcodeada** en el código. Para producción:

1. **Mover a variables de entorno:**
```bash
# .env
RESEND_API_KEY=re_NcebB7UA_Ee6uifkPMUSyPMFPYYoSiz9b
```

2. **Usar en código:**
```javascript
import Constants from 'expo-constants';
const RESEND_API_KEY = Constants.expoConfig.extra.resendApiKey;
```

3. **Configurar en app.json:**
```json
{
  "extra": {
    "resendApiKey": process.env.RESEND_API_KEY
  }
}
```

### Si la API Key se compromete:
1. Ir a [Resend API Keys](https://resend.com/api-keys)
2. Eliminar key comprometida
3. Crear nueva key
4. Actualizar en el código/variables de entorno

## 📞 Soporte Resend

- **Dashboard**: https://resend.com
- **Documentación**: https://resend.com/docs
- **Status**: https://status.resend.com
- **Discord**: Comunidad oficial de Resend

---

**Resumen**: No eliminamos el límite local porque Resend cobre automáticamente, sino porque **ya tiene su propio sistema de límites gratuito** (3,000/mes) que es mucho más generoso que nuestro límite anterior de 200/mes. El plan gratuito no requiere tarjeta y nunca cobra sin tu autorización.
