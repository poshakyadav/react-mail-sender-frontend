import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmailService from "../services/EmailService";
import "../assets/css/nestedCampaign.css";

const NestedCampaignComposer = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: "",
    body: "<p>Your follow-up email content here...</p>",
    condition: "CLICKED",
    // delayHours: 24,
    delayMinutes: 2,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await EmailService.createNestedCampaign(
        {
          parentCampaignId: campaignId,
          subject: formData.subject,
          body: formData.body,
          triggerCondition: formData.condition,
          // delayHours: formData.delayHours, // Send hours instead of datetime
          delayMinutes: formData.delayMinutes, // Send minutes instead of hours
        },
        token
      );
      alert("Nested campaign created successfully!");
      navigate("/history-campaigns");
    } catch (err) {
      console.error("Error creating nested campaign:", err);
      alert("Failed to create nested campaign");
    }
  };

  return (
    <div className="nested-composer">
      <h2>Create Follow-up Campaign</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Subject:</label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Email Body:</label>
          <textarea
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            rows={10}
            required
          />
        </div>

        <div className="form-group">
          <label>Trigger Condition:</label>
          <select
            value={formData.condition}
            onChange={(e) =>
              setFormData({ ...formData, condition: e.target.value })
            }
          >
            {/* <option value="OPENED">Opened Previous Email</option>
            <option value="NOT_OPENED">Didn't Open Previous Email</option> */}
            <option value="CLICKED">Clicked Links</option>
            <option value="NOT_CLICKED">Didn't Click Links</option>
          </select>
        </div>

        <div className="form-group">
          <label>Send After (hours):</label>
          <input
            type="number"
            // value={formData.delayHours}
            value={formData.delayMinutes}
            // onChange={(e) =>
            //   setFormData({ ...formData, delayHours: e.target.value })
            // }
            onChange={(e) =>
              setFormData({ ...formData, delayMinutes: e.target.value })
            }
            min="1"
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit">Create Follow-up</button>
        </div>
      </form>
    </div>
  );
};

export default NestedCampaignComposer;
