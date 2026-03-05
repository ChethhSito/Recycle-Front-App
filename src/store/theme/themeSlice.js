import { createSlice } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@nos_planet_theme_mode';

export const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        // 🌓 Aquí aplicamos la detección real del sistema al iniciar por primera vez
        isDarkMode: Appearance.getColorScheme() === 'dark',
    },
    reducers: {
        toggleTheme: (state) => {
            state.isDarkMode = !state.isDarkMode;
            // Persistencia asíncrona
            AsyncStorage.setItem(THEME_KEY, JSON.stringify(state.isDarkMode));
        },
        setTheme: (state, action) => {
            state.isDarkMode = action.payload;
        }
    },
});

export const { toggleTheme, setTheme } = themeSlice.actions;