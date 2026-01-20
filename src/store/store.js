import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth';
import logger from 'redux-logger';
import { levelsSlice } from './levels/levelsSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        levels: levelsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});