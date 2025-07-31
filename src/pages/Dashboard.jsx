import React, { useEffect, useState } from "react";
import EmailService from "../services/EmailService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FiMail,
  FiMousePointer,
  FiPieChart,
  FiSmartphone,
  FiUsers,
} from "react-icons/fi";
import "../assets/css/dashboard.css";
import { Link } from "react-router-dom";

// Color palette for device distribution chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function Dashboard() {
  const [activeConfig, setActiveConfig] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User is not authenticated.");
          return;
        }

        const [stats, config] = await Promise.all([
          EmailService.getDashboardAnalytics(token),
          EmailService.getActiveEmailConfiguration(token),
        ]);

        setDashboardStats(stats);
        setActiveConfig(config);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  // Data processing for visualizations
  const totalSent = dashboardStats?.totalSent || 0;
  // const deviceData = dashboardStats?.deviceDistribution || [];

  // Device data processing
  const deviceData = dashboardStats?.deviceDistribution?.length
    ? dashboardStats.deviceDistribution
    : [{ device: "No Data", count: 1 }]; // Fallback for empty data

  return (
    <div>
      <h1 className="dashboard-title page-overview-title">
        <FiPieChart className="dashboard-icon" /> Your Dashboard
      </h1>
      <div className="dashboard-container">
        {error && <div className="error-alert">{error}</div>}

        {/* Key Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card">
            <FiMail className="metric-icon" />
            <h3>Total Campaigns</h3>
            <p>{dashboardStats?.totalCampaigns}</p>
          </div>
          <div className="metric-card">
            <FiMousePointer className="metric-icon" />
            <h3>Total Clicks</h3>
            <p>{dashboardStats?.totalClicks}</p>
          </div>
          <div className="metric-card">
            <FiUsers className="metric-icon" />
            <h3>Total Sent</h3>
            <p>{totalSent}</p>
          </div>
          <div className="metric-card">
            <FiSmartphone className="metric-icon" />
            <h3>Avg. Click Rate</h3>
            <p>{dashboardStats?.avgClickRate?.toFixed(1)}%</p>
          </div>
        </div>

        {/* Main Visualization Section */}
        <div className="visualization-section">
          <div className="chart-card">
            <h3>Campaign Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={dashboardStats?.campaignPerformance}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis
                  dataKey="subject"
                  // angle={-45}
                  // textAnchor="end"
                  tick={{
                    textAnchor: "start",
                    angle: 0,
                    fontSize: 12,
                    // Truncate long labels
                    formatter: (subject) =>
                      subject.length > 20
                        ? `${subject.substring(0, 20)}...`
                        : subject,
                  }}
                  interval={0}
                  height={70} // More height for labels
                />
                <YAxis />
                <Tooltip />
                <Legend
                  verticalAlign="top"
                  wrapperStyle={{ paddingBottom: 20 }} // Space below legend
                />
                <Bar dataKey="totalSent" fill="#8884d8" name="Emails Sent" />
                <Bar dataKey="clicks" fill="#82ca9d" name="Total Clicks" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card device-distribution-chart">
            <h3>Device Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  dataKey="count"
                  nameKey="device"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ device, count }) => `${device}: ${count}`}
                >
                  {deviceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="recent-activity">
          <h3>Recent Campaigns</h3>
          <div className="activity-list">
            {dashboardStats?.campaignPerformance
              ?.slice(0, 5)
              .map((campaign, index) => {
                const clickRate =
                  campaign.totalSent > 0
                    ? (campaign.clicks / campaign.totalSent) * 100
                    : 0;

                return (
                  <div key={index} className="activity-item">
                    <div className="campaign-info">
                      <span className="campaign-subject">
                        {campaign.subject}
                      </span>
                      <span className="campaign-stats">
                        {campaign.clicks} clicks ({clickRate.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${clickRate}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Active Configuration Section */}
        <div className="dashboard-config-card">
          <h3>Active Email Configuration</h3>
          <div className="config-card-child">
            {activeConfig ? (
              <div className="config-details">
                <span className="config-email">{activeConfig.email}</span>
                <Link to="/mail-activate"  className="config-button">Change Configuration</Link>
              </div>
            ) : (
              <p>No active configuration found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
