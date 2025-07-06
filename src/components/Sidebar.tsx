import React from 'react';
import { Activity, Database, BarChart3, BookOpen, X } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, toggleSidebar }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'blocks', label: 'Blocks', icon: Database },
    { id: 'metrics', label: 'Metrics', icon: BarChart3 },
    { id: 'documentation', label: 'Documentation', icon: BookOpen },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            <Activity className="sidebar-logo" />
            <span>EcoBlock</span>
          </div>
          <button 
            className="sidebar-close"
            onClick={toggleSidebar}
          >
            <X />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  if (window.innerWidth < 768) {
                    toggleSidebar();
                  }
                }}
                className={`sidebar-item ${activeView === item.id ? 'sidebar-item-active' : ''}`}
              >
                <IconComponent className="sidebar-icon" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="sidebar-footer">
          <div className="sidebar-version">
            <span>Version 1.0.0</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
