import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import { FaEye, FaTimes } from "react-icons/fa";
import EmailService from "../services/EmailService";
import "../assets/css/editCampaign.css";
import EmailPreview from "../components/EmailPreview";
import InboxPreview from "../components/InboxPreview";

export default function EditCampaign() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("<p>Your email content here...</p>");
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [selectedListId, setSelectedListId] = useState("");
  const [folders, setFolders] = useState([]);
  const [recipientLists, setRecipientLists] = useState([]);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewType, setPreviewType] = useState("email");

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        console.log("Campaign id is : " + campaignId);
        const response = await EmailService.getCampaignById(campaignId, token);
        const { subject, body, recipientListId, folderId } = response;
        setSubject(subject);
        setBody(body);
        setSelectedListId(recipientListId);
        setSelectedFolderId(folderId);
      } catch (error) {
        console.error("Error fetching campaign details:", error);
      }
    };

    const fetchFoldersAndLists = async () => {
      try {
        const foldersData = await EmailService.getFolders(token);
        setFolders(foldersData);
        if (foldersData.length > 0) {
          const listsData = await EmailService.getRecipientLists(
            foldersData[0].id,
            token
          );
          setRecipientLists(listsData);
        }
      } catch (error) {
        console.error("Error fetching folders and recipient lists:", error);
      }
    };

    fetchCampaignDetails();
    fetchFoldersAndLists();
  }, [campaignId, token]);

  useEffect(() => {
    if (selectedFolderId) {
      handleFolderChange(selectedFolderId);
    }
  }, [selectedFolderId]);

  const handleFolderChange = async (folderId) => {
    setSelectedFolderId(folderId);
    try {
      const listsData = await EmailService.getRecipientLists(folderId, token);
      setRecipientLists(listsData);
    } catch (error) {
      console.error("Error fetching recipient lists:", error);
    }
  };

  const handleSave = async () => {
    try {
      const campaignData = {
        subject,
        body,
        recipientListId: selectedListId,
      };

      await EmailService.updateCampaign(campaignId, campaignData, token);
      alert("Campaign updated successfully!");
      navigate("/history-campaigns");
    } catch (error) {
      console.error("Error updating campaign:", error);
    }
  };

  const handleCancel = () => {
    navigate("/history-campaigns");
  };

  return (
    <div>
      <h1 className="page-overview-title">🚀 Edit Campaign</h1>
      <div className="edit-campaign">
        {/* Top Bar with Preview Button */}
        <div className="edit-top-bar">
          <div className="exist-preview-button">
            <button
              className="edit-preview-btn"
              onClick={() => setIsPreviewOpen(true)}
            >
              <FaEye className="icon" /> Preview
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="form-group">
          <label>Folder:</label>
          <select
            value={selectedFolderId || ""}
            onChange={(e) => handleFolderChange(e.target.value)}
          >
            <option value="">Select Folder</option>
            {folders.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Recipient List:</label>
          <select
            value={selectedListId || ""}
            onChange={(e) => setSelectedListId(e.target.value)}
          >
            <option value="">Select Recipient List</option>
            {recipientLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="form-group editor-container">
          <h3 className="editor-title">Edit Email Body</h3>
          <Editor
            height="400px"
            width="100%"
            value={body}
            theme="vs-dark"
            onChange={(newValue) => setBody(newValue)}
            language="html"

            options={{
              fontSize: 14,
              wordWrap: "on",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        <div className="button-group">
          <button className="save-button" onClick={handleSave}>
            Save Campaign
          </button>
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>

        {isPreviewOpen && (
          <div className="popup-overlay">
            <div className="popup-content">
              {/* Close icon at top-right */}
              <button
                className="close-popup-btn"
                onClick={() => setIsPreviewOpen(false)}
                aria-label="Close Preview"
              >
                <FaTimes />
              </button>
              <h3>Email Preview</h3>
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
      </div>
    </div>
  );
}
