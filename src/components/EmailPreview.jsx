import { useState } from "react";
import "../assets/css/deviceMockups.css"; // new CSS file for device mockups

export default function EmailPreview({ subject ,body }) {
  const [previewDevice, setPreviewDevice] = useState("desktop");

  const renderEmailContent = () => (
    <div className="email-client-style">
      <div className="email-header">
        <h1 className="email-subject">{subject}</h1>
        <div className="email-sender-info">
          <span className="sender-name">John Doe</span>
          <span className="sender-email">&lt;john@example.com&gt;</span>
          <span className="email-time">10:30 AM</span>
        </div>
      </div>
      <div
        className="email-body-content"
        dangerouslySetInnerHTML={{ __html: body }}
      />
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
              {/* <div dangerouslySetInnerHTML={{ __html: body }} /> */}
              {renderEmailContent()}
            </div>
          </div>
        );
      case "laptop":
        return (
          <div className="laptop-mockup">
            <div className="laptop-top">
              <div className="laptop-screen">
                {/* <div dangerouslySetInnerHTML={{ __html: body }} /> */}
                {renderEmailContent()}
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
                {/* <div dangerouslySetInnerHTML={{ __html: body }} /> */}
                {renderEmailContent()}
              </div>
            </div>
            <div className="desktop-bottom" />
          </div>
        );
    }
  };

  return (
    <div style={{ flex: 1, padding: "10px" }}>
      <h3 className="preview-heading">Email Preview</h3>
      <div className="device-selector-container">
        <label className="device-selector-label">Preview for: </label>
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
      <div style={{ marginTop: "1rem" }}>{renderDeviceMockup()}</div>
    </div>
  );
}
