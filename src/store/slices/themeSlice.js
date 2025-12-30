import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: 'light', // 'light' or 'dark'
    language: 'en', // Default language
    colors: {
      light: {
        background: '#F5F7FA', // Very light gray for screen background
        surface: '#FFFFFF', // Pure white for cards
        primary: '#1a1a1a',
        secondary: '#666666',
        accent: '#007AFF',
        border: '#e0e0e0',
        error: '#FF3B30',
        success: '#34C759',
        shadow: 'rgba(0, 0, 0, 0.1)',
      },
      dark: {
        background: '#000000', // True black for screen background
        surface: '#1C1C1E', // Deep charcoal for cards
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
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, setLanguage } = themeSlice.actions;
export default themeSlice.reducer;

