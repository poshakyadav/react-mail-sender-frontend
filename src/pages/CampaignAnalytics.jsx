// src/pages/CampaignAnalytics.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import EmailService from '../services/EmailService';

const CampaignAnalytics = () => {
  const { campaignId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await EmailService.getCampaignAnalytics(campaignId, token);
        setAnalytics(response);
        setLoading(false);
      } catch (err) {
        setError('Failed to load analytics data');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [campaignId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="campaign-analytics">
      <h2>Analytics for Campaign: {analytics?.subject || 'N/A'}</h2>
      
      <div className="overview-stats">
        <div className="stat-box">
          <h3>Total Sent</h3>
          <p>{analytics.totalSent}</p>
        </div>

        <div className="stat-box">
          <h3>Opened</h3>
          <p>{analytics.opens} ({analytics.openRate}%)</p>
        </div>

        <div className="stat-box">
          <h3>Clicks</h3>
          <p>{analytics.clicks} ({analytics.clickRate}%)</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart">
          <h3>Opens Over Time</h3>
          {analytics?.opensOverTime?.length > 0 ? (
          <BarChart width={500} height={300} data={analytics.opensOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="opens" fill="#8884d8" />
          </BarChart>
           ) : (
            <p>No open data available</p>
          )}
        </div>

        <div className="chart">
          <h3>Top Clicked Links</h3>
          {analytics?.topLinks?.length > 0 ? (
          <ul className="link-list">
            {analytics.topLinks.map((link, index) => (
              <li key={index}>
                <a href={link.originalUrl} target="_blank" rel="noopener noreferrer">
                  {link.originalUrl}
                </a>
                <span>{link.clicks} clicks</span>
              </li>
            ))}
          </ul>
          ) : (
            <p>No click data available</p>
          )}
        </div>
      </div>

      <div className="device-stats">
        <h3>Device Breakdown</h3>
        {analytics?.deviceTypes?.length > 0 ? (
        <div className="device-chart">
          <BarChart width={400} height={300} data={analytics.deviceTypes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="device" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </div>
        ) : (
          <p>No device data available</p>
        )}
      </div>
    </div>
  );
};

export default CampaignAnalytics;