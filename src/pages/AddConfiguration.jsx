import React, { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import EmailService from "../services/EmailService";
import "../assets/css/addConfiguration.css";
import { FiSettings } from "react-icons/fi";
import { Link } from "react-router-dom";
import { PiSealCheckFill } from "react-icons/pi";

function AddConfiguration() {
  const [config, setConfig] = useState({ email: "", appPassword: "" });
  const [configurations, setConfigurations] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const [activeConfig, setActiveConfig] = useState(null);

  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      const token = localStorage.getItem("token");
      const [configs, active] = await Promise.all([
        EmailService.getAllEmailConfigurations(token),
        EmailService.getActiveEmailConfiguration(token),
      ]);
      setConfigurations(configs);
      setActiveConfig(active);
    } catch (err) {
      setError("Failed to fetch configurations");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await EmailService.addEmailConfiguration(config, token);
      setConfig({ email: "", appPassword: "" });
      await fetchConfigurations();
      setError(null);
      setSuccess("Configuration added successfully!");
    } catch (err) {
      setError("Failed to add configuration. Please check your credentials.");
      setSuccess(null);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // This useEffect to auto-hide messages
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [success, error]);

  const SuccessAlert = () => (
    <div className="alert success-alert">
      <FaCheckCircle className="alert-icon" />
      <span>{success}</span>
      <button onClick={() => setSuccess(null)} className="alert-close">
        &times;
      </button>
    </div>
  );

  const ErrorAlert = () => (
    <div className="alert error-alert">
      <FaExclamationTriangle className="alert-icon" />
      <span>{error}</span>
      <button onClick={() => setError(null)} className="alert-close">
        &times;
      </button>
    </div>
  );

  return (
    <div>
      <h1 className="dashboard-title page-overview-title">
        <FiSettings className="dashboard-icon" style={{ color: "#7c3aed" }} />
        Configure Mails
      </h1>
      <div className="config-container">
        {/* <div className="activation-prompt">
          <Link to="/mail-activate" className="activation-link">
            🚀 Manage or activate your email configurations here
          </Link>
        </div> */}

        {/* Add alerts here */}
        {success && <SuccessAlert />}
        {error && <ErrorAlert />}

        <form onSubmit={handleSubmit} className="config-form">
          <div className="form-group">
            <label>Gmail Address:</label>
            <input
              type="email"
              name="email"
              value={config.email}
              onChange={handleChange}
              placeholder="your.email@gmail.com"
              required
            />
          </div>

          <div className="form-group">
            <label>App Password:</label>
            <div className="adc-password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="appPassword"
                value={config.appPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <span
                onClick={togglePasswordVisibility}
                className="toggle-password"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* {error && <p className="error-message">{error}</p>} */}

          <button type="submit" className="submit-btn">
            Add Configuration
          </button>
        </form>

        {configurations.length > 0 && (
          <div className="config-list">
            <div className="activation-prompt">
              <Link to="/mail-activate" className="activation-link">
                🚀 Manage or activate your email configurations here
              </Link>
            </div>

            <h3>Configured Accounts</h3>
            {configurations.map((config) => (
              <div key={config.id} className="config-card">
                <div className="add-config-info">
                  <p className="email-with-status">
                    <strong>Email:</strong> {config.email}
                    {activeConfig?.id === config.id && (
                      <PiSealCheckFill className="active-indicator" />
                    )}
                  </p>
                  <div className="password-field">
                    <input
                      type="password"
                      value={config.appPassword}
                      readOnly
                      disabled
                      style={{ border: "none", background: "transparent" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddConfiguration;
