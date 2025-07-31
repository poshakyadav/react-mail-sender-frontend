import React, { useState, useEffect } from "react";
import EmailService from "../services/EmailService";
import "../assets/css/recipientTable.css";
import { FaCheckCircle, FaExclamationTriangle, FaTrash } from "react-icons/fa";
import { MdOutlineDoubleArrow } from "react-icons/md";
import { PiListPlusFill } from "react-icons/pi";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function RecipientTable() {
  const [recipients, setRecipients] = useState([]);
  const [newRecipient, setNewRecipient] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    company: "",
    position: "",
  });

  const { listId } = useParams(); // get the listId from the URL
  const navigate = useNavigate();
  const location = useLocation();
  const [recipientListName, setRecipientListName] = useState("");
  const token = localStorage.getItem("token");

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // State for delete confirmation modal
  const [recipientToDelete, setRecipientToDelete] = useState(null);

  useEffect(() => {
    // Get list name from navigation state or fetch from API
    if (location.state?.listName) {
      setRecipientListName(location.state.listName);
    } 
  }, [listId, location.state]);

  // Auto-dismiss messages
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(null);
      setError(null);
      setUploadSuccess(null);
      setUploadError(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [success, error, uploadSuccess, uploadError]);

  const SuccessAlert = ({ message }) => (
    <div className="alert success-alert">
      <FaCheckCircle className="alert-icon" />
      <span>{message}</span>
      <button onClick={() => setSuccess(null)} className="alert-close">
        &times;
      </button>
    </div>
  );

  const ErrorAlert = ({ message }) => (
    <div className="alert error-alert">
      <FaExclamationTriangle className="alert-icon" />
      <span>{message}</span>
      <button onClick={() => setError(null)} className="alert-close">
        &times;
      </button>
    </div>
  );

  useEffect(() => {
    loadRecipients();
  }, [listId]);

  const loadRecipients = async () => {
    if (!token) {
      alert("You are not authenticated. Please log in.");
      return;
    }
    try {
      const data = await EmailService.getRecipients(listId, token);
      setRecipients(data);
    } catch (err) {
      console.error("Error fetching recipients:", err);
    }
  };

  const handleAddRecipient = async () => {
    if (!newRecipient.email.trim()) {
      setError("Email cannot be empty");
      return;
    }

    try {
      // Only check duplicates within the same list
      const duplicate = recipients.some(
        (recipient) => recipient.email === newRecipient.email
      );

      if (duplicate) {
        setError("This email is already in the recipient list");
        return;
      }

      // Add the recipient
      await EmailService.addRecipient(listId, newRecipient, token);

      // Clear input and refresh recipient list
      setNewRecipient({
        email: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        company: "",
        position: "",
      });
      loadRecipients();
      setSuccess("Recipient added successfully!");
    } catch (err) {
      setError(err.message || "Failed to add recipient");
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // bulkUploadRecipients now returns a message based on the job outcome
      const response = await EmailService.bulkUploadRecipients(
        listId,
        formData,
        token
      );
      // Display the backend response message
      setUploadSuccess(response);
      await loadRecipients();
    } catch (err) {
      console.error("Bulk upload failed:", err);
      setUploadError(
        err.response?.data || "Bulk upload failed. Please check file format."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipient((prev) => ({ ...prev, [name]: value }));
  };


  // New function to confirm deletion (called when "Delete" button in modal is clicked)
  const confirmDelete = async () => {
    try {
      await EmailService.deleteRecipient(recipientToDelete, token);
      setSuccess("Recipient deleted successfully!");
      loadRecipients();
    } catch (err) {
      setError(err.message || "Failed to delete recipient");
    } finally {
      setRecipientToDelete(null);
    }
  };

  // Cancel deletion by simply closing the modal
  const cancelDelete = () => {
    setRecipientToDelete(null);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Helper function to truncate recipient list name
  const truncateText = (text, limit = 10) => {
    if (text.length > limit) {
      return text.slice(0, limit) + "...";
    }
    return text;
  };

  return (
    <div>
      <h1 className="dashboard-title page-overview-title">
        <PiListPlusFill
          className="dashboard-icon"
          style={{ color: "#2c3e50" }}
        />
        <span>{truncateText(recipientListName)}</span> List
      </h1>

      <div className="recipient-container">
        {/* Fixed alert container */}
        <div className="fixed-alert-container">
          {/* Alerts at the top */}
          {success && <SuccessAlert message={success} />}
          {error && <ErrorAlert message={error} />}
          {uploadSuccess && <SuccessAlert message={uploadSuccess} />}
          {uploadError && <ErrorAlert message={uploadError} />}
        </div>

        <div className="content-wrapper">
          <div className="add-recipient-section">
            <div className="back-button-section">
              <button className="back-button" onClick={handleBack}>
                <MdOutlineDoubleArrow className="back-icon" /> Back
              </button>
            </div>

            <div>
              <h3 className="recipient-card-heading">Add New Recipient</h3>
              <div className="input-grid">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Recipient Email *"
                  value={newRecipient.email}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={newRecipient.firstName}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={newRecipient.lastName}
                  onChange={handleInputChange}
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone (optional)"
                  value={newRecipient.phoneNumber}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company (optional)"
                  value={newRecipient.company}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="position"
                  placeholder="Position (optional)"
                  value={newRecipient.position}
                  onChange={handleInputChange}
                />
              </div>
              <button className="add-button" onClick={handleAddRecipient}>
                Add Recipient
              </button>
            </div>
          </div>

          <div className="bulk-upload-section">
            <h3 className="recipient-card-heading">Bulk Upload</h3>
            <div className="file-upload-wrapper">
              <input
                type="file"
                id="file-upload"
                accept=".csv,.xlsx"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <label htmlFor="file-upload" className="file-upload-label">
                {isUploading ? (
                  <>
                    <div className="spinner"></div>
                    Uploading...
                  </>
                ) : (
                  "Choose CSV File"
                )}
              </label>
              <span className="file-format-note">
                <span className="upload-note-tile">CSV format:</span>
                <span className="upload-note-desc">
                  email,firstName,lastName,phoneNumber,company,position
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="recipients-table-section">
          <h3 className="recipient-card-heading">
            Existing Recipients ({recipients.length})
          </h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Email</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Phone</th>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recipients.length > 0 ? (
                  recipients.map((recipient, index) => (
                    <tr key={recipient.id}>
                      <td>{index + 1}</td>
                      <td>{recipient.email}</td>
                      <td>{recipient.firstName || "-"}</td>
                      <td>{recipient.lastName || "-"}</td>
                      <td>{recipient.phoneNumber || "-"}</td>
                      <td>{recipient.company || "-"}</td>
                      <td>{recipient.position || "-"}</td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => setRecipientToDelete(recipient.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-records">
                      No recipients found. Add new recipients using the form
                      above or bulk upload the Recipients.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Custom delete confirmation modal */}
      {recipientToDelete && (
        <div className="recipient-table-delete-modal">
          <div className="recipient-table-modal-content">
            <h3 className="recipient-table-confirm-heading">Confirm Delete</h3>
            <p>Are you sure you want to delete this recipient?</p>
            <div className="recipient-table-modal-buttons">
              <button className="recipient-table-delete-btn" onClick={confirmDelete}>
                Delete
              </button>
              <button className="recipient-table-cancel-btn" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
