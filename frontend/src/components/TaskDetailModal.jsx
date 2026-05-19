import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, AlertCircle, Play, Send, MessageSquare, User } from 'lucide-react';
import { api } from '../api';

export default function TaskDetailModal({ task, isOpen, onClose, comments, onAddComment }) {
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !task) return null;

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setLoading(true);
    setError('');
    try {
      await api.addComment(task.id, commentText);
      setCommentText(''); // Clear input
      // Note: The SSE event will broadcast comment, but we also append locally for double reliability
      onAddComment(task.id);
    } catch (err) {
      setError('Failed to post comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--priority-high)';
      case 'medium': return 'var(--priority-medium)';
      case 'low': return 'var(--priority-low)';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'inprogress': return 'In Progress';
      case 'inreview': return 'In Review';
      case 'done': return 'Completed';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'var(--text-muted)';
      case 'inprogress': return 'var(--accent-secondary)';
      case 'inreview': return 'var(--accent-primary)';
      case 'done': return 'var(--priority-low)';
      default: return '#fff';
    }
  };

  const taskComments = comments.filter(c => c.taskId === task.id);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div 
        className="glass-card animate-slide-down" 
        style={styles.modal} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={styles.header}>
          <div style={styles.headerTitleGroup}>
            <span 
              style={{ 
                ...styles.categoryTag, 
                backgroundColor: 'rgba(6, 182, 212, 0.1)', 
                color: 'var(--accent-secondary)' 
              }}
            >
              <Tag size={12} />
              <span>{task.category}</span>
            </span>
            <span 
              style={{ 
                ...styles.priorityTag, 
                borderColor: getPriorityColor(task.priority) + '33', 
                color: getPriorityColor(task.priority),
                background: getPriorityColor(task.priority) + '11'
              }}
            >
              {task.priority} Priority
            </span>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Grid */}
        <div style={styles.bodyGrid}>
          {/* Left Column: Task Details */}
          <div style={styles.detailsCol}>
            <h2 style={styles.taskTitle}>{task.title}</h2>
            
            {/* Status & Date Info bar */}
            <div style={styles.infoBar}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Status</span>
                <span style={{ ...styles.infoValue, color: getStatusColor(task.status), fontWeight: '600' }}>
                  {getStatusLabel(task.status)}
                </span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Due Date</span>
                <span style={styles.infoValue}>
                  <Calendar size={13} style={{ marginRight: 5, color: 'var(--text-muted)' }} />
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Due Date'}
                </span>
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.descSection}>
              <h4 style={styles.sectionHeader}>Task Description</h4>
              <p style={styles.descriptionText}>
                {task.description || 'No description provided for this task.'}
              </p>
            </div>
          </div>

          {/* Right Column: Live Discussion */}
          <div style={styles.commentsCol}>
            <div style={styles.commentsHeader}>
              <MessageSquare size={16} color="var(--accent-secondary)" />
              <h4 style={styles.sectionHeader}>Discussion Feed ({taskComments.length})</h4>
            </div>

            {/* List of comments */}
            <div style={styles.commentsList}>
              {taskComments.length === 0 ? (
                <div style={styles.emptyComments}>
                  <MessageSquare size={24} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                  <p>No comments yet. Start the conversation!</p>
                </div>
              ) : (
                taskComments.map((comment) => (
                  <div key={comment.id} style={styles.commentCard}>
                    <div style={styles.commentHeader}>
                      <div style={styles.commentUserGroup}>
                        <div style={styles.avatarMini}>
                          <User size={12} color="#fff" />
                        </div>
                        <span style={styles.commentAuthor}>{comment.username}</span>
                      </div>
                      <span style={styles.commentDate}>
                        {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p style={styles.commentText}>{comment.text}</p>
                  </div>
                ))
              )}
            </div>

            {error && <span style={styles.errorText}>{error}</span>}

            {/* Add comment form */}
            <form onSubmit={handleCommentSubmit} style={styles.commentForm}>
              <input
                type="text"
                placeholder="Ask a question or post a progress update..."
                className="glass-input"
                style={styles.commentInput}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={loading}
              />
              <button type="submit" className="btn-glow" style={styles.sendBtn} disabled={loading}>
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(5, 2, 17, 0.75)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
    padding: '20px'
  },
  modal: {
    width: '100%',
    maxWidth: '900px',
    background: 'var(--bg-secondary)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    padding: '28px',
    borderRadius: '16px',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  headerTitleGroup: {
    display: 'flex',
    gap: '10px'
  },
  categoryTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.75rem',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '12px'
  },
  priorityTag: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: '0.04em',
    padding: '3px 10px',
    borderRadius: '12px',
    border: '1px solid'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-fast)',
    ':hover': {
      color: '#fff',
      background: 'rgba(255, 255, 255, 0.05)'
    }
  },
  bodyGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '28px',
    alignItems: 'start',
    '@media (max-width: 800px)': {
      gridTemplateColumns: '1fr'
    }
  },
  detailsCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  taskTitle: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#fff',
    lineHeight: '1.3'
  },
  infoBar: {
    display: 'flex',
    gap: '24px',
    background: 'rgba(255, 255, 255, 0.015)',
    border: '1px solid rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
    padding: '12px 16px'
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  infoLabel: {
    fontSize: '0.72rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  infoValue: {
    fontSize: '0.88rem',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center'
  },
  divider: {
    height: '1px',
    background: 'var(--glass-border)',
    margin: '8px 0'
  },
  descSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  sectionHeader: {
    fontSize: '0.88rem',
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  descriptionText: {
    fontSize: '0.92rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap'
  },
  commentsCol: {
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(10, 5, 27, 0.3)',
    border: '1px solid var(--glass-border)',
    borderRadius: '12px',
    padding: '20px',
    height: '420px'
  },
  commentsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px'
  },
  commentsList: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingRight: '4px',
    marginBottom: '16px'
  },
  emptyComments: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    textAlign: 'center'
  },
  commentCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '8px',
    padding: '10px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  commentUserGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  avatarMini: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: 'var(--accent-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  commentAuthor: {
    fontSize: '0.78rem',
    fontWeight: '600',
    color: 'var(--accent-secondary)'
  },
  commentDate: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)'
  },
  commentText: {
    fontSize: '0.82rem',
    color: 'var(--text-primary)',
    lineHeight: '1.4'
  },
  commentForm: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto'
  },
  commentInput: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '8px',
    fontSize: '0.88rem'
  },
  sendBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorText: {
    fontSize: '0.78rem',
    color: 'var(--priority-high)',
    marginBottom: '8px'
  }
};
