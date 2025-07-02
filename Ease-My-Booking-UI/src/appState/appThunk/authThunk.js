// src/appState/appThunk/authThunk.js

import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, registerUser,updateRole } from '../../services/auth.service';
import { onLogin } from '../../appState/appSlicer/userSlcer';

// Login thunk
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ username, password }, { dispatch, rejectWithValue }) => {
    try {
      const response = await loginApi({ username, password });

      localStorage.setItem('token', response.Token);

      dispatch(onLogin({
        email: username,
        token: response.Token,
        userId: response.UserId,
        role: response.Role // ✅ Role now included
      }));

      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Register thunk
export const registerUserThunk = createAsyncThunk(
  'user/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await registerUser(payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Update Role thunk
export const updateRoleThunk = createAsyncThunk(
  'user/updateRole',
  async ({ userEmail, role }, { rejectWithValue }) => {
    try {
      const response = await updateRole({ userEmail, role });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);