// NewSendMailPage.jsx

import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import EmailService from "../services/EmailService";
import "../assets/css/newSendMailPage.css";
import { IoAnalyticsSharp } from "react-icons/io5";
import { IoIosRocket } from "react-icons/io";
import { TiArrowRightThick } from "react-icons/ti";

export default function NewSendMailPage() {
  const [folders, setFolders] = useState([]);
  const [recipientLists, setRecipientLists] = useState([]);

  const [selectedFolderId, setSelectedFolderId] = useState(null);
  // const [selectedFolderId, setSelectedFolderId] = useState(
  //   localStorage.getItem("selectedFolderId") || null
  // );

  // const [selectedListId, setSelectedListId] = useState(null);
  const [selectedListId, setSelectedListId] = useState(
    localStorage.getItem("selectedListId") || null
  );

  // const [subject, setSubject] = useState("");
  const [subject, setSubject] = useState(localStorage.getItem("subject") || "");

  // const [body, setBody] = useState("<p>Your email content here...</p>");
  const [body, setBody] = useState(
    localStorage.getItem("body") || "<p>Your email content here...</p>"
  );

  // const [step, setStep] = useState(1);

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const [recipientListId, setRecipientListId] = useState(null); // Added recipientListId state

  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [emailUsage, setEmailUsage] = useState(null);

  // Determine if we are on the hub page (i.e. the parent route "/create-campaign")
  const isHubPage = location.pathname === "/create-campaign";

  const checkEmailLimits = async () => {
    try {
      const token = localStorage.getItem("token");
      const usage = await EmailService.getEmailUsage(token);
      setEmailUsage(usage);
      return usage.totalAvailable > 0;
    } catch (err) {
      console.error("Error checking limits:", err);
      return true;
    }
  };

  useEffect(() => {
    // Clear campaign data when entering the hub page
    if (isHubPage) {
      clearDraft();
      localStorage.removeItem("body");
      localStorage.removeItem("selectedFolderId");
      localStorage.removeItem("selectedListId");
      localStorage.removeItem("subject");

      // Also clear the state
      setBody("<p>Your email content here...</p>");
      setSelectedFolderId(null);
      setSelectedListId(null);
      setSubject("");

      console.log("Clear storage if block called");
    }
  }, [isHubPage]);

  useEffect(() => {
    const loadFolders = async () => {
      try {
        const foldersData = await EmailService.getFolders(token);
        setFolders(foldersData);
      } catch (err) {
        console.error("Error fetching folders:", err);
      }
    };

    const loadDefaultTemplate = () => {
      const defaultTemplateContent = localStorage.getItem(
        "defaultTemplateContent"
      );
      const savedTemplateContent = localStorage.getItem("savedTemplateContent");
      if (defaultTemplateContent) {
        setBody(defaultTemplateContent);
        localStorage.removeItem("defaultTemplateContent");
      } else if (savedTemplateContent) {
        setBody(savedTemplateContent);
        localStorage.removeItem("savedTemplateContent"); // Clear after using
      }
    };

    loadFolders();
    loadDefaultTemplate();
  }, [token]);

  const handleFolderChange = async (folderId) => {
    setSelectedFolderId(folderId);
    localStorage.setItem("selectedFolderId", folderId);

    try {
      // Fetch recipient lists for the selected folder
      const listsData = await EmailService.getRecipientLists(folderId, token);
      setRecipientLists(listsData);

      // Only auto-select first list if no valid selection exists
      const isValidSelection = listsData.some(
        (list) => list.id === selectedListId
      );
      if (listsData.length > 0 && !isValidSelection) {
        setSelectedListId(listsData[0].id);
        localStorage.setItem("selectedListId", listsData[0].id);
      } else {
        setSelectedListId(null);
        localStorage.removeItem("selectedListId");
      }
    } catch (err) {
      console.error("Error fetching recipient lists:", err);
      setRecipientLists([]);
      setSelectedListId(null);
      localStorage.removeItem("selectedListId");
    }
  };

  const persistDraft = () => {
    localStorage.setItem("subject", subject);
    localStorage.setItem("body", body);
    localStorage.setItem("selectedFolderId", selectedFolderId);
    localStorage.setItem("selectedListId", selectedListId);
  };

  const clearDraft = () => {
    localStorage.removeItem("subject");
    localStorage.removeItem("body");
    localStorage.removeItem("selectedFolderId");
    localStorage.removeItem("selectedListId");
  };

  const handleSendMail = async () => {
    try {
      const canSend = await checkEmailLimits();
      if (!canSend) {
        setShowLimitPopup(true);
        return;
      }
      // -----------------------------

      if (!selectedListId) {
        alert("Please select a recipient list before sending the mail.");
        return;
      }

      const list = recipientLists.find(
        (list) => list.id === Number(selectedListId)
      );

      if (!list || !list.recipients || list.recipients.length === 0) {
        alert("Selected recipient list is empty or invalid.");
        return;
      }

      const recipients = list.recipients.map((recipient) => recipient.email);

      const recipientListId = selectedListId;
      const emailData = { subject, body, recipients, recipientListId };
      await EmailService.sendEmail(emailData, token);

      alert("Email sent successfully!");

      clearDraft();
      resetForm();
    } catch (err) {
      console.error("Error sending email:", err);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      const templateData = {
        name: subject,
        htmlContent: body,
        category: "Custom Templates",
      };
      await EmailService.saveTemplate(templateData, token);
      alert("Template saved successfully!");
    } catch (err) {
      console.error("Error saving template:", err);
    }
  };

  const resetForm = () => {
    setSubject("");
    setBody("<p>Your email content here...</p>");
    setSelectedFolderId(null);
    setSelectedListId(null);
  };

  useEffect(() => {
    persistDraft();
  }, [subject, body, selectedFolderId, selectedListId]);

  // Navigation handlers for the two main actions
  const handleNavigation = () => {
    navigate("/create-campaign/step1");
  };

  const handleViewCampaigns = () => {
    navigate("/history-campaigns");
  };

  return (
    <div>
      <h1 className="page-overview-title">📢 Create Campaigns</h1>
      <div className="new-send-mail-container">
        {isHubPage ? (
          // <div className="card-content">
          //   <div className="description action-card">
          //     <h2>Create New Campaign</h2>
          //     <p>
          //       Kickstart your campaign by selecting a folder and recipient list,
          //       then customize your email. When you're ready, click the button
          //       below to begin.
          //     </p>
          //     <div className="button-area">
          //       <button className="start-btn" onClick={handleNavigation}>
          //         Get Started
          //       </button>
          //     </div>
          //   </div>

          //   <div className="card-content">
          //     <div className="description action-card">
          //       <h2>See Your Campaigns</h2>
          //       <p>
          //         View, analyze, and manage all your previous campaigns in one
          //         place. Resend, edit, or create follow-up campaigns with ease.
          //       </p>
          //       <button className="campaigns-btn" onClick={handleViewCampaigns}>
          //         View Campaigns
          //       </button>
          //     </div>
          //   </div>

          // </div>

          <div className="sendMail-hub-grid">
            <div className="sendMail-hub-card sendMail-create-card">
              <div className="sendMail-card-glow"></div>
              <div className="sendMail-card-content">
                <div className="sendMail-card-icon"><IoIosRocket className="sendMail-rocket-icon"/></div>
                <h2>Launch New Campaign</h2>
                <p className="sendMail-card-description">
                  Craft impactful email campaigns with our step-by-step wizard.
                  Select audiences, design content, and optimize delivery for
                  maximum engagement.
                </p>
                <button className="sendMail-cta-btn sendMail-primary" onClick={handleNavigation}>
                  Begin Creation
                  <span className="sendMail-btn-arrow"><TiArrowRightThick/></span>
                </button>
              </div>
            </div>

            <div className="sendMail-hub-card sendMail-analytics-card">
              <div className="sendMail-card-glow"></div>
              <div className="sendMail-card-content">
                <div className="sendMail-card-icon"><IoAnalyticsSharp className="sendMail-analytics-icon"/></div>
                <h2>Campaign Analytics</h2>
                <p className="sendMail-card-description">
                  Monitor real-time performance metrics, analyze audience
                  engagement, and optimize ongoing campaigns with powerful
                  analytics tools.
                </p>
                <button
                  className="sendMail-cta-btn sendMail-primary"
                  onClick={handleViewCampaigns}
                >
                  Manage Campaigns
                  <span className="sendMail-btn-chart"><TiArrowRightThick/></span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Outlet
            context={{
              folders,
              recipientLists,
              selectedFolderId,
              selectedListId,
              subject,
              body,
              setFolders,
              handleFolderChange,
              setSelectedListId,
              setSubject,
              setBody,
              handleSendMail,
              handleSaveTemplate,
            }}
          />
        )}
      </div>

      {showLimitPopup && (
        <LimitWarningPopup
          onClose={() => setShowLimitPopup(false)}
          onAddMore={() => navigate("/add-configuration")}
        />
      )}
    </div>
  );
}
