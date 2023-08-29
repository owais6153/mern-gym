import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BackgroundColorContext } from "../contexts/BackgroundColorContext";
import Sidebar from "../components/Sidebar/Sidebar.js";
import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import FixedPlugin from "../components/FixedPlugin/FixedPlugin.js";
import logo from "../assets/img/tfp-logo.png";

const Layout =() =>{
    const mainPanelRef = React.useRef(null);
    const location = useLocation();
    const toggleSidebar = () => {
      document.documentElement.classList.toggle("nav-open");
      // setsidebarOpened(!sidebarOpened);
    };
    return(
      <BackgroundColorContext.Consumer>
        {({ color, changeColor }) => (
          <React.Fragment>
            {/* <Login /> */}

            <div className="wrapper ">
              <Sidebar
                routes={null}
                logo={{
                  innerLink: "/dashboard",
                  text: "",
                  imgSrc: logo
                }}
                // toggleSidebar={toggleSidebar}
              />
              <div className="main-panel" ref={mainPanelRef} data={color}>
                <AdminNavbar
                  brandText={location.pathname}
                  toggleSidebar={toggleSidebar}
                  // sidebarOpened={sidebarOpened}
                />
                <Outlet />
              </div>
            </div>
            <FixedPlugin bgColor={color} handleBgClick={changeColor} />
          </React.Fragment>
        )}
      </BackgroundColorContext.Consumer>
    )
}

export default Layout;