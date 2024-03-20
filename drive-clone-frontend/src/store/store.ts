import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth';
import messageReducer from './slices/message';
import fileReducer from './slices/file';
import loader from './slices/loader';

const myReducer = {
  auth: authReducer,
  message: messageReducer,
  file: fileReducer,
  loader: loader,
};

export const store = configureStore({
  reducer: myReducer,
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
