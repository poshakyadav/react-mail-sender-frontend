import React from "react";
import "../../assets/css/sidebar.css";
import { Link, useLocation } from "react-router-dom";

function SidebarTemplateIcon() {
  const location = useLocation(); // Get the current location
  const isDashboardActive = location.pathname === "/templates"; // Check if the current URL is /add-configuration

  return (
    <Link to={"/templates"}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        // fill="currentColor"
        fill={isDashboardActive ? "#000" : "#566573"}
        className="bi bi-collection-fill"
        viewBox="0 0 16 16"
      >
        <path
          id="templateIconId"
          d="M0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6zM2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3m2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1"
        />
      </svg>
    </Link>
  );
}

export default SidebarTemplateIcon;
