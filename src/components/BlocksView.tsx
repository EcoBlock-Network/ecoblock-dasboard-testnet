import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Block, SensorData } from '../types/api';
import { blockApi } from '../services/api';

const BlocksView: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  // Format blocks data for charts
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
        console.error('Blocks fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
    
    // Set up polling for new blocks
    const interval = setInterval(fetchBlocks, 10000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading blocks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <span className="text-red-800">Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Sensor Data Blocks</h1>
        <p className="text-green-100">Environmental sensor readings stored in the EcoBlock network</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <h3 className="text-lg font-semibold text-gray-700">Total Blocks</h3>
          <p className="text-3xl font-bold text-blue-600">{blocks.length}</p>
        </div>
        <div className="stat-card">
          <h3 className="text-lg font-semibold text-gray-700">Avg PM2.5</h3>
          <p className="text-3xl font-bold text-green-600">
            {blocks.length > 0 ? (blocks.reduce((sum, b) => sum + b.sensor_data.pm25, 0) / blocks.length).toFixed(1) : 0}
          </p>
        </div>
        <div className="stat-card">
          <h3 className="text-lg font-semibold text-gray-700">Avg CO2</h3>
          <p className="text-3xl font-bold text-orange-600">
            {blocks.length > 0 ? (blocks.reduce((sum, b) => sum + b.sensor_data.co2, 0) / blocks.length).toFixed(0) : 0}
          </p>
        </div>
        <div className="stat-card">
          <h3 className="text-lg font-semibold text-gray-700">Avg Temp</h3>
          <p className="text-3xl font-bold text-red-600">
            {blocks.length > 0 ? (blocks.reduce((sum, b) => sum + b.sensor_data.temperature, 0) / blocks.length).toFixed(1) : 0}°C
          </p>
        </div>
      </div>

      {/* Charts */}
      {blocks.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Air Quality Trends</h3>
            </div>
            <div className="card-body">
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

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Environmental Conditions</h3>
            </div>
            <div className="card-body">
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

      {/* Blocks List */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">Recent Blocks</h3>
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hash
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PM2.5
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CO2
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temperature
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Humidity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blocks.map((block) => (
                  <tr key={block.hash}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {block.hash.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(block.timestamp * 1000).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {block.sensor_data.pm25.toFixed(1)} µg/m³
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {block.sensor_data.co2.toFixed(0)} ppm
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {block.sensor_data.temperature.toFixed(1)}°C
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {block.sensor_data.humidity.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => setSelectedBlock(block)}
                        className="text-blue-600 hover:text-blue-900"
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

      {/* Block Details Modal */}
      {selectedBlock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Block Details</h2>
                <button
                  onClick={() => setSelectedBlock(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hash</label>
                  <p className="mt-1 text-sm font-mono text-gray-900 break-all">{selectedBlock.hash}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Parent Hashes</label>
                  <p className="mt-1 text-sm font-mono text-gray-900 break-all">
                    {selectedBlock.parent_hashes && selectedBlock.parent_hashes.length > 0 
                      ? selectedBlock.parent_hashes.join(', ') 
                      : 'Genesis block'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedBlock.timestamp * 1000).toLocaleString()}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sensor Data</label>
                  <div className="mt-1 bg-gray-50 rounded-md p-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium">PM2.5:</span>
                        <span className="ml-2 text-sm">{selectedBlock.sensor_data.pm25.toFixed(1)} µg/m³</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">CO2:</span>
                        <span className="ml-2 text-sm">{selectedBlock.sensor_data.co2.toFixed(0)} ppm</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Temperature:</span>
                        <span className="ml-2 text-sm">{selectedBlock.sensor_data.temperature.toFixed(1)}°C</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Humidity:</span>
                        <span className="ml-2 text-sm">{selectedBlock.sensor_data.humidity.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Signature</label>
                  <p className="mt-1 text-sm font-mono text-gray-900 break-all">{selectedBlock.signature}</p>
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
