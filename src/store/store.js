import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth';
import logger from 'redux-logger';
import { levelsSlice } from './levels/levelsSlice';
import { partnersSlice } from './partners/partnersSlice';
import { inductionSlice } from './induction/inductionSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        levels: levelsSlice.reducer,
        partners: partnersSlice.reducer,
        induction: inductionSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});