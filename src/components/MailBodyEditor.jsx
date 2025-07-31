import { useOutletContext, useNavigate } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import EmailPreview from "./EmailPreview";
import InboxPreview from "./InboxPreview";
import {
  FaBars,
  FaCompressArrowsAlt,
  FaEnvelope,
  FaExpandArrowsAlt,
  FaEye,
  FaPaperPlane,
  FaPowerOff,
  FaRegFileAlt,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { FiInbox } from "react-icons/fi";
import { MdOutlineDoubleArrow } from "react-icons/md";
import "../assets/css/mailBodyEditor.css";
import { useEffect } from "react";
import EmailService from "../services/EmailService";
import SaveTemplatePopUpModal from "./SaveTemplatePopUpModal";

export default function MailBodyEditor() {
  const { subject, body, setBody, handleSendMail } = useOutletContext();
  const navigate = useNavigate();

  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewType, setPreviewType] = useState("email");

  const [isExpanded, setIsExpanded] = useState(false);

  // -----------------------

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // Add this state variable
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Replace the existing handleSaveTemplate function
  const handleSaveClick = () => setShowSaveModal(true);

  const handleSaveTemplate = async (templateData) => {
    try {
      const token = localStorage.getItem("token");
      await EmailService.saveTemplate(
        {
          name: templateData.name,
          htmlContent: templateData.htmlContent,
          category: { id: templateData.category },
        },
        token
      );
      alert("Template saved successfully!");
    } catch (err) {
      console.error("Error saving template:", err);
      alert("Failed to save template");
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close sidebar when resizing to desktop
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // ----------------------

  const handleExit = () => {
    setShowExitDialog(true);
  };

  const handleConfirmExit = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key !== "token") {
        localStorage.removeItem(key);
      }
    });
    navigate("/dashboard");
  };

  const handleCancelExit = () => {
    setShowExitDialog(false);
  };

  // Determine editor height based on expansion state
  const editorHeight = isExpanded ? "calc(100% - 50px)" : "400px";

  return (
    <div className="mail-body-editor">
      <div className="mbe-main-card">
        {/* Top Section */}

        <div className="mbe-card-top-section">
          <div className="back-button-section">
            <button
              className="back-button"
              onClick={() => navigate("/create-campaign/step1")}
            >
              <MdOutlineDoubleArrow className="back-icon" /> Back
            </button>
          </div>

          {/* Navigation Header */}
          <nav className="mbe-navbar">
            <div className="mbe-nav-left">
              <button className="mbe-exit-btn" onClick={handleExit}>
                <FaPowerOff className="mbe-exit-icon" />{" "}
                <span className="mbe-exit-text">Exit</span>
              </button>
            </div>

            {windowWidth > 768 ? (
              <div className="mbe-nav-center">
                <button
                  className="mbe-nav-btn"
                  onClick={() => navigate("/templates")}
                >
                  Use Default Template
                </button>
                <button
                  className="mbe-nav-btn"
                  onClick={() => navigate("/saved-templates")}
                >
                  Use Saved Template
                </button>
                <button className="mbe-nav-btn" onClick={handleSaveClick}>
                  <FaSave className="mbe-icon" /> Save Template
                </button>
              </div>
            ) : (
              <button className="mbe-menu-toggle" onClick={toggleSidebar}>
                <FaBars className="mbe-icon" />
              </button>
            )}
          </nav>

          {/* Mobile Sidebar */}
          <div className={`mbe-sidebar ${isSidebarOpen ? "open" : ""}`}>
            <button
              className="mbe-sidebar-btn"
              onClick={() => navigate("/templates")}
            >
              <FaRegFileAlt className="mbe-icon" />
              <span className="mbe-sidebar-url-text">Use Default Template</span>
            </button>
            <button
              className="mbe-sidebar-btn"
              onClick={() => navigate("/saved-templates")}
            >
              <FiInbox className="mbe-icon" />
              <span className="mbe-sidebar-url-text">Use Saved Template</span>
            </button>
            <button className="mbe-sidebar-btn" onClick={handleSaveClick}>
              <FaSave className="mbe-icon" />
              <span className="mbe-sidebar-url-text">Save Template</span>
            </button>
          </div>
        </div>

        {/* Editor Section */}
        <div className={`editor-container ${isExpanded ? "expanded" : ""}`}>
          <div className="editor-header">
            <h3 className="editor-title">Customize Email Body</h3>
            <div className="editor-header-actions">
              {/* {isExpanded && ( */}
              <button
                className="mbe-nav-btn mbe-preview-btn"
                onClick={() => setIsPreviewOpen(true)}
                title="Preview Email"
              >
                <FaEye className="mbe-icon" /> Preview
              </button>
              {/* )} */}
              <button
                className="expand-btn"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Exit Full Screen" : "Expand Full Screen"}
              >
                {isExpanded ? <FaCompressArrowsAlt /> : <FaExpandArrowsAlt />}
              </button>
            </div>
          </div>
          <Editor
            className="monaco-editor"
            height={editorHeight}
            // height="400px"
            // width=""
            defaultLanguage="html"
            value={body}
            theme="vs-dark"
            onChange={(value) => setBody(value || "")}
            options={{
              fontSize: 14,
              wordWrap: "on",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />

          {/* Bottom Action Bar Section*/}
          <div className="mbe-action-bar">
            <button className="mbe-send-btn" onClick={handleSendMail}>
              <FaEnvelope className="mbe-icon" /> Send Mail
            </button>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <p>Are you sure you want to exit?</p>
            <div className="dialog-buttons">
              <button
                className="dialog-btn confirm-btn"
                onClick={handleConfirmExit}
              >
                Yes
              </button>
              <button
                className="dialog-btn cancel-btn"
                onClick={handleCancelExit}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Popup Overlay */}
      {isPreviewOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            {/* Close Button at Top-Right */}
            <button
              className="close-popup-btn"
              onClick={() => setIsPreviewOpen(false)}
              aria-label="Close Preview"
            >
              <FaTimes />
            </button>
            <h3 className="popup-top-heading">Email Preview</h3>
            <div className="preview-mode">
              <label htmlFor="previewSelect">Preview Mode: </label>
              <select
                id="previewSelect"
                value={previewType}
                onChange={(e) => setPreviewType(e.target.value)}
              >
                <option value="email">Email Body Preview</option>
                <option value="inbox">Inbox Preview</option>
              </select>
            </div>
            <div className="preview-container">
              {previewType === "email" ? (
                <EmailPreview subject={subject} body={body} />
              ) : (
                <InboxPreview subject={subject} body={body} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* // Add the modal at the bottom of the component */}
      {showSaveModal && (
        <SaveTemplatePopUpModal
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveTemplate}
          initialName={subject}
          initialContent={body}
        />
      )}
    </div>
  );
}
