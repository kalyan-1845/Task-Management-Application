import React, { useState } from 'react';
import { Search, Plus, Bell, RefreshCw, Smartphone, Laptop, Menu } from 'lucide-react';

export default function TopBar({ 
  searchQuery, 
  onSearchChange, 
  sseStatus, 
  onAddTaskClick, 
  onToggleSidebar, 
  user 
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const mockNotifications = [
    { id: 1, text: 'Real-time Vortex engine synced.', time: 'Just now' },
    { id: 2, text: 'Alex Carter added a comment to a task.', time: '2 hours ago' },
    { id: 3, text: 'Your workspace was successfully initialized.', time: '4 hours ago' }
  ];

  return (
    <header style={styles.header}>
      {/* Mobile Sidebar Toggle */}
      <button style={styles.mobileMenuBtn} onClick={onToggleSidebar}>
        <Menu size={20} />
      </button>

      {/* Search Input */}
      <div style={styles.searchWrapper}>
        <Search size={18} style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search task titles, descriptions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={styles.searchInput}
          className="glass-input"
        />
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        {/* SSE Live Status Tracker */}
        <div 
          style={{
            ...styles.sseWrapper,
            borderColor: sseStatus === 'connected' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'
          }}
          title={sseStatus === 'connected' ? 'Connected to live database' : 'Reconnecting to database...'}
        >
          <div 
            className={sseStatus === 'connected' ? 'pulse-indicator' : ''} 
            style={{ 
              ...styles.statusDot, 
              backgroundColor: sseStatus === 'connected' ? '#10b981' : '#ef4444' 
            }} 
          />
          <span style={styles.sseText}>
            {sseStatus === 'connected' ? 'Live Stream Active' : 'Disconnected'}
          </span>
        </div>

        {/* Notification Bell */}
        <div style={styles.notificationContainer}>
          <button 
            style={styles.iconBtn} 
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={18} />
            <span style={styles.badge} />
          </button>
          
          {showNotifications && (
            <div style={styles.notificationsDropdown} className="glass-card">
              <h4 style={styles.dropdownTitle}>Notifications</h4>
              <div style={styles.dropdownDivider} />
              <ul style={styles.dropdownList}>
                {mockNotifications.map((notif) => (
                  <li key={notif.id} style={styles.dropdownItem}>
                    <p style={styles.notifText}>{notif.text}</p>
                    <span style={styles.notifTime}>{notif.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Add Task Button */}
        <button className="btn-glow" style={styles.addBtn} onClick={onAddTaskClick}>
          <Plus size={18} />
          <span style={styles.addText}>New Task</span>
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    borderBottom: '1px solid var(--glass-border)',
    background: 'rgba(10, 5, 27, 0.4)',
    backdropFilter: 'blur(8px)',
    position: 'sticky',
    top: 0,
    zIndex: 99
  },
  mobileMenuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    marginRight: '12px',
    '@media (max-width: 1024px)': {
      display: 'block'
    }
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '400px'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-muted)'
  },
  searchInput: {
    width: '100%',
    paddingLeft: '40px',
    borderRadius: '24px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  sseWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--glass-border)',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)'
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  sseText: {
    fontWeight: '500',
    letterSpacing: '0.01em'
  },
  notificationContainer: {
    position: 'relative'
  },
  iconBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all var(--transition-fast)'
  },
  badge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent-tertiary)'
  },
  notificationsDropdown: {
    position: 'absolute',
    top: '46px',
    right: '0',
    width: '280px',
    padding: '16px',
    border: '1px solid var(--glass-border)',
    zIndex: 100,
    background: 'var(--bg-tertiary)'
  },
  dropdownTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '8px'
  },
  dropdownDivider: {
    height: '1px',
    background: 'var(--glass-border)',
    marginBottom: '10px'
  },
  dropdownList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  dropdownItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px'
  },
  notifText: {
    fontSize: '0.78rem',
    color: 'var(--text-primary)',
    lineHeight: '1.3'
  },
  notifTime: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)'
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.88rem'
  },
  addText: {
    fontWeight: '600'
  }
};
