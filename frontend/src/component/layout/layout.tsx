import { useEffect, useState } from 'react';
import { Box } from "@radix-ui/themes";
import Header from "../header/header.tsx";
import Dashboard from "../../page/dashboard/dashboard.tsx";
import SideNav from "../sidenav/sidenav.tsx";


export default function Layout() {
    useEffect(() => {
        document.title = 'Drive Clone';
    }, []);

    const [sideNavOpen, setSideNavOpen] = useState<boolean>(false);
    const [reRender, setReRender] = useState<boolean>(false);

    const handleRender = () => {
        setReRender(!reRender);
    }

    const toggleSideNav = () => {
        setSideNavOpen(!sideNavOpen);
    };


    return (
        <Box>
            <Header handleSideNav={toggleSideNav}/>
            <SideNav sideNavOpen={sideNavOpen}
                        reRender={reRender}
                     setReRender={handleRender}/>
            <Dashboard sideNavOpen={sideNavOpen}
                       reRender={reRender}
                       setReRender={handleRender}/>
        </Box>
    );
}
