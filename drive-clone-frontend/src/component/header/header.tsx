import React, {Dispatch, SetStateAction, useState} from 'react';
import styles from './header.module.scss';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../service/api/auth.service';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useViewPort } from '../../hook/use-view-port/use-view-port';
import { toast } from 'react-toastify';
import { Sling as Hamburger } from 'hamburger-react';
import {Avatar, Button} from "@mui/material";

interface HeaderProps {
  handleSideNav: (state: boolean) => boolean;
}

const Header: React.FC<HeaderProps> = ({  handleSideNav }) => {
  // const { isDesktop, isMobile, isTablet } = useViewPort();
  const [isOpen, setOpen] = useState(false);
  const userName = '';

  const useStyles = makeStyles((theme: any) => ({
    margin: {
      margin: 10,
    },
    avatar: {
      backgroundColor: 'white',
      color: 'darkblue',
      border: '1px solid black',
    },
  }));

  const navigate = useNavigate();

  const handleLogout = (): void => {
    AuthService.removeUserInfo();
    navigate('/login');
    toast.success(`You're logged out`);
  };

  const handleSideNavChildren = (state: boolean) => {
    handleSideNav(state);
    setOpen(state);
  };

  const classes = useStyles();

  return (
    <div className="header">
      <div className="logo">
        <Hamburger
          toggled={isOpen}
          toggle={handleSideNavChildren}
          duration={0.8}
          rounded
          label="Show menu"
          size={36}
        />
        <img src="/static/drive.png" alt="Logo" />
        <h1>{document.title}</h1>
      </div>

      <div className="avatar">
        <Avatar className={classes.avatar}>{userName?.[0]}</Avatar>
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
};

export default Header;
