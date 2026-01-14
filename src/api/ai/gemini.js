/**
 * Respuestas automáticas locales para fallback
 */
const LOCAL_ANSWERS = {
    "¿Cómo separo mis residuos?": "♻️ Separa tus residuos en orgánicos, reciclables y no reciclables. Usa contenedores distintos para cada tipo. 🍃",
    "¿Qué plásticos se reciclan?": "Plásticos PET (botellas de bebidas), HDPE (envases de productos de limpieza) y PP (tapas y envases) suelen reciclarse. 🚮",
    "¿Punto de reciclaje más cercano?": "📍 Puedes usar apps locales o buscar en Google Maps ‘puntos de reciclaje cerca de mí’.",
    "¿Cómo reciclar aceite usado?": "No lo viertas en el desagüe. Guarda el aceite en botellas y llévalo a un punto de reciclaje de aceite. 🛢️",
    "¿Qué hago con las pilas?": "Llévalas a puntos de acopio de pilas o tiendas que acepten reciclaje de baterías. 🔋",
    "Ideas para reutilizar botellas": "💡 Puedes hacer maceteros, dispensadores de jabón, lámparas DIY o manualidades con botellas de plástico.",
    "¿Qué es el compostaje?": "🌱 Transformar restos orgánicos (cáscaras, restos de comida) en abono natural para plantas.",
    "Horarios de recolección": "Consulta en la web de tu municipalidad o llama a tu centro de atención local para saber los horarios exactos.",
    "Beneficios de reciclar papel": "📄 Reduce tala de árboles, ahorra energía y agua, y disminuye la basura en rellenos sanitarios.",
    "¿Cómo reducir plástico?": "Usa bolsas reutilizables, evita envases innecesarios y opta por productos a granel. 🛍️"
};

/**
 * Envía un mensaje a Gemini 1.5 Flash o usa respuestas locales si falla
 * @param {string} text - Mensaje del usuario
 * @returns {Promise<string>} - Respuesta de Gemini o fallback local
 */
export const sendMessageToGemini = async (text) => {
    if (!text || text.trim().length === 0) {
        return 'Por favor, escribe tu pregunta sobre reciclaje. 😊';
    }

    const cleanedText = text.trim();

    // Revisar si tenemos respuesta local
    if (LOCAL_ANSWERS[cleanedText]) {
        return LOCAL_ANSWERS[cleanedText];
    }

    console.log('🤖 Consultando Gemini 1.5 Flash...');

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `Eres un asistente experto en reciclaje y medio ambiente de Recycle App. 
Responde de forma amigable, clara y con emojis. 
Tu objetivo es educar sobre reciclaje, separación de residuos, y economía circular.

Pregunta del usuario: ${cleanedText}`
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
        // Retornar fallback genérico si no hay respuesta local
        return '🚧 Nuestros servidores están saturados o no tenemos respuesta específica. Intenta con preguntas comunes como "¿Cómo separo mis residuos?" 🙏';
    }
};
