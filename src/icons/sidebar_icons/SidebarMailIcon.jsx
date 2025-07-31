import React from "react";
import "../../assets/css/sidebar.css";
import { Link, useLocation } from "react-router-dom";

function SidebarMailIcon() {
  const location = useLocation(); // Get the current location
  const isDashboardActive = location.pathname === "/send-mail"; // Check if the current URL is /add-configurations

  return (
    <Link to={"/send-mail"}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        // fill="currentColor"
        fill={isDashboardActive ? "#000" : "#566573"}
        className="bi bi-envelope-fill"
        viewBox="0 0 16 16"
      >
        <path
          id="mailIconId"
          d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"
        />
      </svg>
    </Link>
  );
}

export default SidebarMailIcon;
