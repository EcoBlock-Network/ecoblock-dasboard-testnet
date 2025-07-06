import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Block } from '../types/api';
import { blockApi } from '../services/api';

const BlocksView: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  const chartData = blocks.map((block, index) => ({
    index: index + 1,
    pm25: block.sensor_data.pm25,
    co2: block.sensor_data.co2,
    temperature: block.sensor_data.temperature,
    humidity: block.sensor_data.humidity,
    timestamp: new Date(block.timestamp * 1000).toLocaleTimeString()
  }));

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        setLoading(true);
        const response = await blockApi.getBlocks(1, 50);
        setBlocks(response.blocks);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch blocks');
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
    
    const interval = setInterval(fetchBlocks, 10000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <span className="loading-text">Loading blocks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <span className="error-text">Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="blocks-container">
      <div className="blocks-header">
        <h1 className="blocks-title">Sensor Data Blocks</h1>
        <p className="blocks-subtitle">Environmental sensor readings stored in the EcoBlock network</p>
      </div>

      <div className="blocks-stats">
        <div className="stat-card">
          <h3 className="stat-title">Total Blocks</h3>
          <p className="stat-value stat-value-primary">{blocks.length}</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-title">Avg PM2.5</h3>
          <p className="stat-value stat-value-success">
            {blocks.length > 0 ? (blocks.reduce((sum, b) => sum + b.sensor_data.pm25, 0) / blocks.length).toFixed(1) : 0}
          </p>
        </div>
        <div className="stat-card">
          <h3 className="stat-title">Avg CO2</h3>
          <p className="stat-value stat-value-warning">
            {blocks.length > 0 ? (blocks.reduce((sum, b) => sum + b.sensor_data.co2, 0) / blocks.length).toFixed(0) : 0}
          </p>
        </div>
        <div className="stat-card">
          <h3 className="stat-title">Avg Temp</h3>
          <p className="stat-value stat-value-danger">
            {blocks.length > 0 ? (blocks.reduce((sum, b) => sum + b.sensor_data.temperature, 0) / blocks.length).toFixed(1) : 0}°C
          </p>
        </div>
      </div>

      {blocks.length > 0 && (
        <div className="blocks-charts">
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Air Quality Trends</h3>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pm25" stroke="#8884d8" name="PM2.5 (µg/m³)" />
                  <Line type="monotone" dataKey="co2" stroke="#82ca9d" name="CO2 (ppm)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Environmental Conditions</h3>
            </div>
            <div className="chart-body">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature (°C)" />
                  <Line type="monotone" dataKey="humidity" stroke="#00bcd4" name="Humidity (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <div className="blocks-table-container">
        <div className="blocks-table-header">
          <h3 className="blocks-table-title">Recent Blocks</h3>
        </div>
        <div className="blocks-table-body">
          <div className="table-wrapper">
            <table className="blocks-table">
              <thead className="blocks-table-head">
                <tr>
                  <th className="blocks-table-header-cell">Hash</th>
                  <th className="blocks-table-header-cell">Timestamp</th>
                  <th className="blocks-table-header-cell">PM2.5</th>
                  <th className="blocks-table-header-cell">CO2</th>
                  <th className="blocks-table-header-cell">Temperature</th>
                  <th className="blocks-table-header-cell">Humidity</th>
                  <th className="blocks-table-header-cell">Actions</th>
                </tr>
              </thead>
              <tbody className="blocks-table-body">
                {blocks.map((block) => (
                  <tr key={block.hash} className="blocks-table-row">
                    <td className="blocks-table-cell blocks-table-cell-hash">
                      {block.hash.substring(0, 8)}...
                    </td>
                    <td className="blocks-table-cell">
                      {new Date(block.timestamp * 1000).toLocaleString()}
                    </td>
                    <td className="blocks-table-cell">
                      {block.sensor_data.pm25.toFixed(1)} µg/m³
                    </td>
                    <td className="blocks-table-cell">
                      {block.sensor_data.co2.toFixed(0)} ppm
                    </td>
                    <td className="blocks-table-cell">
                      {block.sensor_data.temperature.toFixed(1)}°C
                    </td>
                    <td className="blocks-table-cell">
                      {block.sensor_data.humidity.toFixed(1)}%
                    </td>
                    <td className="blocks-table-cell">
                      <button
                        onClick={() => setSelectedBlock(block)}
                        className="view-details-btn"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedBlock && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-body">
              <div className="modal-header">
                <h2 className="modal-title">Block Details</h2>
                <button
                  onClick={() => setSelectedBlock(null)}
                  className="modal-close"
                >
                  <span className="sr-only">Close</span>
                  <svg className="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="modal-details">
                <div className="detail-item">
                  <label className="detail-label">Hash</label>
                  <p className="detail-value detail-value-hash">{selectedBlock.hash}</p>
                </div>
                
                <div className="detail-item">
                  <label className="detail-label">Parent Hashes</label>
                  <p className="detail-value detail-value-hash">
                    {selectedBlock.parent_hashes && selectedBlock.parent_hashes.length > 0 
                      ? selectedBlock.parent_hashes.join(', ') 
                      : 'Genesis block'}
                  </p>
                </div>
                
                <div className="detail-item">
                  <label className="detail-label">Timestamp</label>
                  <p className="detail-value">{new Date(selectedBlock.timestamp * 1000).toLocaleString()}</p>
                </div>
                
                <div className="detail-item">
                  <label className="detail-label">Sensor Data</label>
                  <div className="sensor-data-grid">
                    <div className="sensor-data-item">
                      <span className="sensor-label">PM2.5:</span>
                      <span className="sensor-value">{selectedBlock.sensor_data.pm25.toFixed(1)} µg/m³</span>
                    </div>
                    <div className="sensor-data-item">
                      <span className="sensor-label">CO2:</span>
                      <span className="sensor-value">{selectedBlock.sensor_data.co2.toFixed(0)} ppm</span>
                    </div>
                    <div className="sensor-data-item">
                      <span className="sensor-label">Temperature:</span>
                      <span className="sensor-value">{selectedBlock.sensor_data.temperature.toFixed(1)}°C</span>
                    </div>
                    <div className="sensor-data-item">
                      <span className="sensor-label">Humidity:</span>
                      <span className="sensor-value">{selectedBlock.sensor_data.humidity.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-item">
                  <label className="detail-label">Signature</label>
                  <p className="detail-value detail-value-hash">{selectedBlock.signature}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlocksView;
