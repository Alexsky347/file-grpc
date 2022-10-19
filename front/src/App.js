import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
// minified version is also included
// import 'react-toastify/dist/ReactToastify.min.css';
require('dotenv').config();

function App() {
	return (
		<div className="App">
			<Router>
				<Switch>
					{/* Login Route */}
					<Route exact path="/login">
						<Login />
					</Route>
					{/* Dashboard Route */}
					<Route exact path="/">
						<Dashboard />
					</Route>
				</Switch>
			</Router>
			<ToastContainer />
		</div>
	);
}

export default App;
