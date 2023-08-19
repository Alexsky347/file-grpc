import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';


// minified version is also included
// import 'react-toastify/dist/ReactToastify.min.css';

function App() {
	const [username, setUsername] = useState('');
	const [isLogged, setIsLogged] = useState(false);


	/**
	 * props from child
	 * @param {*} name 
	 */
	const handleUsername = name => {
		setUsername(current => current = name)
	}

	const handleIsLogged = state => {
		setIsLogged(current => current = state)
	}


	return (
		<div className="App">
			<Router>
				<Switch>
					<Route exact path="/login">
						<Login handleUsername={handleUsername} handleIsLogged={handleIsLogged} />
					</Route>
					<Route exact path="/">
						<Dashboard userName={username} setIsLoggedIn={isLogged} handleIsLogged={handleIsLogged} />
					</Route>
				</Switch>
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
				theme="light" />
		</div>
	);
}

export default App;
