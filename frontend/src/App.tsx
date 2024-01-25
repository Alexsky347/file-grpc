import {useCallback, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Login from "./page/login/login.tsx";
import { AuthState } from "./model/interface/auth-state.ts";
import { logout } from "./store/slices/auth.ts";
import { AppDispatch } from "./store/store.ts";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { PrivateRoute } from './utils/auth/private-route.tsx';
import Layout from "./component/layout/layout.tsx";

function App() {
    const { user: currentUser } = useSelector(
        (state: { auth: AuthState }) => state.auth
    );
    const { isLoading } = useSelector(
        (state: { file: { isLoading: boolean } }) => state.file
    );

    const dispatch = useDispatch<AppDispatch>();

    const logOut = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

    useEffect(() => {
        document.title = 'Login - Drive Clone';
    }, [currentUser, logOut]);

    return (
        <div className="App">
            {isLoading ? (
                <div className="flex items-center justify-center h-screen">
                    <span className="loading loading-dots loading-lg"></span>
                </div>
            ) : null}
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Layout />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
  )
}

export default App
