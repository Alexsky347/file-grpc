import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@radix-ui/themes/styles.css';
import { Theme, ThemePanel } from "@radix-ui/themes";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { reportWebVitals } from "./utils/main/reportWebVitals.ts";
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Theme>
            <Provider store={store}>
                <App />
            </Provider>
            {/*<ThemePanel />*/}
        </Theme>
    </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
