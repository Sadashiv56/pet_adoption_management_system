import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  status: 'idle',
  error: null,
  successMessage: null,
};

export const registerUser = createAsyncThunk('auth/register', async (form, { rejectWithValue }) => {
  try {
    const res = await API.post('/auth/register', form);
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.msg || (err.response?.data?.errors && err.response.data.errors.map(e=>e.msg).join(', ')) || err.message || 'Server error';
    return rejectWithValue(msg);
  }
});

export const loginUser = createAsyncThunk('auth/login', async (form, { rejectWithValue }) => {
  try {
    const res = await API.post('/auth/login', form);
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.msg || (err.response?.data?.errors && err.response.data.errors.map(e=>e.msg).join(', ')) || err.message || 'Server error';
    return rejectWithValue(msg);
  }
});

// Fetch current user when we have a token (used on app start / reload)
export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/auth/me');
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.msg || err.message || 'Server error';
    return rejectWithValue(msg);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      localStorage.removeItem('token');
    },
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.status = 'loading'; state.error = null; state.successMessage = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.successMessage = 'Registration successful';
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || 'Registration failed'; })

      .addCase(loginUser.pending, (state) => { state.status = 'loading'; state.error = null; state.successMessage = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.successMessage = 'Login successful';
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || 'Login failed'; });

    // handle fetching current user
    builder
      .addCase(fetchCurrentUser.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload || 'Unable to fetch user'; });
  }
});

export const { logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;
