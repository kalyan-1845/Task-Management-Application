import React from 'react';
import { Clock, Calendar, Edit3, Trash2, Tag, Plus } from 'lucide-react';

const lanes = [
  { id: 'todo', name: 'To Do', color: 'var(--text-muted)' },
  { id: 'inprogress', name: 'In Progress', color: 'var(--accent-secondary)' },
  { id: 'inreview', name: 'In Review', color: 'var(--accent-primary)' },
  { id: 'done', name: 'Completed', color: 'var(--priority-low)' }
];

export default function KanbanView({ 
  tasks, 
  onTaskClick, 
  onTaskEdit, 
  onTaskDelete, 
  onStatusChange, 
  onAddTaskClick 
}) {
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onStatusChange(taskId, targetStatus);
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

  const getDueDateLabel = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (isToday) return 'Due Today';
    if (diffDays === 1) return 'Due Tomorrow';
    if (diffDays < 0) return 'Overdue';
    return `Due in ${diffDays} days`;
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.board}>
        {lanes.map((lane) => {
          const laneTasks = tasks.filter(t => t.status === lane.id);
          
          return (
            <div 
              key={lane.id} 
              style={styles.lane}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, lane.id)}
            >
              {/* Lane Header */}
              <div style={styles.laneHeader}>
                <div style={styles.laneHeaderLeft}>
                  <div style={{ ...styles.laneIndicator, backgroundColor: lane.color }} />
                  <h3 style={styles.laneName}>{lane.name}</h3>
                  <span style={styles.taskCount}>{laneTasks.length}</span>
                </div>
                <button 
                  style={styles.laneAddBtn} 
                  onClick={() => onAddTaskClick(lane.id)}
                  title={`Add task to ${lane.name}`}
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Lane Tasks Grid */}
              <div style={styles.taskContainer}>
                {laneTasks.length === 0 ? (
                  <div style={styles.emptyLane}>
                    Drop tasks here
                  </div>
                ) : (
                  laneTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onTaskClick(task)}
                      style={styles.card}
                      className="glass-card"
                    >
                      {/* Priority Badge & Actions */}
                      <div style={styles.cardHeader}>
                        <span 
                          style={{ 
                            ...styles.priorityBadge, 
                            color: getPriorityColor(task.priority),
                            borderColor: getPriorityColor(task.priority) + '33',
                            background: getPriorityColor(task.priority) + '11'
                          }}
                        >
                          {task.priority}
                        </span>

                        <div style={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                          <button 
                            style={styles.actionBtn} 
                            onClick={() => onTaskEdit(task)}
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            style={{ ...styles.actionBtn, color: 'var(--priority-high)' }} 
                            onClick={() => onTaskDelete(task.id)}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 style={styles.cardTitle}>{task.title}</h4>

                      {/* Description Snippet */}
                      {task.description && (
                        <p style={styles.cardDesc}>
                          {task.description.length > 80 
                            ? `${task.description.substring(0, 80)}...` 
                            : task.description}
                        </p>
                      )}

                      {/* Metadata Footer */}
                      <div style={styles.cardFooter}>
                        <div style={styles.metaBadge} title="Category">
                          <Tag size={12} style={{ color: 'var(--accent-secondary)' }} />
                          <span>{task.category}</span>
                        </div>
                        {task.dueDate && (
                          <div 
                            style={{ 
                              ...styles.metaBadge, 
                              color: getDueDateLabel(task.dueDate) === 'Overdue' ? 'var(--priority-high)' : 'var(--text-secondary)'
                            }}
                            title="Due Date"
                          >
                            <Clock size={12} />
                            <span>{getDueDateLabel(task.dueDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '24px',
    height: 'calc(100vh - 70px)',
    overflowY: 'auto'
  },
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    height: '100%',
    alignItems: 'start'
  },
  lane: {
    background: 'rgba(18, 11, 46, 0.4)',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '100%',
    overflowY: 'auto'
  },
  laneHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  },
  laneHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  laneIndicator: {
    width: '10px',
    height: '10px',
    borderRadius: '50%'
  },
  laneName: {
    fontSize: '0.98rem',
    fontWeight: '600',
    color: '#fff'
  },
  taskCount: {
    fontSize: '0.75rem',
    background: 'rgba(255,255,255,0.06)',
    color: 'var(--text-secondary)',
    padding: '2px 8px',
    borderRadius: '12px',
    fontWeight: '600'
  },
  laneAddBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    borderRadius: '4px',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-fast)',
    ':hover': {
      color: '#fff',
      background: 'rgba(255,255,255,0.05)'
    }
  },
  taskContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minHeight: '200px'
  },
  emptyLane: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '30px',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    textAlign: 'center'
  },
  card: {
    background: 'var(--bg-secondary)',
    padding: '16px',
    borderRadius: '12px',
    cursor: 'grab',
    transition: 'all var(--transition-fast)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  priorityBadge: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: '0.04em',
    padding: '2px 8px',
    borderRadius: '12px',
    border: '1px solid'
  },
  cardActions: {
    display: 'flex',
    gap: '6px'
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-fast)',
    ':hover': {
      color: '#fff',
      background: 'rgba(255,255,255,0.05)'
    }
  },
  cardTitle: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#fff',
    lineHeight: '1.4'
  },
  cardDesc: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4'
  },
  cardFooter: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '6px',
    paddingTop: '10px',
    borderTop: '1px solid rgba(255, 255, 255, 0.03)'
  },
  metaBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.75rem',
    color: 'var(--text-secondary)'
  }
};

// Drag handle optimization
