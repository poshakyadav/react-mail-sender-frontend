// UserSavedTemplatesPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TemplateService from "../services/TemplateService";
import { FiSmartphone, FiTablet, FiMonitor } from "react-icons/fi";
import "../assets/css/template.css";

export default function UserSavedTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [deviceViews, setDeviceViews] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadSavedTemplates();
  }, []);

  const loadSavedTemplates = async () => {
    try {
      const templatesData = await TemplateService.getUserTemplates(token);
      setTemplates(templatesData);
      // Initialize device views
      const initialViews = templatesData.reduce((acc, template) => {
        acc[template.id] = "desktop";
        return acc;
      }, {});
      setDeviceViews(initialViews);
    } catch (err) {
      console.error("Error fetching templates:", err);
    }
  };

  const handleUseTemplate = (templateContent) => {
    localStorage.setItem("savedTemplateContent", templateContent);
    navigate("/create-campaign/step2");
  };

  const handleDeviceChange = (templateId, device) => {
    setDeviceViews(prev => ({ ...prev, [templateId]: device }));
  };

  // Group templates by category
  const groupedTemplates = templates.reduce((acc, template) => {
    const category = template.category?.name || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(template);
    return acc;
  }, {});

  const sortedCategories = Object.keys(groupedTemplates).sort();

  return (
    <div className="temp-container">
      <h1 className="temp-main-heading">Your Saved Templates</h1>

      {sortedCategories.length === 0 ? (
        <div className="temp-empty-state">
          <p className="temp-empty-text">No saved templates found.</p>
        </div>
      ) : (
        sortedCategories.map((category) => (
          <div key={category} className="temp-category-section">
            <h2 className="temp-category-heading">{category}</h2>
            <div className="temp-templates-grid">
              {groupedTemplates[category].map((template) => (
                <div key={template.id} className="temp-template-card">
                  <div className="temp-card-header">
                    <h3 className="temp-template-title">{template.name}</h3>
                    <div className="temp-device-controls">
                      <button
                        onClick={() => handleDeviceChange(template.id, "mobile")}
                        className={`temp-device-btn ${
                          deviceViews[template.id] === "mobile" ? "temp-active-device" : ""
                        }`}
                      >
                        <FiSmartphone className="temp-device-icon" />
                      </button>
                      <button
                        onClick={() => handleDeviceChange(template.id, "tablet")}
                        className={`temp-device-btn ${
                          deviceViews[template.id] === "tablet" ? "temp-active-device" : ""
                        }`}
                      >
                        <FiTablet className="temp-device-icon" />
                      </button>
                      <button
                        onClick={() => handleDeviceChange(template.id, "desktop")}
                        className={`temp-device-btn ${
                          deviceViews[template.id] === "desktop" ? "temp-active-device" : ""
                        }`}
                      >
                        <FiMonitor className="temp-device-icon" />
                      </button>
                    </div>
                  </div>

                  <div className="temp-preview-container">
                    <div className={`temp-device-preview ${deviceViews[template.id]}`}>
                      <iframe
                        title={`preview-${template.id}`}
                        srcDoc={template.htmlContent}
                        className="temp-preview-iframe"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleUseTemplate(template.htmlContent)}
                    className="temp-use-btn"
                  >
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}