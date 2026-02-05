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

    const { token } = useSelector(state => state.auth);
    const { posts, activePost, isLoading, activeComments } = useSelector(state => state.forum);
    const dispatch = useDispatch();

    const getAuthHeader = async () => {
        const token = await AsyncStorage.getItem('user_token');
        return {
            headers: { 'Authorization': `Bearer ${token}` }
        };
    };

    // 1. CARGAR EL FEED
    const startLoadingPosts = async () => {
        dispatch(onLoadingForum());
        try {
            const config = await getAuthHeader();
            const { data } = await axios.get(urlForum, config);
            dispatch(onSetPosts(data));
        } catch (error) {
            console.log('Error cargando foro', error);
            dispatch(onLoadError('Error al cargar las publicaciones'));
        }
    };

    // 2. CREAR POST
    const startSavingPost = async ({ title, content, category }) => {
        dispatch(onLoadingForum());
        try {
            const config = await getAuthHeader();
            const { data } = await axios.post(urlForum, { title, content, category }, config);
            dispatch(onAddNewPost(data));
            return true; // Retornamos true para cerrar el modal
        } catch (error) {
            console.log(error);
            dispatch(onLoadError('No se pudo crear la publicación'));
            return false;
        }
    };

    // 3. DAR LIKE (Optimista)
    const startTogglingLike = async (postId) => {
        try {
            // Llamamos al backend
            const config = await getAuthHeader();
            const { data } = await axios.patch(`${urlForum}/${postId}/like`, {}, config);            // El backend nos devuelve el post actualizado (con el nuevo contador de likes)
            // Actualizamos Redux inmediatamente
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