// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import React, { useCallback, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { CircularProgress } from '@mui/material';
import { AuthState } from './model/interface/auth-state';
import { AppDispatch } from './store/store';
import { logout } from './store/slices/auth';
import Login from './page/login/login';
import Layout from './component/layout/layout';
import { PrivateRoute } from './utils/auth/private-route';

export function App() {
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
        <CircularProgress
          color="secondary"
          style={{
            width: '10%',
            height: 'auto',
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: 40,
            color: 'darkblue',
          }}
        />
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
  );
}
