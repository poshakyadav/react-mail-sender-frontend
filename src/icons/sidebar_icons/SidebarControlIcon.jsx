import React from "react";
import "../../assets/css/sidebar.css";

function SidebarControlIcon() {
  return (
    <svg
        id="controlIconSvgId"
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      fill="currentColor"
      className="bi bi-caret-left-fill"
      viewBox="0 0 16 16"
    >
      <path id="controlIconId" d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
    </svg>
  );
}

export default SidebarControlIcon;
