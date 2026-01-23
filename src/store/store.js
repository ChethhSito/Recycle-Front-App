import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth';
import logger from 'redux-logger';
import { levelsSlice } from './levels';
import { partnersSlice } from './partners';
import { inductionSlice } from './induction';
import { programSlice } from './programs';
export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        levels: levelsSlice.reducer,
        partners: partnersSlice.reducer,
        induction: inductionSlice.reducer,
        programs: programSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});