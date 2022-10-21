import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router';
import { AuthService } from '../service/auth.service.js';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import { useViewport } from '../utils/useViewport';
import { useEffect } from 'react';

function Header({ userName, handleisLogged, handleSideNav }) {

	const useStyles = makeStyles((theme) => ({
		margin: {
			margin: 10,
		},
		avatar: {
			backgroundColor: 'red',
		},
	}));

	const history = useHistory();
	let sideNavOpen = true;
	const { isDesktop, isMobile, isTablet } = useViewport();

	const handleLogout = () => {
		AuthService.removeUserInfo();
		handleisLogged(false);
		history.push('/login');
	};

	const handleSideNavChildren = () => {
		const open = !sideNavOpen;
		handleSideNav(open);
	};

	const classes = useStyles();

	return (
		<div className="header">
			<div className="logo">
				<MenuIcon style={{ cursor: 'pointer' }} onClick={handleSideNavChildren} />
				<img
					src='/static/drive.png'
					alt="Logo"
				/>
				<h1>Drive Clone</h1>
			</div>

			<div className="avatar">
				<Avatar className={classes.avatar}>{userName[0]}</Avatar>
				<Button
					variant="outlined"
					size="small"
					color="primary"
					className={classes.margin}
					onClick={handleLogout}
				>
					<ExitToAppIcon />
					Logout
				</Button>
			</div>
		</div>
	);
}

export default Header;
