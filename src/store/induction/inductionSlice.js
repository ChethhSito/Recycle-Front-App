import { createSlice } from '@reduxjs/toolkit';

export const inductionSlice = createSlice({
    name: 'induction',
    initialState: {
        induction: [],
        isLoading: false,
        error: null
    },
    reducers: {
        setInduction: (state, action) => {
            state.induction = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { setInduction, setLoading, setError } = inductionSlice.actions;

export default inductionSlice.reducer;
