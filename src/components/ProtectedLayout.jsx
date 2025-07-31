import React from "react";
import "../assets/css/sidebar.css";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const ProtectedLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;
