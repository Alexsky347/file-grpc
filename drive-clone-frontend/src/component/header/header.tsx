import React, { Dispatch, SetStateAction, useState } from 'react';
import styles from './header.module.scss';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../service/api/auth.service';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useViewPort } from '../../hook/use-view-port/use-view-port';
import { Sling as Hamburger } from 'hamburger-react';
import { Avatar } from '@mui/material';

interface HeaderProps {
  handleSideNav: (state: boolean) => boolean;
}

const Header: React.FC<HeaderProps> = ({ handleSideNav }) => {
  const { isDesktop, isMobile, isTablet } = useViewPort();
  const [isOpen, setOpen] = useState(false);
  const userName = AuthService.getCurrentUser()?.username ?? '';

  const StyledAvatar = styled(Avatar)({
    backgroundColor: 'white',
    color: 'darkblue',
    border: '1px solid black',
    margin: '10px',
  });

  const handleSideNavChildren = (state: boolean) => {
    handleSideNav(state);
    setOpen(state);
  };

  return (
    <div className="header">
      <div className="logo">
        <Hamburger
          toggled={isOpen}
          onToggle={handleSideNavChildren}
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
      </div>
    </div>
  );
};

export default Header;
