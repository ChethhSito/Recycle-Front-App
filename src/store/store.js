import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth';
import logger from 'redux-logger';

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});