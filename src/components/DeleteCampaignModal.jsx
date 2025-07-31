import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/components.css";

const DeleteCampaignModal = ({ show, onClose, onConfirm, campaignId }) => {
    const [usageCount, setUsageCount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteRecipientList, setDeleteRecipientList] = useState(false);
    const token = localStorage.getItem("token");
  
    useEffect(() => {
      if (show && campaignId) {
        setLoading(true);
        axios
          .get(`/api/mail/campaign/${campaignId}/recipient-list-status`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setUsageCount(res.data.usageCount);
          })
          .catch((error) => {
            console.error("Error fetching recipient list status", error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }, [show, campaignId, token]);
  
    const handleConfirm = () => {
      onConfirm(deleteRecipientList);
    };
  
    if (!show) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          {loading ? (
            <div className="modal-loading">Loading...</div>
          ) : (
            <>
              <h2>Delete Campaign</h2>
              {usageCount > 1 ? (
                <p>
                  The recipient list for this campaign is used by {usageCount} campaigns and cannot be deleted automatically.
                  Only the campaign will be deleted.
                </p>
              ) : (
                <p>
                  This campaign is the only one using the associated recipient list. Would you like to delete the recipient list as well?
                </p>
              )}
              {usageCount <= 1 && (
                <div className="modal-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={deleteRecipientList}
                      onChange={(e) => setDeleteRecipientList(e.target.checked)}
                    />
                    Delete associated recipient list
                  </label>
                </div>
              )}
              <div className="modal-actions">
                <button className="modal-confirm" onClick={handleConfirm}>
                  Delete Campaign
                </button>
                <button className="modal-cancel" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default DeleteCampaignModal;