import React from 'react';
import { Activity, Menu, Wifi, WifiOff, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  activeView: string;
  toggleSidebar: () => void;
  connectionStatus: 'online' | 'offline' | 'error';
  demoMode: boolean;
  toggleDemoMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeView, 
  toggleSidebar, 
  connectionStatus, 
  demoMode, 
  toggleDemoMode 
}) => {
  const getViewTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Network Dashboard';
      case 'blocks':
        return 'Block Explorer';
      case 'metrics':
        return 'Network Metrics';
      case 'documentation':
        return 'Documentation';
      default:
        return 'EcoBlock Network';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'online':
        return <Wifi className="status-icon-online" />;
      case 'offline':
        return <WifiOff className="status-icon-offline" />;
      case 'error':
        return <AlertTriangle className="status-icon-error" />;
      default:
        return <WifiOff className="status-icon-offline" />;
    }
  };

  const getStatusText = () => {
    if (demoMode) return 'Demo Mode';
    switch (connectionStatus) {
      case 'online':
        return 'Connected';
      case 'offline':
        return 'Offline';
      case 'error':
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button 
          className="mobile-menu-btn"
          onClick={toggleSidebar}
        >
          <Menu />
        </button>
        
        <div className="header-title-section">
          <Activity className="header-logo" />
          <div>
            <h1 className="header-main-title">EcoBlock</h1>
            <p className="header-subtitle">{getViewTitle()}</p>
          </div>
        </div>
      </div>
      
      <div className="header-right">
        <div className="header-controls">
          <button
            onClick={toggleDemoMode}
            className={`demo-mode-btn ${demoMode ? 'demo-mode-active' : ''}`}
          >
            {demoMode ? 'Exit Demo' : 'Demo Mode'}
          </button>
          
          <div className={`connection-status connection-status-${connectionStatus} ${demoMode ? 'connection-status-demo' : ''}`}>
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
