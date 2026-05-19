import React from 'react';
import { 
  CheckCircle2, 
  Hourglass, 
  Play, 
  ClipboardList, 
  TrendingUp, 
  MessageSquareCode,
  Tag,
  AlertCircle
} from 'lucide-react';

export default function DashboardView({ tasks, comments, user, onViewChange, onStatusFilterChange, onTaskClick }) {
  // Stats Calculation
  const total = tasks.length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const inprogress = tasks.filter(t => t.status === 'inprogress').length;
  const inreview = tasks.filter(t => t.status === 'inreview').length;
  const done = tasks.filter(t => t.status === 'done').length;

  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  // Priority Breakdown
  const highPriority = tasks.filter(t => t.priority === 'high').length;
  const mediumPriority = tasks.filter(t => t.priority === 'medium').length;
  const lowPriority = tasks.filter(t => t.priority === 'low').length;

  // Category Breakdown
  const categoriesMap = tasks.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});

  const categories = Object.keys(categoriesMap).map(name => ({
    name,
    count: categoriesMap[name],
    percentage: total > 0 ? Math.round((categoriesMap[name] / total) * 100) : 0
  })).sort((a, b) => b.count - a.count);

  const handleStatClick = (status) => {
    onStatusFilterChange(status);
    onViewChange('kanban'); // switch to kanban board to see filtered status
  };

  // Recent Comments (last 4)
  const recentComments = [...comments]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-card" style={styles.welcomeBanner}>
        <div style={styles.welcomeLeft}>
          <h2 style={styles.welcomeTitle}>Welcome back, {user ? user.name : 'Vortex User'}!</h2>
          <p style={styles.welcomeSubtitle}>Here is your workspace productivity breakdown. <strong>{completionRate}%</strong> of tasks are completed.</p>
        </div>
        <div style={styles.welcomeRight}>
          <div style={styles.radialWrapper}>
            <svg width="80" height="80" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--accent-secondary)"
                strokeWidth="3.5"
                strokeDasharray={`${completionRate}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div style={styles.radialText}>{completionRate}%</div>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div style={styles.statsGrid}>
        <div className="glass-card" style={{ ...styles.statCard, borderLeft: '4px solid var(--accent-primary)' }} onClick={() => handleStatClick('all')}>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Total Tasks</span>
            <span style={styles.statVal}>{total}</span>
          </div>
          <div style={{ ...styles.statIconWrapper, background: 'rgba(139, 92, 246, 0.1)' }}>
            <ClipboardList size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
        </div>

        <div className="glass-card" style={{ ...styles.statCard, borderLeft: '4px solid var(--text-muted)' }} onClick={() => handleStatClick('todo')}>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>To Do</span>
            <span style={styles.statVal}>{todo}</span>
          </div>
          <div style={{ ...styles.statIconWrapper, background: 'rgba(156, 163, 175, 0.1)' }}>
            <Hourglass size={22} style={{ color: 'var(--text-secondary)' }} />
          </div>
        </div>

        <div className="glass-card" style={{ ...styles.statCard, borderLeft: '4px solid var(--accent-secondary)' }} onClick={() => handleStatClick('inprogress')}>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>In Progress</span>
            <span style={styles.statVal}>{inprogress + inreview}</span>
          </div>
          <div style={{ ...styles.statIconWrapper, background: 'rgba(6, 182, 212, 0.1)' }}>
            <Play size={22} style={{ color: 'var(--accent-secondary)' }} />
          </div>
        </div>

        <div className="glass-card" style={{ ...styles.statCard, borderLeft: '4px solid var(--priority-low)' }} onClick={() => handleStatClick('done')}>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Completed</span>
            <span style={styles.statVal}>{done}</span>
          </div>
          <div style={{ ...styles.statIconWrapper, background: 'rgba(16, 185, 129, 0.1)' }}>
            <CheckCircle2 size={22} style={{ color: 'var(--priority-low)' }} />
          </div>
        </div>
      </div>

      {/* Analytics & Collaboration Layout */}
      <div style={styles.analyticsLayout}>
        {/* Left Side: SVGs and Charts */}
        <div style={styles.chartCol}>
          {/* Priority Insights */}
          <div className="glass-card" style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <TrendingUp size={18} style={{ color: 'var(--accent-secondary)' }} />
              <h3 style={styles.chartTitle}>Priority Breakdown</h3>
            </div>
            <div style={styles.barGraph}>
              <div style={styles.barItem}>
                <div style={styles.barMeta}>
                  <span style={styles.barLabel}>🔥 High Priority</span>
                  <span style={{ color: 'var(--priority-high)' }}>{highPriority} tasks</span>
                </div>
                <div style={styles.barRail}>
                  <div style={{ ...styles.barFill, backgroundColor: 'var(--priority-high)', width: `${total > 0 ? (highPriority / total) * 100 : 0}%` }} />
                </div>
              </div>

              <div style={styles.barItem}>
                <div style={styles.barMeta}>
                  <span style={styles.barLabel}>⚡ Medium Priority</span>
                  <span style={{ color: 'var(--priority-medium)' }}>{mediumPriority} tasks</span>
                </div>
                <div style={styles.barRail}>
                  <div style={{ ...styles.barFill, backgroundColor: 'var(--priority-medium)', width: `${total > 0 ? (mediumPriority / total) * 100 : 0}%` }} />
                </div>
              </div>

              <div style={styles.barItem}>
                <div style={styles.barMeta}>
                  <span style={styles.barLabel}>🌱 Low Priority</span>
                  <span style={{ color: 'var(--priority-low)' }}>{lowPriority} tasks</span>
                </div>
                <div style={styles.barRail}>
                  <div style={{ ...styles.barFill, backgroundColor: 'var(--priority-low)', width: `${total > 0 ? (lowPriority / total) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Categories Progression */}
          <div className="glass-card" style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <Tag size={18} style={{ color: 'var(--accent-tertiary)' }} />
              <h3 style={styles.chartTitle}>Top Categories</h3>
            </div>
            <div style={styles.categoryList}>
              {categories.length === 0 ? (
                <div style={styles.emptyState}>No categories logged yet.</div>
              ) : (
                categories.slice(0, 3).map((cat) => (
                  <div key={cat.name} style={styles.catItem}>
                    <div style={styles.catDetails}>
                      <span style={styles.catName}>{cat.name}</span>
                      <span style={styles.catCount}>{cat.count} {cat.count === 1 ? 'task' : 'tasks'}</span>
                    </div>
                    <div style={styles.catRail}>
                      <div 
                        style={{ 
                          ...styles.catFill, 
                          background: 'linear-gradient(95deg, var(--accent-primary), var(--accent-secondary))',
                          width: `${cat.percentage}%` 
                        }} 
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Recent Activity & Live updates feed */}
        <div className="glass-card" style={styles.activityFeed}>
          <div style={styles.chartHeader}>
            <MessageSquareCode size={18} style={{ color: 'var(--accent-secondary)' }} />
            <h3 style={styles.chartTitle}>Workspace Discussion</h3>
          </div>

          <div style={styles.discussionList}>
            {recentComments.length === 0 ? (
              <div style={styles.noCommentsBox}>
                <AlertCircle size={24} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                <p style={styles.noCommentsText}>No recent discussion on tasks. Select a task to share updates!</p>
              </div>
            ) : (
              recentComments.map((comment) => {
                const relatedTask = tasks.find(t => t.id === comment.taskId);
                return (
                  <div 
                    key={comment.id} 
                    style={styles.commentItem}
                    onClick={() => relatedTask && onTaskClick(relatedTask)}
                  >
                    <div style={styles.commentMeta}>
                      <span style={styles.commentUser}>{comment.username}</span>
                      <span style={styles.commentTime}>
                        {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p style={styles.commentText}>"{comment.text}"</p>
                    {relatedTask && (
                      <span style={styles.relatedTaskBadge}>
                        Re: {relatedTask.title}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    padding: '24px'
  },
  welcomeBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(135deg, rgba(25, 18, 59, 0.7) 0%, rgba(139, 92, 246, 0.08) 100%)',
    border: '1px solid rgba(139, 92, 246, 0.15)',
    padding: '30px'
  },
  welcomeLeft: {
    flex: 1,
    paddingRight: '20px'
  },
  welcomeTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#fff'
  },
  welcomeSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    lineHeight: '1.5'
  },
  welcomeRight: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  radialWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80px',
    height: '80px'
  },
  radialText: {
    position: 'absolute',
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#fff'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px'
  },
  statCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '20px',
    background: 'var(--bg-secondary)',
    transition: 'all var(--transition-fast)'
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  statLabel: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.02em'
  },
  statVal: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#fff'
  },
  statIconWrapper: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  analyticsLayout: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: '24px',
    alignItems: 'start',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr'
    }
  },
  chartCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  chartCard: {
    background: 'var(--bg-secondary)'
  },
  chartHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px'
  },
  chartTitle: {
    fontSize: '1.1rem',
    color: '#fff',
    fontWeight: '600'
  },
  barGraph: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  barItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  barMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    fontWeight: '500'
  },
  barLabel: {
    color: 'var(--text-secondary)'
  },
  barRail: {
    height: '6px',
    borderRadius: '3px',
    background: 'rgba(255,255,255,0.05)',
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.8s ease-out'
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  catItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  catDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem'
  },
  catName: {
    color: 'var(--text-primary)',
    fontWeight: '600'
  },
  catCount: {
    color: 'var(--text-muted)'
  },
  catRail: {
    height: '6px',
    borderRadius: '3px',
    background: 'rgba(255,255,255,0.05)',
    overflow: 'hidden'
  },
  catFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.8s ease-out'
  },
  activityFeed: {
    background: 'var(--bg-secondary)',
    height: '100%',
    minHeight: '380px'
  },
  discussionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  noCommentsBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    textAlign: 'center'
  },
  noCommentsText: {
    fontSize: '0.88rem',
    color: 'var(--text-muted)',
    lineHeight: '1.4'
  },
  commentItem: {
    padding: '14px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.04)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  commentItemHover: {
    borderColor: 'rgba(139, 92, 246, 0.25)',
    background: 'rgba(139, 92, 246, 0.03)'
  },
  commentMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    fontWeight: '500'
  },
  commentUser: {
    color: 'var(--accent-secondary)'
  },
  commentTime: {
    color: 'var(--text-muted)'
  },
  commentText: {
    fontSize: '0.85rem',
    color: 'var(--text-primary)',
    lineHeight: '1.4',
    fontStyle: 'italic'
  },
  relatedTaskBadge: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    alignSelf: 'flex-start',
    background: 'rgba(255,255,255,0.04)',
    padding: '2px 8px',
    borderRadius: '12px',
    marginTop: '4px'
  },
  emptyState: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    textAlign: 'center',
    padding: '20px 0'
  }
};
