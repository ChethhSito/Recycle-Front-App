import { createSlice } from "@reduxjs/toolkit";

export const programSlice = createSlice({
    name: 'programs',
    initialState: {
        programs: [],       // La lista de programas que trajiste del backend
        activeProgram: null, // Si el usuario selecciona uno para ver detalles
        isLoading: false,   // Para mostrar spinners
        errorMessage: undefined,
    },
    reducers: {
        onLoadingPrograms: (state) => {
            state.isLoading = true;
            state.errorMessage = undefined;
        },
        onSetPrograms: (state, { payload }) => {
            state.isLoading = false;
            state.programs = payload; // Reemplazamos la lista
        },
        onSetActiveProgram: (state, { payload }) => {
            state.activeProgram = payload;
        },
        onAddNewProgram: (state, { payload }) => {
            state.programs.push(payload); // Agregamos uno nuevo al final
            state.activeProgram = null;
        },
        onUpdateProgram: (state, { payload }) => {
            // Buscamos el programa por ID y lo actualizamos en la lista local
            state.programs = state.programs.map(program => {
                if (program._id === payload._id) {
                    return payload;
                }
                return program;
            });
        },
        onDeleteProgram: (state, { payload }) => {
            // Filtramos para quitar el que borramos
            state.programs = state.programs.filter(program => program._id !== payload);
        },
        onLoadError: (state, { payload }) => {
            state.isLoading = false;
            state.errorMessage = payload;
        },
        onClearPrograms: (state) => {
            state.programs = [];
            state.activeProgram = null;
        }
    }
});

// Exportamos las acciones para usarlas en el hook
export const {
    onLoadingPrograms,
    onSetPrograms,
    onSetActiveProgram,
    onAddNewProgram,
    onUpdateProgram,
    onDeleteProgram,
    onLoadError,
    onClearPrograms
} = programSlice.actions;

export default programSlice.reducer;
