import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router';
import { AuthService } from '../service/auth.service.js';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';



function Header({ userName, setIsLoggedIn, handleisLogged }) {

	const useStyles = makeStyles((theme) => ({
		margin: {
			margin: 10,
		},
		avatar: {
			backgroundColor: 'red',
		},
	}));
	const history = useHistory();

	function handleLogout() {
		AuthService.removeUserInfo();
		handleisLogged(false);
		history.push('/login');
	};

	const classes = useStyles();
	return (
		<div className="header">
			<div className="logo">
				<img
					src='/static/drive.png'
					alt="Logo"
				/>
				<h1>Drive Clone</h1>
			</div>

			<div className="avatar">
				<Button
					type="submit"
					variant="contained"
					size="small"
					color="primary"
					className={classes.margin}
					onClick={handleLogout}
				>
					<ExitToAppIcon />
				</Button>
				<Avatar className={classes.avatar}>{userName[0]}</Avatar>
			</div>
		</div>
	);
}

export default Header;
