import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ViewportProvider } from './utils/ViewportProvider.js'

ReactDOM.render(
	<React.StrictMode>
		<ViewportProvider>
			<App />
		</ViewportProvider>
	</React.StrictMode>,
	document.getElementById('root')
);
