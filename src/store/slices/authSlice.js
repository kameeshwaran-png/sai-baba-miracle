import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    userRole: null, // 'admin' or 'user'
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
      // Set user role (you can fetch this from Firestore user document)
      state.userRole = action.payload?.role || 'user';
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.userRole = null;
      state.isLoading = false;
    },
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
  },
});

export const { setUser, setLoading, logout, setUserRole } = authSlice.actions;
export default authSlice.reducer;

