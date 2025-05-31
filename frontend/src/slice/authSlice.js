import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


axios.defaults.withCredentials = true;

const API_URL = "http://localhost:3000/api/auth" 
 
const getInitialUser = () => {
  try {
      const user = localStorage.getItem("user"); // We will store the full user object (including token if present)
      return user ? JSON.parse(user) : null;
  } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
      return null;
  }
};

// Thunks
export const signup = createAsyncThunk('auth/signup', async ({ email, password, name }, thunkAPI) => {
  try {
    const res = await axios.post(`${API_URL}/signup`, { email, password, name });
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Error signing up");
  }
});

export const verifyEmail = createAsyncThunk('auth/verifyEmail', async (code, thunkAPI) => {
  try {
    const res = await axios.post(`${API_URL}/verify-email`, { code });
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data.user;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Error verifying email");
  }
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Error logging in");
  }
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${API_URL}/check-auth`);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data.user;
  } catch (error) {
    localStorage.removeItem("user");
    return thunkAPI.rejectWithValue(null); 
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await axios.post(`${API_URL}/logout`);
    localStorage.removeItem("user");
    
    return true
  } catch (err) {
    localStorage.removeItem("user");
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Error logging out");
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, thunkAPI) => {
  try {
    const res = await axios.post(`${API_URL}/forgot-password`, { email });
    return res.data.message;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Error sending reset password email");
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ token, password }, thunkAPI) => {
  try {
    const res = await axios.post(`${API_URL}/reset-password/${token}`, { password });
    return res.data.msg;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.msg || "Error resetting password");
  }
});

// Initial state
const initialState = {
 
  user:null,
  isAuthenticated: !!getInitialUser(),
  isLoading: false,
  isCheckingAuth: true,
  error: null,
  message: null,
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.message = null;
      localStorage.removeItem("user"); 
  }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
        localStorage.removeItem("user");
      })

      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
        localStorage.removeItem("user");
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;

      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
        localStorage.removeItem("user");
        
      })

      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isCheckingAuth = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.isCheckingAuth = false;
        state.error = null;
       
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;

      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
        
      })

      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.message = action.payload;
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.message = action.payload;
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const { clearAuthState } = authSlice.actions;

export default authSlice.reducer;

