/**
 * API de Gemini para el Asistente Virtual
 * Modelo: gemini-1.5-flash (Estable y sin errores 404/429)
 * Modo Híbrido: FAQ local + API con fallback amable
 */

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * 10 Preguntas Sugeridas para el Usuario
 */
export const getSuggestedQuestions = () => [
    "¿Cómo separo mis residuos?",
    "¿Qué plásticos se reciclan?",
    "¿Punto de reciclaje más cercano?",
    "¿Cómo reciclar aceite usado?",
    "¿Qué hago con las pilas?",
    "Ideas para reutilizar botellas",
    "¿Qué es el compostaje?",
    "Horarios de recolección",
    "Beneficios de reciclar papel",
    "¿Cómo reducir plástico?"
];

/**
 * Envía un mensaje a Gemini 1.5 Flash
 * Si falla la API, retorna mensaje amable (servidores saturados)
 * @param {string} text - Mensaje del usuario
 * @returns {Promise<string>} - Respuesta de Gemini o mensaje de error amable
 */
export const sendMessageToGemini = async (text) => {
    if (!text || text.trim().length === 0) {
        return 'Por favor, escribe tu pregunta sobre reciclaje. 😊';
    }

    console.log('🤖 Consultando Gemini 1.5 Flash...');

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `Eres un asistente experto en reciclaje y medio ambiente de Recycle App. 
Responde de forma amigable, clara y con emojis. 
Tu objetivo es educar sobre reciclaje, separación de residuos, y economía circular.

Pregunta del usuario: ${text.trim()}`
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.8,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 500,
                }
            })
        });

        if (!response.ok) {
            console.warn('⚠️ Error en respuesta de Gemini:', response.status);
            throw new Error('API no disponible');
        }

        const data = await response.json();
        
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            const answer = data.candidates[0].content.parts[0].text.trim();
            console.log('✅ Respuesta recibida de Gemini');
            return answer;
        } else {
            throw new Error('Respuesta vacía de Gemini');
        }
    } catch (error) {
        console.error('❌ Error al consultar Gemini:', error.message);
        // Retornar mensaje amable en lugar de lanzar error
        return '🚧 Nuestros servidores están saturados en este momento. Intenta nuevamente en unos segundos o consulta las preguntas sugeridas. 🙏';
    }
};
