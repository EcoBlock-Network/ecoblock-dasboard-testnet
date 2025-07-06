import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BlocksView from './components/BlocksView';
import Documentation from './components/Documentation';
import { healthApi } from './services/api';
import './index.css';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'error'>('offline');
  const [demoMode, setDemoMode] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDemoMode = () => {
    setDemoMode(!demoMode);
  };

  const checkConnection = async () => {
    if (demoMode) {
      setConnectionStatus('online');
      return;
    }
    
    try {
      await healthApi.getHealth();
      setConnectionStatus('online');
    } catch (error) {
      setConnectionStatus('offline');
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 10000);
    return () => clearInterval(interval);
  }, [demoMode]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'blocks':
        return <BlocksView />;
      case 'metrics':
        return <div className="metrics-placeholder">Metrics view coming soon</div>;
      case 'documentation':
        return <Documentation />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      
      <div className="app-content">
        <Header
          activeView={activeView}
          toggleSidebar={toggleSidebar}
          connectionStatus={connectionStatus}
          demoMode={demoMode}
          toggleDemoMode={toggleDemoMode}
        />
        
        <main className="main-content">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default App;
