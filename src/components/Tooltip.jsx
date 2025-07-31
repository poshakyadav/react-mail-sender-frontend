import { useRef, useState, useEffect } from "react";
import "../assets/css/components.css";

export default function Tooltip({ children, text, className }) {
  const [tooltipStyle, setTooltipStyle] = useState({});
  const [isVisible, setIsVisible] = useState(false); // State to control visibility
  const tooltipRef = useRef(null);

  // Show tooltip on hover or tap
  const showTooltip = (event) => {
    const rect = event.target.getBoundingClientRect(); // Get element position
    setTooltipStyle({
      top: rect.top - 6 + "px", // Position above the element
      left: rect.right + 5 + "px", // Align tooltip to the right end of the column
      opacity: 1,
      visibility: "visible",
    });
    setIsVisible(true); // Show the tooltip
  };

  // Hide tooltip
  const hideTooltip = () => {
    setIsVisible(false); // Hide the tooltip
  };

  // Handle clicks outside the tooltip to hide it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        hideTooltip(); // Hide the tooltip if the click is outside
      }
    };

    // Add event listener for clicks outside the tooltip
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    // Cleanup event listeners
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`tooltip-container ${className}`}
      onMouseEnter={showTooltip} // For desktop hover
      onMouseLeave={hideTooltip} // For desktop hover
      onTouchStart={showTooltip} // For touch devices
      ref={tooltipRef}
    >
      {children}
      {isVisible && ( // Conditionally render the tooltip
        <div className="tooltip" style={tooltipStyle}>
          {text}
        </div>
      )}
    </div>
  );
}