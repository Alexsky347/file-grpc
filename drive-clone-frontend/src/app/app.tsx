// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import styles from './app.module.scss';
import { ToastContainer } from 'react-toastify';
import NxWelcome from './nx-welcome';
import Login from '../page/login/login';
import { PrivateRoute } from '../utils/auth/private-route';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import Layout from "../component/layout/layout";

export function App() {

useEffect(() => {
  document.title = 'Login - Drive Clone';
}, []);

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
