import Header from "./Header";
import SideBar from "./SideBar";
import Main from "./Main";
import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import Grid from '@mui/material/Grid';
import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';


export default function Dashboard({ userName, setIsLoggedIn, handleisLogged }) {

  const history = useHistory();

  useEffect(() => {
    document.title = "Drive Clone";
  });

  const [sideBarOption, setSideBarOption] = useState(0);
  const [reRender, setReRender] = useState(0);
  const [sideNavOpen, setSideNavOpen] = useState(false);

  const handleSideNavParent = () => {
    setSideNavOpen(!sideNavOpen);
  }


  if (setIsLoggedIn) {
    return (
      <div className="dashboard-container">
        <Header
          userName={userName}
          handleisLogged={handleisLogged}
          handleSideNav={handleSideNavParent} />
        <div className="main-flex">
          <SideBar
            setSideBarOption={setSideBarOption}
            reRender={reRender}
            setReRender={setReRender}
            handleSideNav={sideNavOpen}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 4, lg: 4 }}>
              <Main
                sideBarOption={sideBarOption}
                reRender={reRender}
                setReRender={setReRender}
              />
            </Grid>
          </Box>
        </div>
      </div >
    );
  } else {
    history.push("/login");
    return null;
  }
};

