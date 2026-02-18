import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// Verificamos si la key existe (útil para depurar)
if (!API_KEY) {
    console.error("❌ ERROR: No se encontró EXPO_PUBLIC_GEMINI_API_KEY en las variables de entorno.");
}

// Data sincronizada con la versión Web de EcoBot
export const LOCAL_ANSWERS = {
    "¿Qué materiales se pueden reciclar? ♻️": "En general puedes reciclar: Plásticos (PET, HDPE), Papel y Cartón (limpios), Vidrio, y Metales (aluminio, conservas). Recuerda que deben estar limpios y secos.",
    "¿Cómo reciclar botellas de plástico? 🧴": "1. Vacía el líquido. 2. Enjuaga ligeramente (ahorra agua). 3. Aplasta la botella para reducir volumen. 4. Tapa y deposita en el contenedor correcto.",
    "¿Qué hago con el aceite usado? 🛢️": "Nunca lo tires por el desagüe. Déjalo enfriar, guárdalo en una botella de plástico cerrada y llévalo a un punto de acopio autorizado de Nos Planet.",
    "¿Cómo separar mis residuos? 🗑️": "Usa 4 tachos básicos: Verde (Aprovechables: papel, plástico, vidrio, metal), Marrón (Orgánicos: cáscaras, restos de fruta), Negro (No aprovechables: servilletas sucias, cartón con grasa), Rojo (Peligrosos: pilas, mascarillas).",
    "¿Dónde reciclar pilas? 🔋": "Las pilas son residuos peligrosos. No las tires a la basura común. Júntalas en una botella plástica y busca nuestros contenedores especiales para pilas.",
    "¿Qué es la economía circular? 🔄": "Es un modelo donde reducimos, reusamos y reciclamos materiales e insumos todas las veces posibles para crear un valor añadido y disminuir los residuos al mínimo.",
    "¿Qué hace NOS PLANET SAC? 🌿": "Somos una empresa dedicada a la gestión integral de residuos sólidos, promoviendo la sostenibilidad y el cuidado del medio ambiente a través de soluciones de reciclaje innovadoras.",
    "Hola": "¡Hola! 👋 Soy Planet Bot 🌿. Estoy aquí para ayudarte a reciclar mejor. Selecciona una pregunta o escribe la tuya.",
    "Gracias": "¡De nada! 💚 Juntos hacemos un gran cambio por el planeta. ¿Tienes más dudas?",
    "Adios": "¡Hasta pronto! Recuerda: pequeñas acciones generan grandes cambios. 🌍"
};

/**
 * Envía un mensaje a Gemini usando la configuración de EcoBot
 * @param {string} text - Mensaje del usuario
 * @returns {Promise<string>} - Respuesta de Gemini o fallback local
 */
export const sendMessageToGemini = async (text) => {
    if (!text || text.trim().length === 0) {
        return 'Por favor, escribe tu pregunta sobre reciclaje. 😊';
    }

    const cleanedText = text.trim();

    // 1. Revisar si tenemos respuesta local exacta
    // Buscamos coincidencia exacta o si la pregunta es una de las keys
    const exactMatch = Object.keys(LOCAL_ANSWERS).find(key => key.includes(cleanedText) || cleanedText.includes(key));
    if (LOCAL_ANSWERS[cleanedText]) {
        return LOCAL_ANSWERS[cleanedText];
    }
    if (exactMatch && LOCAL_ANSWERS[exactMatch]) {
        return LOCAL_ANSWERS[exactMatch];
    }

    // Fallback simple para saludos
    if (cleanedText.toLowerCase().includes('hola')) return LOCAL_ANSWERS["Hola"];

    console.log('🤖 Consultando Planet Bot (Gemini)...');

    try {
        // Usamos la SDK si es posible, o mantenemos Axios si prefieres. 
        // Para consistencia con el web, intentaremos usar el endpoint directo que ya funcionaba,
        // pero con el System Prompt correcto inyectado en el mensaje.

        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

        const systemPrompt = `
            Eres Planet Bot, el asistente virtual oficial de NOS PLANET SAC.
            CONTEXTO DE LA EMPRESA:
            - NOS PLANET SAC es una empresa peruana líder en gestión integral de residuos y sostenibilidad.
            - Misión: Promover la economía circular y educar sobre reciclaje.
            - Servicios: Gestión de residuos, puntos de acopio, educación ambiental y consultoría.
            
            TU ROL:
            - Responder dudas sobre reciclaje (colores de tachos: Verde=Aprovechable, Negro=No Aprovechable, Marrón=Orgánico, Rojo=Peligroso).
            - Ser amable, motivador y usar emojis relacionados con la naturaleza.
            - Si te preguntan algo fuera de reciclaje/medio ambiente, redirige el tema cortésmente hacia tu función principal.
            - Respuestas cortas y directas (max 3 oraciones si es posible).
        `;

        const response = await axios.post(GEMINI_API_URL, {
            contents: [
                {
                    parts: [
                        {
                            text: `${systemPrompt}\n\nPregunta del usuario: ${cleanedText}`
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
            }
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        const data = response.data;

        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text.trim();
        } else {
            throw new Error('Respuesta vacía de Gemini');
        }

    } catch (error) {
        let errorMessage = "Lo siento, tuve un problema al procesar tu mensaje.";

        if (error.response?.status === 429 || error.message.includes('quota')) {
            errorMessage = "Lo siento, estamos en actualización o reconstrucción 🛠️. Por favor intenta más tarde.";
        } else if (error.message.includes('API Key') || error.response?.status === 400) {
            errorMessage = "⚠️ Error de configuración de sistema.";
            console.error(error.message);
        } else {
            console.error('❌ Error Planet Bot:', error);
        }

        return errorMessage;
    }
};

/**
 * Obtiene la lista de preguntas sugeridas para los botones rápidos.
 */
export const getSuggestedQuestions = () => {
    // Filtramos saludos simples para mostrar solo preguntas de valor en los chips
    return Object.keys(LOCAL_ANSWERS).filter(q => q.includes('?'));
};
