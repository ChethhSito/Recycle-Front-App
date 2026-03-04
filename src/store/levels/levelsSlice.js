import { createSlice } from '@reduxjs/toolkit';

export const levelsSlice = createSlice({
    name: 'levels',
    initialState: {
        levels: [],
        isLoading: false,
        userLevelStatus: null,
        error: null
    },
    reducers: {
        setLevels: (state, action) => {
            state.levels = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setUserLevelStatus: (state, action) => {
            state.userLevelStatus = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        resetLevels: (state) => {
            state.userLevelStatus = null;
            state.error = null;
        }
    }
});

export const { setLevels, setLoading, setUserLevelStatus, setError, resetLevels } = levelsSlice.actions;

export default levelsSlice.reducer;
