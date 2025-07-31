import { useState } from "react";
import "../assets/css/deviceMockups.css"; // reuse the device mockup styles 

export default function InboxPreview({ subject, body }) {
  const [previewDevice, setPreviewDevice] = useState("desktop");
  const previewText = body.replace(/<[^>]*>/g, "").substring(0, 100) + "...";

  const renderInboxContent = () => (
    <div className="email-client-style">
      <div className="inbox-item unread">
        <span className="star-icon">★</span>
        <span className="inbox-sender">John Doe</span>
        <div className="inbox-content-wrapper">
          <span className="inbox-subject">{subject}</span>
          <span className="inbox-preview-text">{previewText}</span>
        </div>
        <div className="inbox-time-wrapper">
          <span className="inbox-time">10:30 AM</span>
          {/* <span className="unread-dot"></span> */}
        </div>
      </div>
      {/* Add more mock inbox items for realism */}
      <div className="inbox-item">
        <span className="star-icon">☆</span>
        <span className="inbox-sender">Jane Smith</span>
        <div className="inbox-content-wrapper">
          <span className="inbox-subject">Meeting Tomorrow</span>
          <span className="inbox-preview-text">Hi, just wanted to confirm our meeting...</span>
        </div>
        <div className="inbox-time-wrapper">
          <span className="inbox-time">9:15 AM</span>
        </div>
      </div>
    </div>
  );

  const renderDeviceMockup = () => {
    switch (previewDevice) {
      case "phone":
        return (
          <div className="phone-mockup">
            <div className="phone-mockup-side-button left-1" />
            <div className="phone-mockup-side-button left-2" />
            <div className="phone-mockup-side-button left-3" />
            <div className="phone-mockup-side-button right" />
            <div className="phone-screen">
              {renderInboxContent()}
            </div>
          </div>
        );
      case "laptop":
        return (
          <div className="laptop-mockup">
            <div className="laptop-top">
              <div className="laptop-screen">
                {renderInboxContent()}
              </div>
            </div>
            <div className="laptop-bottom" />
          </div>
        );
      default: // desktop
        return (
          <div className="desktop-mockup">
            <div className="desktop-top">
              <div className="desktop-screen">
                {renderInboxContent()}
              </div>
            </div>
            <div className="desktop-bottom" />
          </div>
        );
    }
  };

  return (
    <div style={{ flex: 1, padding: "10px" }}>
      <h3 className="preview-heading">Inbox Preview</h3>
      <div className="device-selector-container">
        <label  className="device-selector-label">Preview for: </label>
        <select
          className="device-selector"
          value={previewDevice}
          onChange={(e) => setPreviewDevice(e.target.value)}
        >
          <option value="desktop">Desktop</option>
          <option value="laptop">Laptop</option>
          <option value="phone">Phone</option>
        </select>
      </div>
      <div style={{ marginTop: "1rem" }}>
        {renderDeviceMockup()}
      </div>
    </div>
  );
}