import axios from "axios";
import { urlInduction } from "../helper/url-auth";

export const inductionApi = async () => {
    try {
        const response = await axios.get(urlInduction);
        // response.data ya es el objeto, no necesita await
        return response.data;
    } catch (error) {
        console.error("Error obteniendo inducciones:", error);
        throw error; // Lanzamos el error para que el slice/hook lo capture
    }
}

export const registerViewApi = async (id, userId) => {
    try {
        // Enviamos el userId en el body como espera tu nuevo Service de NestJS
        const response = await axios.patch(`${urlInduction}/${id}/view`, {
            userId: userId
        });

        return response.data;
    } catch (error) {
        console.error("Error al registrar vista y puntos:", error);
        // Es importante relanzar el error para manejar estados de carga o alertas en la UI
        throw error;
    }
}