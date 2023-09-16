import { useState, useEffect } from "react";
import {Sidenav} from "../sidenav/sidenav";
import Header from "../header/header";
import {Dashboard} from "../../page/dashboard/dashboard";


export default function Layout() {

    useEffect(() => {
        document.title = "Drive Clone";
    }, []);

    const [sideBarOption, setSideBarOption] = useState<number>(0);
    const [reRender, setReRender] = useState<number>(0);
    const [sideNavOpen, setSideNavOpen] = useState<boolean>(false);

    const handleSideNavParent = () => {
        setSideNavOpen(!sideNavOpen);
        return sideNavOpen;
    }
        return (
            <div className="dashboard-container">
                <Header
                    handleSideNav={handleSideNavParent}
                />
                <div className="main-flex">
                    <Sidenav
                        setSideBarOption={setSideBarOption}
                        reRender={reRender}
                        setReRender={setReRender}
                        handleSideNav={sideNavOpen}
                    />
                    <Dashboard
                        sideBarOption={sideBarOption}
                        reRender={reRender}
                        setReRender={setReRender}
                    />
                </div>
            </div>
        );
    }
