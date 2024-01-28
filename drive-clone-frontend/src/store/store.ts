import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/auth'
import messageReducer from './slices/message'
import fileReducer from './slices/file'

const myReducer = {
  auth: authReducer,
  message: messageReducer,
  file: fileReducer,
}

export const store = configureStore({
  reducer: myReducer,
  devTools: true,
})

export type AppDispatch = typeof store.dispatch
