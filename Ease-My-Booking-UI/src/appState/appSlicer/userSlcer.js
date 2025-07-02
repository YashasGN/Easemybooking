import { createSlice } from '@reduxjs/toolkit';

const userInitialState = {
  email: localStorage.getItem('email') || '',
  token: localStorage.getItem('token') || '',
  isLoggedIn: !!localStorage.getItem('token'),
  userId: localStorage.getItem('userId') || '',
  role: localStorage.getItem('role')?.split(',') || []
};

const userSlicer = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    onLogin: (state, action) => {
      state.isLoggedIn = true;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.role = action.payload.role;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('email', action.payload.email);
      localStorage.setItem('userId', action.payload.userId);
      localStorage.setItem('role', action.payload.role.join(','));
    },
    onLogout: (state) => {
      state.isLoggedIn = false;
      state.email = '';
      state.token = '';
      state.userId = '';
      state.role = [];

      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
    }
  }
});

export const { onLogin, onLogout } = userSlicer.actions;
export default userSlicer.reducer;
