import React, { Dispatch, SetStateAction, useState } from 'react';
import styles from './header.module.scss';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../service/api/auth.service';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useViewPort } from '../../hook/use-view-port/use-view-port';
import { toast } from 'react-toastify';
import { Sling as Hamburger } from 'hamburger-react';
import { Avatar, Button } from '@mui/material';

interface HeaderProps {
  handleSideNav: (state: boolean) => boolean;
}

const Header: React.FC<HeaderProps> = ({ handleSideNav }) => {
  // const { isDesktop, isMobile, isTablet } = useViewPort();
  const [isOpen, setOpen] = useState(false);
  const userName = '';

  const StyledAvatar = styled(Avatar)({
    backgroundColor: 'white',
    color: 'darkblue',
    border: '1px solid black',
  });

  const StyledBtn= styled(Button)({
    margin: 10,
  });

  const navigate = useNavigate();

  const handleLogout = (): void => {
    AuthService.logout();
    navigate('/login');
    toast.success(`You're logged out`);
  };

  const handleSideNavChildren = (state: boolean) => {
    handleSideNav(state);
    setOpen(state);
  };


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
        <StyledAvatar>
        <Avatar>{userName?.[0]}</Avatar>
        </StyledAvatar>
        <StyledBtn>
          <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={handleLogout}>
            <ExitToAppIcon />
          </Button>
        </StyledBtn>

      </div>
    </div>
  );
};

export default Header;
