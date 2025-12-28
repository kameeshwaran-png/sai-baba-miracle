import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: 'light', // 'light' or 'dark'
    colors: {
      light: {
        background: '#fbfcfa',
        surface: '#ffffff',
        primary: '#1a1a1a',
        secondary: '#666666',
        accent: '#007AFF',
        border: '#e0e0e0',
        error: '#FF3B30',
        success: '#34C759',
        shadow: 'rgba(0, 0, 0, 0.1)',
      },
      dark: {
        background: '#000000',
        surface: '#1c1c1e',
        primary: '#ffffff',
        secondary: '#98989d',
        accent: '#0A84FF',
        border: '#38383a',
        error: '#FF453A',
        success: '#32D74B',
        shadow: 'rgba(0, 0, 0, 0.5)',
      },
    },
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;

