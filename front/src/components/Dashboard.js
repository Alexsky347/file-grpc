import Header from "./Header";
import SideBar from "./SideBar";
import Main from "./Main";
import { useState, useEffect } from "react";
import { useHistory } from "react-router";


export default function Dashboard({ userName, setIsLoggedIn, handleisLogged }) {
  const history = useHistory();

  useEffect(() => {
    document.title = "Drive Clone";
  }, [history]);

  const [sideBarOption, setSideBarOption] = useState(0);
  const [reRender, setReRender] = useState(0);


  if (setIsLoggedIn) {
    return (
      <div className="dashboard-container">
        <Header userName={userName} setIsLoggedIn={setIsLoggedIn} handleisLogged={handleisLogged} />
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

