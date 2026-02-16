import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { urlRequests } from '../api/helper/url-auth'; // Tu URL base
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    onLoading, onSetRequests, onSetNearbyRequests, onAddNewRequest, onError
} from '../store/request/requestSlice';


export const useRequestStore = () => {
    const { requests, nearbyRequests, isLoading } = useSelector(state => state.request);
    const dispatch = useDispatch();

    const getAuthHeader = async () => {
        const token = await AsyncStorage.getItem('user_token');
        return { headers: { 'Authorization': `Bearer ${token}` } };
    };

    const startLoadingRequests = async () => {
        dispatch(onLoading());
        try {
            const config = await getAuthHeader();
            const { data } = await axios.get(`${urlRequests}/mine`, config);

            // 🚨 AGREGA ESTE LOG 🚨
            console.log("1. DATOS RECIBIDOS DEL BACKEND:", JSON.stringify(data, null, 2));
            console.log("   ¿Es Array?:", Array.isArray(data));

            dispatch(onSetRequests(data));
        } catch (error) {
            console.log('Error cargando solicitudes', error);
            dispatch(onError());
        }
    };

    const startLoadingNearbyRequests = async ({ lat, lng }) => {
        dispatch(onLoading());
        try {
            const config = await getAuthHeader();
            // GET /requests/nearby?lat=...&lng=...
            const { data } = await axios.get(`${urlRequests}/nearby`, {
                ...config,
                params: { lat, lng, km: 10 } // Radio de 10km (puedes parametrizarlo)
            });

            // Guardamos los datos RAW en el store
            dispatch(onSetNearbyRequests(data));

        } catch (error) {
            console.log('Error cargando cercanos:', error);
            dispatch(onError('No se pudieron cargar las solicitudes cercanas'));
        }
    };

    const startCreatingRequest = async (formDataInput) => {
        // formDataInput trae: category, materialType, quantity, measureType, locationCoords, imageUri
        dispatch(onLoading());
        try {
            const token = await AsyncStorage.getItem('user_token');

            // 1. Crear el objeto FormData
            const formData = new FormData();
            formData.append('category', formDataInput.category);
            formData.append('materialType', formDataInput.materialType);
            formData.append('quantity', formDataInput.quantity);
            formData.append('measureType', formDataInput.measureType);
            formData.append('description', formDataInput.description || '');

            // OJO: Los objetos complejos (location) se envían mejor como string JSON en FormData
            const locationObject = {
                ...formDataInput.locationCoords, // { latitude: ..., longitude: ... }
                address: formDataInput.address   // "Av. Siempre Viva 123"
            };

            // Enviamos todo junto como un string JSON
            formData.append('location', JSON.stringify(locationObject));

            // 2. Adjuntar la imagen
            const fileName = formDataInput.imageUri.split('/').pop();
            const fileType = fileName.split('.').pop();

            formData.append('file', {
                uri: formDataInput.imageUri,
                name: fileName,
                type: `image/${fileType}`, // ej: image/jpeg
            });

            // 3. Enviar a NestJS
            const { data } = await axios.post(urlRequests, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Axios suele poner esto auto, pero es bueno forzarlo si falla
                }
            });

            dispatch(onAddNewRequest(data));
            return true; // Éxito

        } catch (error) {
            console.log('Error creando solicitud', error?.response?.data || error.message);
            dispatch(onError());
            return false;
        }
    };

    const startAcceptingRequest = async (requestId) => {
        dispatch(onLoading());
        try {
            const config = await getAuthHeader(); // Headers con Token

            // Llamada al Backend: PATCH /requests/{id}/accept
            const { data } = await axios.patch(`${urlRequests}/${requestId}/accept`, {}, config);

            // Opcional: Actualizar la lista local quitando la solicitud aceptada de "cercanos"
            // dispatch(onRemoveFromNearby(requestId)); // Si quisieras crear esa acción en Redux

            dispatch(onSetRequests(data)); // O simplemente recargamos
            return true;

        } catch (error) {
            // Manejo de error si alguien más la ganó
            const msg = error.response?.data?.message || 'Error al aceptar la solicitud';
            Alert.alert('Error', msg);
            dispatch(onError(msg));
            return false;
        }
    };

    return {
        requests,
        isLoading,
        nearbyRequests,

        startLoadingRequests,
        startCreatingRequest,
        startLoadingNearbyRequests,
        startAcceptingRequest
    };
};