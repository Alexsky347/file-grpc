import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/auth";
import messageReducer from "./slices/message";

const myReducer = {
    auth: authReducer,
    message: messageReducer
}

export const store = configureStore({
    reducer: myReducer,
    devTools: true,
});

export type AppDispatch = typeof store.dispatch
