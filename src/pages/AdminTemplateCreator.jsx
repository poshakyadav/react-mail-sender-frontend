import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import {
  FaBars,
  FaCompressArrowsAlt,
  FaExpandArrowsAlt,
  FaEye,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import "../assets/css/mailBodyEditor.css";
import EmailService from "../services/EmailService";

export default function AdminTemplateCreator() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);

  const [templateData, setTemplateData] = useState({
    name: "",
    category: "",
    htmlContent:
      "<!DOCTYPE html>\n<html>\n<head>\n  <title>Email Template</title>\n</head>\n<body>\n  <!-- Add your template content here -->\n</body>\n</html>",
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch categories from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    EmailService.getAllCategories(token)
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load categories");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      // Build payload with category as an object (with its id)
      const payload = {
        name: templateData.name,
        category: { id: templateData.category },
        htmlContent: templateData.htmlContent,
      };
      await EmailService.createAdminTemplate(payload, token);

      //   if (response.status === 201) {
      //     setSuccess("Template created successfully!");
      //     setTimeout(() => navigate("/admin/templates"), 1500);
      //   }

      setSuccess("Template created successfully!");
    } catch (err) {
      setError(err.message || "Failed to create template");
    }
  };

  const editorHeight = isExpanded ? "calc(100% - 50px)" : "400px";

  return (
    <div className="mail-body-editor">
      <div className="mbe-main-card">
        {/* Status Messages */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        {/* Top Section */}

        
        <div className="mbe-card-top-section">
          <nav className="mbe-navbar">
            <div className="mbe-nav-left">
              <button
                className="mbe-exit-btn"
                onClick={() => navigate("/dashboard")}
              >
                <span className="mbe-exit-text">Back</span>
              </button>
            </div>

            {windowWidth > 768 ? (
              <div className="mbe-nav-center">
                <button
                  className="mbe-nav-btn"
                  type="submit"
                  form="templateForm"
                >
                  <FaSave className="mbe-icon" /> Save Template
                </button>
              </div>
            ) : (
              <button
                className="mbe-menu-toggle"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <FaBars className="mbe-icon" />
              </button>
            )}
          </nav>

          {/* Mobile Sidebar */}
          <div className={`mbe-sidebar ${isSidebarOpen ? "open" : ""}`}>
            <button
              className="mbe-sidebar-btn"
              type="submit"
              form="templateForm"
            >
              <FaSave className="mbe-icon" />
              <span className="mbe-sidebar-url-text">Save Template</span>
            </button>
          </div>
        </div>

        {/* Form and Editor Section */}
        <form id="templateForm" onSubmit={handleSubmit}>
          <div className="template-meta-fields">
            <div className="form-group">
              <label>Template Name</label>
              <input
                type="text"
                required
                value={templateData.name}
                onChange={(e) =>
                  setTemplateData({ ...templateData, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                required
                value={templateData.category}
                onChange={(e) =>
                  setTemplateData({ ...templateData, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={`editor-container ${isExpanded ? "expanded" : ""}`}>
            <div className="editor-header">
              <h3 className="editor-title">Template HTML Editor</h3>
              <div className="editor-header-actions">
                <button
                  type="button"
                  className="mbe-nav-btn mbe-preview-btn"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <FaEye className="mbe-icon" /> Preview
                </button>
                <button
                  type="button"
                  className="expand-btn"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <FaCompressArrowsAlt /> : <FaExpandArrowsAlt />}
                </button>
              </div>
            </div>

            <Editor
              className="monaco-editor"
              height={editorHeight}
              defaultLanguage="html"
              value={templateData.htmlContent}
              theme="vs-dark"
              onChange={(value) =>
                setTemplateData({ ...templateData, htmlContent: value || "" })
              }
              options={{
                fontSize: 14,
                wordWrap: "on",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </form>

        
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button
              className="close-popup-btn"
              onClick={() => setIsPreviewOpen(false)}
            >
              <FaTimes />
            </button>
            <h3 className="popup-top-heading">Template Preview</h3>
            <div className="preview-container">
              <iframe
                title="template-preview"
                srcDoc={templateData.htmlContent}
                style={{
                  width: "100%",
                  height: "500px",
                  border: "none",
                  background: "white",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
