import { createSlice } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';

export const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        // Detecta automáticamente el tema del sistema del celular por defecto
        isDarkMode: false,
    },
    reducers: {
        toggleTheme: (state) => {
            state.isDarkMode = !state.isDarkMode;
        },
        setTheme: (state, action) => {
            state.isDarkMode = action.payload; // true o false
        }
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;