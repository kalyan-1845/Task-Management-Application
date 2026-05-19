import React from 'react';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  List, 
  Calendar, 
  LogOut, 
  Briefcase, 
  User, 
  ShoppingBag, 
  HeartPulse, 
  Layers 
} from 'lucide-react';
import { api } from '../api';

const categories = [
  { name: 'All Categories', icon: Layers, color: 'var(--accent-primary)' },
  { name: 'Work', icon: Briefcase, color: 'var(--accent-secondary)' },
  { name: 'Personal', icon: User, color: 'var(--accent-tertiary)' },
  { name: 'Shopping', icon: ShoppingBag, color: 'var(--priority-medium)' },
  { name: 'Health & Fitness', icon: HeartPulse, color: 'var(--priority-low)' }
];

export default function Sidebar({ activeView, onViewChange, activeCategory, onCategoryChange, user, onLogout }) {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'kanban', name: 'Kanban Board', icon: KanbanSquare },
    { id: 'list', name: 'List View', icon: List },
    { id: 'calendar', name: 'Calendar', icon: Calendar }
  ];

  const handleLogout = () => {
    api.logout();
    onLogout();
  };

  return (
    <aside style={styles.sidebar} className="glass-card">
      <div style={styles.brandWrapper}>
        <div style={styles.logoCircle}>VT</div>
        <h2 style={styles.brandName}>Vortex Tasks</h2>
      </div>

      <nav style={styles.navigation}>
        <div style={styles.sectionHeader}>Views</div>
        <ul style={styles.menuList}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <li key={item.id}>
                <button
                  style={{
                    ...styles.menuBtn,
                    ...(isActive ? styles.menuBtnActive : {})
                  }}
                  onClick={() => onViewChange(item.id)}
                >
                  <Icon size={18} style={isActive ? styles.iconActive : styles.icon} />
                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div style={styles.divider}></div>

        <div style={styles.sectionHeader}>Categories</div>
        <ul style={styles.menuList}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.name;
            return (
              <li key={cat.name}>
                <button
                  style={{
                    ...styles.menuBtn,
                    ...(isActive ? styles.menuBtnActive : {})
                  }}
                  onClick={() => onCategoryChange(cat.name)}
                >
                  <Icon size={18} style={{ color: cat.color }} />
                  <span>{cat.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {user && (
        <div style={styles.profileWrapper}>
          <div style={styles.profileDetails}>
            <img 
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60'} 
              alt={user.name} 
              style={styles.avatar} 
            />
            <div style={styles.userInfo}>
              <div style={styles.userName}>{user.name}</div>
              <div style={styles.userUsername}>@{user.username}</div>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout} title="Sign Out">
            <LogOut size={18} />
          </button>
        </div>
      )}
    </aside>
  );
}

const styles = {
  sidebar: {
    height: '100vh',
    position: 'sticky',
    top: 0,
    borderRadius: 0,
    borderRight: '1px solid var(--glass-border)',
    borderTop: 'none',
    borderLeft: 'none',
    borderBottom: 'none',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 18px',
    background: 'var(--bg-secondary)',
    zIndex: 100
  },
  brandWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
    paddingLeft: '6px'
  },
  logoCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '0.95rem',
    boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)'
  },
  brandName: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#fff',
    letterSpacing: '-0.02em',
    background: 'linear-gradient(135deg, #fff 60%, var(--accent-secondary) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  navigation: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  sectionHeader: {
    fontSize: '0.72rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '8px',
    paddingLeft: '12px'
  },
  menuList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '20px'
  },
  menuBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    border: 'none',
    borderRadius: '8px',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '0.92rem',
    fontWeight: '500',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)'
  },
  menuBtnActive: {
    background: 'rgba(139, 92, 246, 0.1)',
    color: '#fff',
    borderLeft: '3px solid var(--accent-primary)',
    paddingLeft: '11px',
    boxShadow: 'inset 4px 0 15px rgba(139, 92, 246, 0.05)'
  },
  icon: {
    color: 'var(--text-muted)',
    transition: 'color var(--transition-fast)'
  },
  iconActive: {
    color: 'var(--accent-primary)'
  },
  divider: {
    height: '1px',
    background: 'var(--glass-border)',
    margin: '12px 0 24px 0'
  },
  profileWrapper: {
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 12px',
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--glass-border)',
    borderRadius: '12px'
  },
  profileDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    overflow: 'hidden'
  },
  avatar: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid rgba(139, 92, 246, 0.3)'
  },
  userInfo: {
    overflow: 'hidden'
  },
  userName: {
    fontSize: '0.88rem',
    fontWeight: '600',
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  userUsername: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  logoutBtn: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: 'var(--priority-high)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '8px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)'
  }
};
