import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth';
import logger from 'redux-logger';
import { levelsSlice } from './levels';
import { partnersSlice } from './partners';
import { inductionSlice } from './induction';
import { programSlice } from './programs';
import { rewardsSlice } from './reward';
import { forumSlice } from './forum';
export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        levels: levelsSlice.reducer,
        partners: partnersSlice.reducer,
        induction: inductionSlice.reducer,
        programs: programSlice.reducer,
        rewards: rewardsSlice.reducer,
        forum: forumSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});