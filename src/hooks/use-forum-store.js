import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { urlForum } from '../api/helper/url-auth'; // Tu URL base
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    onAddNewPost,
    onLoadError,
    onLoadingForum,
    onSetPosts,
    onUpdatePost,
    onSetActivePost,
    onSetComments,
    onAddComment
} from '../store/forum/forumSlice';

export const useForumStore = () => {
    const { posts, activePost, isLoading, activeComments } = useSelector(state => state.forum);
    const dispatch = useDispatch();

    const getAuthHeader = async (isFormData = false) => {
        const token = await AsyncStorage.getItem('user_token');
        return {
            headers: {
                'Authorization': `Bearer ${token}`,
                // 🚀 Si es FormData, Axios suele poner el boundary solo, 
                // pero a veces es bueno especificarlo o dejarlo vacío.
                'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
            }
        };
    };

    // 1. CARGAR EL FEED (Igual)
    const startLoadingPosts = async () => {
        dispatch(onLoadingForum());
        try {
            const config = await getAuthHeader();
            const { data } = await axios.get(urlForum, config);
            dispatch(onSetPosts(data));
        } catch (error) {
            dispatch(onLoadError('Error al cargar las publicaciones'));
        }
    };

    // 2. CREAR POST CON IMAGEN 📸
    const startSavingPost = async ({ title, description, category, image }) => {
        dispatch(onLoadingForum());
        try {
            const config = await getAuthHeader(true); // true para multipart/form-data

            // 📝 Construimos el FormData
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', description); // El backend espera 'content'
            formData.append('category', category);

            // Si hay imagen, la preparamos para el envío
            if (image) {
                const uriParts = image.split('.');
                const fileType = uriParts[uriParts.length - 1];

                formData.append('file', { // 'file' debe coincidir con el Interceptor del backend
                    uri: image,
                    name: `photo.${fileType}`,
                    type: `image/${fileType}`,
                });
            }

            const { data } = await axios.post(urlForum, formData, config);
            dispatch(onAddNewPost(data));
            return true;
        } catch (error) {
            console.log('Error saving post:', error.response?.data || error.message);
            dispatch(onLoadError('No se pudo crear la publicación'));
            return false;
        }
    };

    // 3. DAR LIKE (Optimista y con actualización de UI)
    const startTogglingLike = async (postId) => {
        try {
            const config = await getAuthHeader();
            // El backend devuelve el post con el array de likes actualizado
            const { data } = await axios.patch(`${urlForum}/${postId}/like`, {}, config);

            // 🔄 Esto actualizará el 'isLiked' en tu componente PostCard
            dispatch(onUpdatePost(data));
        } catch (error) {
            console.log('Error dando like', error);
        }
    };

    // 4. SELECCIONAR POST (Para ir a ver comentarios)
    const setActivePost = (post) => {
        dispatch(onSetActivePost(post));
    };

    const startLoadingComments = async (postId) => {
        // No activamos loading global para no bloquear toda la pantalla, o puedes crear un isLoadingComments
        try {
            const config = await getAuthHeader();
            const { data } = await axios.get(`${urlForum}/${postId}/comments`, config);
            dispatch(onSetComments(data));
        } catch (error) {
            console.log('Error cargando comentarios', error);
        }
    };

    // 👇 2. ENVIAR COMENTARIO
    const startSendingComment = async (postId, content) => {
        try {
            const config = await getAuthHeader();
            const { data } = await axios.post(`${urlForum}/comment`, { postId, content }, config);
            dispatch(onAddComment(data));
            return true;
        } catch (error) {
            console.log('Error enviando comentario', error);
            dispatch(onLoadError('No se pudo enviar el comentario'));
            return false;
        }
    };

    return {
        // Propiedades
        posts,
        activePost,
        isLoading,
        activeComments,
        // Métodos
        startLoadingPosts,
        startSavingPost,
        startLoadingComments,
        startSendingComment,
        startTogglingLike,
        setActivePost,
    };
};