import { createSlice } from '@reduxjs/toolkit';

export const forumSlice = createSlice({
    name: 'forum',
    initialState: {
        posts: [],           // El feed principal
        activeComments: [],
        activePost: null,    // El post seleccionado para ver comentarios
        isLoading: false,
        errorMessage: undefined,
    },
    reducers: {
        onLoadingForum: (state) => {
            state.isLoading = true;
            state.errorMessage = undefined;
        },
        onSetPosts: (state, { payload }) => {
            state.isLoading = false;
            state.posts = payload;
        },
        onAddNewPost: (state, { payload }) => {
            // Agregamos el nuevo post al inicio de la lista
            state.posts.unshift(payload);
            state.isLoading = false;
        },
        onUpdatePost: (state, { payload }) => {
            // Útil para cuando das Like: actualizamos solo ese post en la lista sin recargar todo
            state.posts = state.posts.map(post =>
                post._id === payload._id ? payload : post
            );

            // Si justo estamos viendo ese post en detalle, también lo actualizamos
            if (state.activePost?._id === payload._id) {
                state.activePost = payload;
            }
        },
        onSetActivePost: (state, { payload }) => {
            state.activePost = payload;
        },
        onLoadError: (state, { payload }) => {
            state.isLoading = false;
            state.errorMessage = payload;
        },
        onSetComments: (state, { payload }) => {
            state.activeComments = payload;
            state.isLoading = false;
        },
        onAddComment: (state, { payload }) => {
            state.activeComments.push(payload);
            // Opcional: Actualizamos el contador del post en la lista principal
            const post = state.posts.find(p => p._id === payload.post);
            if (post) { post.commentsCount = (post.commentsCount || 0) + 1; }
        },
    }
});

export const {
    onLoadingForum,
    onSetPosts,
    onAddNewPost,
    onUpdatePost,
    onSetActivePost,
    onLoadError,
    onSetComments,
    onAddComment
} = forumSlice.actions;