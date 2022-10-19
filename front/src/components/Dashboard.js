import Header from "./Header";
import SideBar from "./SideBar";
import Main from "./Main";
import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { AuthService } from '../service/auth.service.js';


const Dashboard = () => {
  const history = useHistory();

  useEffect(() => {
    document.title = "Drive Clone";
  }, [history]);

  const [userName, setUserName] = useState("");
  const [sideBarOption, setSideBarOption] = useState(0);
  const [reRender, setReRender] = useState(0);


  if (AuthService.isLogged) {
    return (
      <div className="dashboard-container">
        <Header userName={userName} setIsLoggedIn={AuthService.isLogged} />
        <div className="main-flex">
          <SideBar
            setSideBarOption={setSideBarOption}
            reRender={reRender}
            setReRender={setReRender}
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

export default Dashboard;
