import Header from "./Header";
import SideBar from "./SideBar";
import Main from "./Main";
import { useState, useEffect } from "react";
import { useHistory } from "react-router";


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
          <Main
            sideBarOption={sideBarOption}
            reRender={reRender}
            setReRender={setReRender}
          />
        </div>
      </div>
    );
  } else {
    history.push("/login");
    return null;
  }
};

