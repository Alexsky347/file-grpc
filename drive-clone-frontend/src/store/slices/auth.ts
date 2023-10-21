import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setMessage } from './message';
import { AuthService } from '../../service/api/auth.service';
import { User } from '../../model/interface/user';
import { AuthState } from '../../model/interface/auth-state';

const user = JSON.parse(localStorage.getItem('user') as string);

export const login = createAsyncThunk<
  { user: User },
  { username: string; password: string }
>('auth/login', async ({ username, password }, thunkAPI) => {
  try {
    const data = await AuthService.login({ username, password });
    thunkAPI.dispatch(setMessage({ message: "You're logged!" }));
    return { user: data };
  } catch (error: Error | any) {
    const message =
      (error?.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    thunkAPI.dispatch(setMessage({ message, level: 'error' }));
    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  const { message } = await AuthService.logout();
  thunkAPI.dispatch(setMessage({ message: "You're logged out!" }));
  return thunkAPI.fulfillWithValue(message);
});

const initialState: AuthState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});
export const { setIsLoggedIn } = authSlice.actions;
export default authSlice.reducer;
