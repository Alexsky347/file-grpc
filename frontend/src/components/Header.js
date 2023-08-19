import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router';
import { AuthService } from '../service/auth.service.js';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useViewport } from '../utils/useViewport';
import { useEffect, useState } from 'react';
import { Sling as Hamburger } from 'hamburger-react'
import { yellow } from '@material-ui/core/colors';
import { toast } from 'react-toastify';

function Header({ userName, handleIsLogged, handleSideNav }) {
	const { isDesktop, isMobile, isTablet } = useViewport();
	const [isOpen, setOpen] = useState(false);

	const useStyles = makeStyles((theme) => ({
		margin: {
			margin: 10,
		},
		avatar: {
			backgroundColor: 'white',
			color: 'darkblue',
			border: '1px solid black'
		},
	}));


	const history = useHistory();

	const handleLogout = () => {
		AuthService.removeUserInfo();
		handleIsLogged(false);
		history.push('/login');
		toast.success(`You 're log out`);
	};

	const handleSideNavChildren = (state) => {
		handleSideNav(state);
		setOpen(state)
	};

	const classes = useStyles();

	return (
		<div className="header">
			<div className="logo">
				<Hamburger toggled={isOpen}
					toggle={handleSideNavChildren}
					duration={0.8}
					rounded
					label="Show menu"
					size={36}
				/>
				<img
					src='/static/drive.png'
					alt="Logo"
				/>
				<h1>{ document.title }</h1>
			</div>

			<div className="avatar">
				<Avatar className={classes.avatar} >{userName[0]}</Avatar>
				<Button
					variant="outlined"
					size="small"
					color="primary"
					className={classes.margin}
					onClick={handleLogout}
				>
					<ExitToAppIcon />

				</Button>
			</div>
		</div>
	);
}

export default Header;
