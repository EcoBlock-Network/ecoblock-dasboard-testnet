import React, { useState, useEffect } from 'react';
import { Activity, Wifi, Server, Database, AlertTriangle, Play, Pause, Network, BarChart3 } from 'lucide-react';
import { NetworkStats, HealthStatus } from '../types/api';
import { networkApi, healthApi } from '../services/api';

const Dashboard: React.FC = () => {
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  const loadDemoData = () => {
    setNetworkStats({
      info: {
        node_id: "demo-node-12345",
        peer_count: 3,
        block_count: 42,
        uptime: 3665,
        status: "active",
        version: "0.1.0",
        network_type: "testnet"
      },
      peers: [
        {
          id: "peer-001",
          address: "192.168.1.100:8080",
          connected_at: new Date().toISOString(),
          last_seen: new Date().toISOString(),
          status: "connected"
        },
        {
          id: "peer-002", 
          address: "192.168.1.101:8080",
          connected_at: new Date(Date.now() - 60000).toISOString(),
          last_seen: new Date().toISOString(),
          status: "connected"
        }
      ],
      metrics: {
        total_blocks: 42,
        blocks_per_minute: 2.5,
        average_latency: 45.2,
        network_health: 0.95,
        active_peers: 3,
        total_peers: 3,
        active_connections: 3,
        messages_sent: 156,
        messages_received: 143,
        bytes_sent: 12480,
        bytes_received: 11520
      }
    });
    
    setHealth({
      status: "healthy",
      version: "0.1.0",
      uptime: 3665,
      timestamp: new Date().toISOString()
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (demoMode) {
        return;
      }
      
      try {
        setLoading(true);
        const [statsData, healthData] = await Promise.all([
          networkApi.getStats(),
          healthApi.getHealth(),
        ]);
        setNetworkStats(statsData);
        setHealth(healthData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        
        if (err instanceof Error && err.message.includes('ECONNREFUSED')) {
          setDemoMode(true);
          loadDemoData();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    const interval = setInterval(() => {
      if (!demoMode) {
        fetchData();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [demoMode]);

  if (loading) {
    return (
      <div className="loading">
        <div className="eco-card-glass">
          <div className="loading-spinner"></div>
          <div className="status-indicator">
            <Activity className="header-icon" />
            <span>Loading network data...</span>
          </div>
          <div className="network-info-label">Connecting to EcoBlock network</div>
        </div>
      </div>
    );
  }

  if (error && !demoMode) {
    return (
      <div className="dashboard-container">
        <div className="eco-card error">
          <div className="status-indicator error">
            <AlertTriangle className="error-icon" />
            <span className="error-message">Connection Error: {error}</span>
          </div>
        </div>
        
        {error.includes('ECONNREFUSED') && (
          <div className="eco-card">
            <div className="eco-card-header">
              <div className="eco-card-title">
                <AlertTriangle />
                <h3>API Server Not Started</h3>
              </div>
            </div>
            <div className="network-info">
              <p className="network-info-label">
                The EcoBlock API server is not running. To start it, run the following command in a terminal:
              </p>
              <div className="error-details">
                cd /Users/malohenry/Projects/EcoBlock/libs/ecoblock-demo<br/>
                cargo run -- node --tcp-port 9001 --udp-port 9002 --api-port 9000
              </div>
              <p className="network-info-label">
                The server should start on port 9000 and this dashboard will automatically connect once it's running.
              </p>
              <div className="header-controls">
                <button
                  onClick={() => {
                    setDemoMode(true);
                    setError(null);
                    loadDemoData();
                  }}
                  className="status-indicator online"
                >
                  <Play />
                  <span>Try Demo Mode</span>
                </button>
                <button
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                    setDemoMode(false);
                  }}
                  className="status-indicator offline"
                >
                  <Activity />
                  <span>Retry Connection</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <Activity className="header-icon" />
            <div>
              <h1>EcoBlock Network</h1>
              <p className="network-info-label">Real-time monitoring of decentralized sensor network</p>
            </div>
          </div>
          <div className="header-controls">
            <button
              onClick={() => {
                if (demoMode) {
                  setDemoMode(false);
                  setError(null);
                  setLoading(true);
                } else {
                  setDemoMode(true);
                  setError(null);
                  loadDemoData();
                }
              }}
              className="status-indicator"
            >
              {demoMode ? (
                <>
                  <Play />
                  <span>Live Data</span>
                </>
              ) : (
                <>
                  <Pause />
                  <span>Demo Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
        {demoMode && (
          <div className="demo-toggle">
            <div className="status-indicator online">
              <Play />
              <p>
                <strong>Demo Mode</strong> - Showing example data. Start the API server to see real-time data.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="stats-grid">
        <EcoStatusCard
          title="Network Health"
          value={health?.status || 'unknown'}
          icon={<Activity />}
          color={health?.status === 'healthy' ? 'mint' : 'red'}
        />
        <EcoStatusCard
          title="Connected Peers"
          value={networkStats?.metrics?.active_connections || 0}
          icon={<Wifi />}
          color="sage"
        />
        <EcoStatusCard
          title="Total Peers"
          value={networkStats?.metrics?.total_peers || 0}
          icon={<Server />}
          color="forest"
        />
        <EcoStatusCard
          title="Messages Sent"
          value={networkStats?.metrics?.messages_sent || 0}
          icon={<Database />}
          color="stone"
        />
      </div>

      {networkStats && (
        <div className="content-grid">
          <div className="eco-card">
            <div className="eco-card-header">
              <div className="eco-card-title">
                <Network />
                <h3>Network Information</h3>
              </div>
            </div>
            <div className="network-info">
              <div className="network-info-item">
                <span className="network-info-label">Node ID:</span>
                <span className="network-info-value">
                  {networkStats?.info?.node_id || 'Unknown'}
                </span>
              </div>
              <div className="network-info-item">
                <span className="network-info-label">Uptime:</span>
                <span className="network-info-value">
                  {formatDuration(networkStats?.info?.uptime || 0)}
                </span>
              </div>
              <div className="network-info-item">
                <span className="network-info-label">Version:</span>
                <span className="network-info-value">
                  {networkStats?.info?.version || 'Unknown'}
                </span>
              </div>
              <div className="network-info-item">
                <span className="network-info-label">Network Type:</span>
                <span className="network-info-value">
                  {networkStats?.info?.network_type || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          <div className="eco-card">
            <div className="eco-card-header">
              <div className="eco-card-title">
                <BarChart3 />
                <h3>Network Metrics</h3>
              </div>
            </div>
            <div className="network-info">
              <div className="network-info-item">
                <span className="network-info-label">Messages Received:</span>
                <span className="network-info-value">
                  {networkStats?.metrics?.messages_received || 0}
                </span>
              </div>
              <div className="network-info-item">
                <span className="network-info-label">Data Sent:</span>
                <span className="network-info-value">
                  {formatBytes(networkStats?.metrics?.bytes_sent || 0)}
                </span>
              </div>
              <div className="network-info-item">
                <span className="network-info-label">Data Received:</span>
                <span className="network-info-value">
                  {formatBytes(networkStats?.metrics?.bytes_received || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {networkStats && networkStats.peers && networkStats.peers.length > 0 && (
        <div className="eco-card">
          <div className="eco-card-header">
            <div className="eco-card-title">
              <Wifi />
              <h3>Connected Peers</h3>
              {demoMode && (
                <span className="status-indicator online">
                  Demo Data
                </span>
              )}
            </div>
          </div>
          <div className="peer-list">
            {networkStats.peers.map((peer) => (
              <div key={peer.id} className="peer-item">
                <div className="peer-info">
                  <div className="peer-id">{peer.id}</div>
                  <div className="peer-address">{peer.address}</div>
                </div>
                <div className={`peer-status ${peer.status === 'connected' ? 'connected' : 'disconnected'}`}>
                  <div className="peer-status-dot"></div>
                  <span>{peer.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface EcoStatusCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'mint' | 'sage' | 'forest' | 'stone' | 'red';
}

const EcoStatusCard: React.FC<EcoStatusCardProps> = ({ title, value, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-card-title">{title}</div>
        <div className="stat-card-icon">
          {icon}
        </div>
      </div>
      <div className="stat-card-value">{value}</div>
    </div>
  );
};

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default Dashboard;
