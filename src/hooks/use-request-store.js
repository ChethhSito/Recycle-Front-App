import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { urlRequests } from '../api/helper/url-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native'; // Importante para feedback
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
            const { data } = await axios.get(`${urlRequests}/nearby`, {
                ...config,
                params: { lat, lng, km: 10 }
            });
            dispatch(onSetNearbyRequests(data));
        } catch (error) {
            dispatch(onError('No se pudieron cargar las solicitudes cercanas'));
        }
    };

    const startCreatingRequest = async (formDataInput) => {
        dispatch(onLoading());
        try {
            const token = await AsyncStorage.getItem('user_token');
            const formData = new FormData();
            formData.append('category', formDataInput.category);
            formData.append('materialType', formDataInput.materialType);
            formData.append('quantity', formDataInput.quantity);
            formData.append('measureType', formDataInput.measureType);
            formData.append('description', formDataInput.description || '');

            const locationObject = {
                ...formDataInput.locationCoords,
                address: formDataInput.address
            };

            formData.append('location', JSON.stringify(locationObject));

            const fileName = formDataInput.imageUri.split('/').pop();
            const fileType = fileName.split('.').pop();

            formData.append('file', {
                uri: formDataInput.imageUri,
                name: fileName,
                type: `image/${fileType}`,
            });

            const { data } = await axios.post(urlRequests, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            dispatch(onAddNewRequest(data));
            return true;
        } catch (error) {
            dispatch(onError());
            return false;
        }
    };

    const startAcceptingRequest = async (requestId) => {
        dispatch(onLoading());
        try {
            const config = await getAuthHeader();
            await axios.patch(`${urlRequests}/${requestId}/accept`, {}, config);

            // Recargamos las solicitudes cercanas para que ya no aparezca la que acep
            await startLoadingRequests();
            return true;
        } catch (error) {
            const msg = error.response?.data?.message || 'Error al aceptar';
            Alert.alert('Error', msg);
            dispatch(onError(msg));
            return false;
        }
    };

    // --- 1. NUEVA FUNCIÓN: CANCELAR SOLICITUD (Ciudadano) ---
    const startCancellingRequest = async (requestId) => {
        dispatch(onLoading());
        try {
            const config = await getAuthHeader();
            await axios.patch(`${urlRequests}/${requestId}/cancel`, {}, config);

            // Recargamos el historial para ver el estado actualizado
            await startLoadingRequests();
            return true;
        } catch (error) {
            const msg = error.response?.data?.message || 'No se pudo cancelar la solicitud';
            Alert.alert('Error', msg);
            dispatch(onError(msg));
            return false;
        }
    };

    // --- 2. NUEVA FUNCIÓN: COMPLETAR RECOJO (Reciclador) ---
    const startCompletingRequest = async (requestId, imageUri) => {
        dispatch(onLoading());
        try {
            const token = await AsyncStorage.getItem('user_token');

            // 1. Creamos el FormData para enviar la imagen
            const formData = new FormData();

            // Extraemos nombre y tipo de la imagen tomada por el reciclador
            const fileName = imageUri.split('/').pop();
            const fileType = fileName.split('.').pop();

            formData.append('file', {
                uri: imageUri,
                name: fileName,
                type: `image/${fileType}`,
            });

            // 2. Enviamos el PATCH con el FormData
            const { data } = await axios.patch(
                `${urlRequests}/${requestId}/complete`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            Alert.alert(
                "¡Excelente trabajo!",
                `Has recolectado el material. Se han otorgado ${data.pointsAwarded} puntos al ciudadano.`
            );

            // Actualizamos la lista local para que la tarea desaparezca de "activos"
            await startLoadingRequests();
            return true;

        } catch (error) {
            const msg = error.response?.data?.message || 'Error al finalizar el recojo';
            console.log('Error en completeRequest:', error);
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
        startAcceptingRequest,
        startCancellingRequest,
        startCompletingRequest
    };
};