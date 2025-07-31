import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import "../assets/css/historyCampaigns.css";
import Tooltip from "../components/Tooltip";
import DeleteCampaignModal from "../components/DeleteCampaignModal";

export default function HistoryCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [expandedCampaigns, setExpandedCampaigns] = useState(new Set());
  const navigate = useNavigate();

  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("/api/mail/sent-campaigns", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCampaigns(response.data);
      } catch (error) {
        console.error("Error fetching campaigns", error);
      }
    };

    fetchCampaigns();
  }, []);

  const handleResend = async (campaignId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(`/api/mail/resend/${campaignId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Campaign is being resent");
    } catch (error) {
      console.error("Error resending campaign", error);
    }
  };

  const handleDeleteClick = (campaign) => {
    setCampaignToDelete(campaign);
    setDeleteModalShow(true);
  };

  const handleDeleteConfirm = async (deleteRecipientList) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `/api/mail/delete-campaign/${campaignToDelete.id}?deleteRecipientList=${deleteRecipientList}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Campaign deleted successfully!");
      setCampaigns(campaigns.filter((c) => c.id !== campaignToDelete.id));
      setDeleteModalShow(false);
      setCampaignToDelete(null);
    } catch (error) {
      console.error("Error deleting campaign", error);
      alert(error.response?.data || "Error deleting campaign");
    }
  };

  const handleModalClose = () => {
    setDeleteModalShow(false);
    setCampaignToDelete(null);
  };

  // const handleDelete = async (campaignId) => {
  //   const token = localStorage.getItem("token");
  //   if (!window.confirm("Are you sure you want to delete this campaign?"))
  //     return;

  //   try {
  //     await axios.delete(`/api/mail/delete-campaign/${campaignId}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     alert("Campaign deleted successfully!");
  //     setCampaigns(campaigns.filter((campaign) => campaign.id !== campaignId)); // Remove from UI
  //   } catch (error) {
  //     console.error("Error deleting campaign", error);
  //   }
  // };

  const handleEdit = (campaignId) => {
    navigate(`/edit-campaign/${campaignId}`);
  };

  const toggleCampaign = (campaignId) => {
    setExpandedCampaigns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId);
      } else {
        newSet.add(campaignId);
      }
      return newSet;
    });
  };

  const CampaignRow = ({ campaign, depth = 0, serialNumber = [] }) => {
    const children = campaigns
      .filter((c) => c.parentCampaignId === campaign.id)
      .sort((a, b) => new Date(a.sendTime) - new Date(b.sendTime));

    const hasChildren = children.length > 0;

    const isExpanded = expandedCampaigns.has(campaign.id);
    const isScheduled = campaign.status === "SCHEDULED";

    return (
      <>
        <tr
          className={`campaign-row depth-${depth}`}
          style={{ "--depth": depth }}
        >
          <td className="fixed-column-td td-serial">
          <Tooltip text={serialNumber.join(".")} className="tooltip-target">
            <span className="serial-number">{serialNumber.join(".")}</span>
          </Tooltip>
            {/* {serialNumber.join(".")} */}
          </td>
          <td className="scrolable-subject-td td-subject">
            {/* {hasChildren && ( */}
              <button
                className="toggle-button"
                onClick={() => toggleCampaign(campaign.id)}
                disabled={!hasChildren} // Disable if no children
              >
                {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
              </button>
            {/* )} */}

            <span className={`subject ${isScheduled ? "scheduled" : ""}`}>
              {campaign.subject}
            </span>
          </td>

          <td className="fixed-column-td td-recipients-list">
            {campaign.recipientListName}
          </td>
          <td className="fixed-column-td td-total-recipients">
            {campaign.recipientCount}
            {/* {campaign.recipientList?.recipients?.length || 0} */}
          </td>
          <td className="fixed-column-td td-status">
            <span className={`status-badge ${campaign.status.toLowerCase()}`}>
              {campaign.status}
            </span>
          </td>
          <td className="fixed-column-td td-send-time">
            {isScheduled
              ? new Date(campaign.triggerDelay).toLocaleString()
              : new Date(campaign.sendTime).toLocaleString()}
          </td>
          <td className="fixed-column-td td-action">
            <div className="action-buttons">
              <button onClick={() => handleResend(campaign.id)} disabled={isScheduled} className={`resend-button ${isScheduled ? "disabled" : ""}`}>Resend</button>
              <button onClick={() => handleEdit(campaign.id)}>Edit</button>
              {/* <button onClick={() => handleDelete(campaign.id)}>Delete</button> */}
              <button onClick={() => handleDeleteClick(campaign)}>Delete</button>
              <button
                onClick={() => navigate(`/campaign-analytics/${campaign.id}`)}
              >
                Analytics
              </button>
            </div>
          </td>
          <td className="fixed-column-td td-follow-up">
            <button
              onClick={() => navigate(`/nested-campaign/${campaign.id}`)}
              className="follow-up-button"
            >
              Create Follow-up
            </button>
          </td>
        </tr>
        {isExpanded &&
          hasChildren &&
          children.map((child, index) => (
            <CampaignRow
              // key={childCampaign.id}
              // campaign={childCampaign}
              key={child.id}
              campaign={child}
              depth={depth + 1}
              serialNumber={[...serialNumber, index + 1]}
            />
          ))}
      </>
    );
  };

  // Separate parent and child campaigns
  const parentCampaigns = campaigns.filter((c) => !c.parentCampaignId);

  return (
    <div>
      <h1 className="page-overview-title">🚀 Manage Campaigns</h1>

      {parentCampaigns.length === 0 ? (
      <div className="no-data-message">
        <p>No campaigns found. Start by creating a new campaign!</p>
      </div>
    ) : (


      <div className="parent-campaigns-table-container">
        <div className="campaigns-table-container">
          <table className="campaigns-table">
            <thead>
              <tr className="campaign-table-headings">
              <th className="fixed-column-th th-serial">#</th>
                <th className="scrolable-subject-th th-subject">Subject</th>
                <th className="fixed-column-th th-recipients-list">
                  Recipients List
                </th>
                <th className="fixed-column-th th-total-recipients">
                  Total Recipients
                </th>
                <th className="fixed-column-th th-status">Status</th>
                <th className="fixed-column-th th-send-time">Send Time</th>
                <th className="fixed-column-th th-action">Action</th>
                <th className="fixed-column-th th-follow-up">Follow Up</th>
              </tr>
            </thead>
            <tbody>
              {parentCampaigns.map((campaign, index) => (
                <CampaignRow
                  key={campaign.id}
                  campaign={campaign}
                  serialNumber={[index + 1]}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
     <DeleteCampaignModal
        show={deleteModalShow}
        campaignId={campaignToDelete ? campaignToDelete.id : null}
        onConfirm={handleDeleteConfirm}
        onClose={handleModalClose}
      />
    </div>
  );
}
