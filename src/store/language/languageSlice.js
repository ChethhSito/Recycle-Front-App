import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANG_KEY = '@nos_planet_language';

export const languageSlice = createSlice({
    name: 'language',
    initialState: {
        language: 'es', // 'es' o 'en'
    },
    reducers: {
        setLanguage: (state, action) => {
            state.language = action.payload;
            AsyncStorage.setItem(LANG_KEY, action.payload);
        },
    },
});

export const { setLanguage } = languageSlice.actions;