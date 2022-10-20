import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { AuthService } from '../service/auth.service.js';
import { toast } from 'react-toastify';


function Login({ handleUsername, handleisLogged }) {
	const history = useHistory();
	// state Variables
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [isValidated, setIsValidated] = useState(false);
	const [isClicked, setIsclicked] = useState(false);

	// Functions
	const useStyles = makeStyles((theme) => ({
		margin: {
			margin: theme.spacing(1),
		},
	}));

	const classes = useStyles();

	// useEffect
	useEffect(() => {
		document.title = 'Login - Drive Clone';
	}, [history]);

	async function loginUser(data) {
		const response = await AuthService.postLogin(data);

		if (response.status === 200
			&& response?.headers?.access_token
			&& response?.headers?.refresh_token) {
			AuthService.setUserInfo({
				accessToken: response.headers.access_token,
				refreshToken: response.headers.refresh_token
			});
			handleUsername(data.username);
			handleisLogged(true);
			toast.success(`You 're logged`);
			history.push('/');
		} else {
			toast.error(`${response?.response?.data?.errorMessage}`);
		}
	}

	function validateCreds(e) {
		e.preventDefault();

		// Username regex
		const nameRegex = /^[a-z ,.'-]+$/i;

		// Password Regex
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{2,}$/;

		if (nameRegex.test(name) && password) {
			setIsValidated(true);

			// Posting to the API
			e.preventDefault();
			loginUser({ username: name, password: password });
		} else {

			setIsValidated(false);
		}
		setIsclicked(true);
	};


	return (
		<div className="login-container">
			<form className="login-form">
				<div className="form-header">
					<img
						className="form-logo"
						src='/static/drive.png'
						alt="Drive Logo"
					/>
					<h3 className="form-title">Login</h3>
				</div>
				<TextField
					id="outlined-full-width login-email"
					label="Username"
					style={{ margin: 8 }}
					{...(!isValidated && isClicked ? { error: true } : {})}
					placeholder="Username"
					fullWidth
					margin="normal"
					InputLabelProps={{
						shrink: true,
					}}
					autoComplete="off"
					variant="outlined"
					onChange={(e) => {
						setName(e.target.value);
					}}
				/>
				<TextField
					id="outlined-full-width login-password"
					type="password"
					label="Password"
					style={{ margin: 8 }}
					{...(!isValidated && isClicked ? { error: true } : {})}
					placeholder="Password"
					fullWidth
					margin="normal"
					InputLabelProps={{
						shrink: true,
					}}
					autoComplete="off"
					variant="outlined"
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>
				<Button
					type="submit"
					variant="contained"
					size="medium"
					color="primary"
					className={classes.margin}
					onClick={validateCreds}
				>
					Login
				</Button>
			</form>
		</div>
	);
};

export default Login;
