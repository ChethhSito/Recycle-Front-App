import { createSlice } from '@reduxjs/toolkit';

export const levelsSlice = createSlice({
    name: 'levels',
    initialState: {
        levels: [],
        isLoading: false,
        error: null
    },
    reducers: {
        setLevels: (state, action) => {
            state.levels = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { setLevels, setLoading, setError } = levelsSlice.actions;

export default levelsSlice.reducer;
