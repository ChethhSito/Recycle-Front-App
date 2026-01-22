import { createSlice } from '@reduxjs/toolkit';

export const partnersSlice = createSlice({
    name: 'partners',
    initialState: {
        partners: [],
        isLoading: false,
        error: null
    },
    reducers: {
        setPartners: (state, action) => {
            state.partners = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const { setPartners, setLoading, setError } = partnersSlice.actions;

export default partnersSlice.reducer;
