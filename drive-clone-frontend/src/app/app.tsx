// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import styles from './app.module.scss';
import { ToastContainer } from 'react-toastify';
import NxWelcome from './nx-welcome';
import Login from '../page/login/login';
import { PrivateRoute } from '../utils/auth/private-route';
import 'react-toastify/dist/ReactToastify.css';
import { useCallback, useEffect } from 'react';
import Layout from "../component/layout/layout";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/auth";

export function App() {

    const { user: currentUser } = useSelector((state: {auth: any}) => state.auth);
    const dispatch = useDispatch();

    const logOut = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);

useEffect(() => {
  document.title = 'Login - Drive Clone';
}, [currentUser, logOut]);

  return (

    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout/>
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
    // <div>
    //   <NxWelcome title="drive-clone" />
    // </div>
  );
}

export default App;
