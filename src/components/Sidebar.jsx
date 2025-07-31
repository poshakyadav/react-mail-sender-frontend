import React, { useEffect, useState } from "react";
import "../assets/css/sidebar.css"; // Move your sidebar CSS into this file
import { Link, NavLink, useNavigate } from "react-router-dom";
import SidebarFolderIcon from "../icons/sidebar_icons/SidebarFolderIcon";
import SidebarGearIcon from "../icons/sidebar_icons/SidebarGearIcon";
import SidebarDashboardIcon from "../icons/sidebar_icons/SidebarDashboardIcon";
import SidebarMailIcon from "../icons/sidebar_icons/SidebarMailIcon";
import SidebarTemplateIcon from "../icons/sidebar_icons/SidebarTemplateIcon";
import LogoutIcon from "../icons/sidebar_icons/LogoutIcon";
import SidebarControlIcon from "../icons/sidebar_icons/SidebarControlIcon";
import EmailService from "../services/EmailService";
import LogoIcon from "../icons/sidebar_icons/LogoIcon";
import MailIcon from "../icons/sidebar_icons/MailIcon";
import { HiOutlineLogout } from "react-icons/hi";
import { MdCampaign } from "react-icons/md";
import { HiTemplate } from "react-icons/hi";
import { MdOutlineCampaign } from "react-icons/md";
import { FaFolderOpen } from "react-icons/fa6";
import { IoSettings } from "react-icons/io5";
import { MdAnalytics } from "react-icons/md";

const Sidebar = () => {
  // Use lazy initialization to read the sidebar state from localStorage, default to false if nothing is saved.
  const [isOpen, setIsOpen] = useState(() => {
    const storedState = localStorage.getItem("sidebarIsOpen");
    return storedState ? JSON.parse(storedState) : false;
  });

  // Update localStorage whenever the isOpen state changes
  useEffect(() => {
    localStorage.setItem("sidebarIsOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  // Closes the sidebar on small devices (max-width: 768px)
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  // Logout Feature

  const navigate = useNavigate(); // For redirecting after logout

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      if (token) {
        await EmailService.logout(token);
        alert("You have successfully logged out!");
        navigate("/login"); // Redirect to the login page after logout
      } else {
        alert("No user is logged in!");
      }
    } catch (err) {
      console.error("Error during logout:", err);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div
        className={`control ${!isOpen ? "rotate" : ""}`}
        onClick={toggleSidebar}
      >
        <SidebarControlIcon />
      </div>

      <div className={`logo ${isOpen ? "" : "closed"}`}>
        <div>
          {/* <LogoIcon className="logoImage" /> */}
          <MailIcon className="logoImage" />
        </div>
        <h1 className="logoName hover:text-[#566573]">Post Mail</h1>
      </div>
      <ul className="sidebarULItem">
        <li className="sidebarListItem">
          <NavLink
            to={"/dashboard"}
            onClick={handleLinkClick}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <div className="pr-1 pt-2 pb-2">
              <MdAnalytics className="analytics-react-icon sidebars-icon" />
            </div>
            <span id="dashboard" className="urlText">
              Dashboard
            </span>
          </NavLink>
        </li>

        <li className="sidebarListItem">
          <NavLink
            to={"/add-configuration"}
            onClick={handleLinkClick}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <div className="pr-1 pt-2 pb-2">
              {/* <SidebarGearIcon /> */}
              <IoSettings className="setting-react-icon sidebars-icon" />
            </div>
            <span className="urlText">Config</span>
          </NavLink>
        </li>

        <li className="sidebarListItem">
          <NavLink
            to={"/folder"}
            onClick={handleLinkClick}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <div className="pr-1 pt-2 pb-2">
              {/* <SidebarFolderIcon /> */}
              <FaFolderOpen className="folder-react-icon sidebars-icon" />
            </div>
            <span className="urlText">Folders</span>
          </NavLink>
        </li>

        <li className="sidebarListItem">
          <NavLink
            to={"/create-campaign"}
            onClick={handleLinkClick}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <div className="pr-1 pt-2 pb-2">
              {/* <SidebarMailIcon /> */}
              <MdOutlineCampaign className="create-campaign-react-icon sidebars-icon" />
            </div>
            <span className="urlText">Create Campaign</span>
          </NavLink>
        </li>

        <li className="sidebarListItem">
          <NavLink
            to={"/history-campaigns"}
            onClick={handleLinkClick}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <div className="pr-1 pt-2 pb-2">
              {/* <SidebarMailIcon /> */}
              <MdCampaign className="campaign-react-icon sidebars-icon" />
            </div>
            <span className="urlText">Manage Campaigns</span>
          </NavLink>
        </li>

        <li className="sidebarListItem">
          <NavLink
            to={"/templates"}
            onClick={handleLinkClick}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <div className="pr-1 pt-2 pb-2">
              {/* <SidebarTemplateIcon /> */}
              <HiTemplate className="template-react-icon sidebars-icon" />
            </div>
            <span className="urlText">Default Templates</span>
          </NavLink>
        </li>

        <li className="sidebarListItem">
          <Link
            onClick={() => {
              handleLogout();
              handleLinkClick();
            }}
            // className={" text-red-500  hover:text-[#E83030]"}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <div id="sidebarLogoutItem" className="pr-1 pt-2 pb-2">
              {/* <LogoutIcon /> */}
              <HiOutlineLogout className="logout-react-icon sidebars-icon" />
            </div>
            <span className={"logoutText  text-red-500  hover:text-[#E83030]"}>Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
