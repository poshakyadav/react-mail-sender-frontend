import React from "react";
import "../../assets/css/sidebar.css";
import { Link, useLocation } from "react-router-dom";

function SidebarFolderIcon() {
  const location = useLocation(); // Get the current location
  const isDashboardActive = location.pathname === "/folder"; // Check if the current URL is /folder
  return (
    <Link to={"/folder"}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        // fill="currentColor"
        fill={isDashboardActive ? "#000" : "#566573"}
        className="bi bi-folder-fill"
        viewBox="0 0 16 16"
      >
        <path
          id="folderIconId"
          d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3m-8.322.12q.322-.119.684-.12h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981z"
        />
      </svg>
    </Link>
  );
}

export default SidebarFolderIcon;
