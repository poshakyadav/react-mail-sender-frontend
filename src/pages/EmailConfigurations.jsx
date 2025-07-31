import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaRegEye,
  FaRegEyeSlash,
  FaTrash,
} from "react-icons/fa";
import EmailService from "../services/EmailService";
import "../assets/css/emailConfigurations.css";
import { FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";


const EmailConfigurations = () => {
  const [configurations, setConfigurations] = useState([]);
  const [activeConfig, setActiveConfig] = useState(null);
  const [error, setError] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});

  const [showDeleteModal, setShowDeleteModal] = useState(null);

  // -------
  // const [autoSwitch, setAutoSwitch] = useState(false);
  const [userSettings, setUserSettings] = useState({
    autoSwitchEnabled: false,
    resetStrategy: "LAST_RESET_DATE",
    timezone: "UTC",
  });

 // const [userSettings, setUserSettings] = useState(null); //---------

  const toggleAutoSwitch = async () => {
    try {
      const token = localStorage.getItem("token");
      const newSettings = {
        ...userSettings,
        autoSwitchEnabled: !userSettings.autoSwitchEnabled,
      };
      // await EmailService.updateUserSettings(token, { autoSwitch: !autoSwitch });
      await EmailService.updateUserSettings(token, newSettings);
      // setAutoSwitch(!autoSwitch);
      setUserSettings(newSettings);
    } catch (err) {
      console.error("Error updating settings:", err);
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        const settings = await EmailService.getUserSettings(token);
        setUserSettings(settings);
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };
    loadSettings();
  }, []);

  const handleSettingsChange = async (newSettings) => {
    try {
      console.log("Setting Change : "+newSettings.resetStrategy);
      console.log(newSettings);
      const token = localStorage.getItem("token");
      await EmailService.updateUserSettings(token, newSettings);
      setUserSettings(newSettings);
    } catch (err) {
      console.error("Error updating settings:", err);
    }
  };

  // --------
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [configs, active] = await Promise.all([
        EmailService.getAllEmailConfigurations(token),
        EmailService.getActiveEmailConfiguration(token),
      ]);
      setConfigurations(configs);
      setActiveConfig(active);
    } catch (err) {
      setError("Failed to load configurations");
    }
  };

  const handleActivate = async (configId) => {
    try {
      const token = localStorage.getItem("token");
      await EmailService.activateEmailConfiguration(configId, token);
      await fetchData();
      setError(null);
    } catch (err) {
      setError("Failed to activate configuration");
    }
  };

  const togglePasswordVisibility = (configId) => {
    setShowPasswords((prev) => ({
      ...prev,
      [configId]: !prev[configId],
    }));
  };

  const handleDelete = async (configId) => {
    try {
      const token = localStorage.getItem("token");
      await EmailService.deleteEmailConfiguration(configId, token);

      // If deleted config was active, clear active config
      if (activeConfig?.id === configId) {
        setActiveConfig(null);
      }

      await fetchData();
      setShowDeleteModal(null);
    } catch (err) {
      setError("Failed to delete configuration");
    }
  };

  const DeleteConfirmationModal = ({ configId }) => (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h4>Confirm Delete</h4>
        <p>Are you sure you want to delete this email configuration?</p>
        <div className="modal-actions">
          <button
            className="confirm-cancel-btn"
            onClick={() => setShowDeleteModal(null)}
          >
            Cancel
          </button>
          <button
            className="confirm-delete-btn"
            onClick={() => handleDelete(configId)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="dashboard-title page-overview-title">
        <FiMail className="dashboard-icon" style={{ color: "#7c3aed" }} /> Manage Mails
      </h1>

      <div className="configurations-container">
        <h2 className="configurations-header">
          Manage Your Email Configurations
        </h2>

        {error && <p className="error-message">{error}</p>}

        <div className="active-config">
          <h3>Active Configuration</h3>
          {activeConfig ? (
            <div className="config-item active-conf-item">
              <div className="config-info">
                <p>
                  <strong>{activeConfig.email}</strong>
                </p>

                <div className="password-field">
                  <input
                    type={showPasswords[activeConfig.id] ? "text" : "password"}
                    value={activeConfig.appPassword}
                    readOnly
                    disabled
                    style={{ border: "none", background: "transparent" }}
                  />
                  <span
                    onClick={() => togglePasswordVisibility(activeConfig.id)}
                    className="toggle-password"
                  >
                    {showPasswords[activeConfig.id] ? (
                      <FaRegEyeSlash />
                    ) : (
                      <FaRegEye />
                    )}
                  </span>
                </div>
              </div>
              <span className="top-active-badge">
                <FaCheckCircle /> Active
              </span>
            </div>
          ) : (
            <p className="noactive-config-msg">
              No active configuration selected
            </p>
          )}
        </div>

        {/*  */}
        {/* Settings section */}
        <div className="settings-section">
          <div className="auto-switch-container">
            <span>Auto-Switch Enabled</span>
            <div
              className={`toggle-switch ${
                userSettings.autoSwitchEnabled ? "active" : ""
              }`}
              onClick={toggleAutoSwitch}
            >
              <div className="slider" />
            </div>
          </div>

          <div className="reset-strategy-container">
            <h4>Reset Strategy</h4>
            <div className="strategy-option">
              <span>UTC Midnight Reset</span>
              <div
                className={`toggle-switch ${
                  userSettings.resetStrategy === "UTC_MIDNIGHT" ? "active" : ""
                }`}
                onClick={() =>
                  handleSettingsChange({
                    ...userSettings,
                    resetStrategy: "UTC_MIDNIGHT",
                    utcResetEnabled: true,
                  })
                }
              >
                <div className="slider" />
              </div>
            </div>

            <div className="strategy-option">
              <span>24h From Last Reset</span>
              <div
                className={`toggle-switch ${
                  userSettings.resetStrategy === "LAST_RESET_DATE"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleSettingsChange({
                    ...userSettings,
                    resetStrategy: "LAST_RESET_DATE",
                    utcResetEnabled: false, 
                  })
                }
              >
                <div className="slider" />
              </div>
            </div>
          </div>

          {/* <div className="timezone-container">
            <h4>Select Timezone</h4>
            <TimezoneSelector
              selectedZone={userSettings.timezone}
              onChange={(tz) =>
                handleSettingsChange({ ...userSettings, timezone: tz })
              }
            />
          </div> */}


        </div>

        {/*  */}
        <div className="config-list">
          <h3>All Configurations</h3>
          {configurations.map((config) => (
            <div key={config.id} className="config-item">
              <div className="config-info">
                <p>
                  <strong>{config.email}</strong>
                </p>

                {/* Wrap password + delete button in a flex container */}
                <div className="password-and-delete">
                  <div className="password-field">
                    <input
                      type={showPasswords[config.id] ? "text" : "password"}
                      value={config.appPassword}
                      readOnly
                      disabled
                      style={{ border: "none", background: "transparent" }}
                    />
                    <span
                      onClick={() => togglePasswordVisibility(config.id)}
                      className="toggle-password"
                    >
                      {showPasswords[config.id] ? (
                        <FaRegEyeSlash />
                      ) : (
                        <FaRegEye />
                      )}
                    </span>
                  </div>

                  {/* DELETE BUTTON MOVED HERE */}
                  <button
                    className="delete-btn"
                    onClick={() => setShowDeleteModal(config.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="config-status">

                {activeConfig?.id === config.id ? (
                  <span className="active-badge config-btnn">
                    <FaCheckCircle /> Active
                  </span>
                ) : (
                  <button
                    className="activate-btn config-btnn"
                    onClick={() => handleActivate(config.id)}
                  >
                    Activate
                  </button>
                )}
              </div>
            </div>
          ))}

          {showDeleteModal && (
            <DeleteConfirmationModal configId={showDeleteModal} />
          )}
        </div>

        <div className="add-config-btn-parent">
          {/* Add Configuration button */}
          <Link to={"/add-configuration"} className="add-config-btn">
            + Add More Configurations
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmailConfigurations;
