import React, { useState } from 'react';
import { 
  ArrowUpDown, 
  Trash2, 
  Edit3, 
  Calendar, 
  Tag, 
  AlertTriangle,
  CheckCircle,
  Eye
} from 'lucide-react';

export default function ListView({ 
  tasks, 
  onTaskClick, 
  onTaskEdit, 
  onTaskDelete, 
  onStatusChange 
}) {
  const [sortField, setSortField] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Toggle sort order
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getPriorityWeight = (priority) => {
    switch (priority) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  };

  const handleStatusToggle = (task) => {
    const nextStatus = task.status === 'done' ? 'todo' : 'done';
    onStatusChange(task.id, nextStatus);
  };

  // Filter Tasks
  const filteredTasks = tasks.filter(task => {
    const matchStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchStatus && matchPriority;
  });

  // Sort Tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'priority') {
      aVal = getPriorityWeight(a.priority);
      bVal = getPriorityWeight(b.priority);
    }

    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    if (typeof aVal === 'string') {
      return sortOrder === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    } else {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--priority-high)';
      case 'medium': return 'var(--priority-medium)';
      case 'low': return 'var(--priority-low)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Filtering Header Bar */}
      <div className="glass-card" style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Status</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="inreview">In Review</option>
            <option value="done">Completed</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Priority</label>
          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Grid Header */}
      <div style={styles.listContainer} className="glass-card">
        {sortedTasks.length === 0 ? (
          <div style={styles.emptyState}>No matching tasks found.</div>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div style={{ ...styles.th, width: '40px' }} /> {/* Checkbox */}
              <div style={{ ...styles.th, flex: 2 }} onClick={() => handleSort('title')}>
                <span>Task Title</span>
                <ArrowUpDown size={12} style={styles.sortIcon} />
              </div>
              <div style={styles.th} onClick={() => handleSort('category')}>
                <span>Category</span>
                <ArrowUpDown size={12} style={styles.sortIcon} />
              </div>
              <div style={styles.th} onClick={() => handleSort('priority')}>
                <span>Priority</span>
                <ArrowUpDown size={12} style={styles.sortIcon} />
              </div>
              <div style={styles.th} onClick={() => handleSort('dueDate')}>
                <span>Due Date</span>
                <ArrowUpDown size={12} style={styles.sortIcon} />
              </div>
              <div style={{ ...styles.th, width: '120px', textAlign: 'center' }}>Actions</div>
            </div>

            <div style={styles.tableBody}>
              {sortedTasks.map((task) => (
                <div key={task.id} style={styles.row}>
                  {/* Status Toggle Box */}
                  <div style={{ ...styles.td, width: '40px' }}>
                    <button 
                      onClick={() => handleStatusToggle(task)}
                      style={{ 
                        ...styles.checkboxBtn,
                        borderColor: task.status === 'done' ? 'var(--priority-low)' : 'var(--glass-border)',
                        background: task.status === 'done' ? 'rgba(16, 185, 129, 0.15)' : 'none'
                      }}
                    >
                      {task.status === 'done' && <CheckCircle size={14} color="var(--priority-low)" />}
                    </button>
                  </div>

                  {/* Title & Desc */}
                  <div style={{ ...styles.td, flex: 2, cursor: 'pointer' }} onClick={() => onTaskClick(task)}>
                    <div style={{ 
                      ...styles.rowTitle,
                      textDecoration: task.status === 'done' ? 'line-through' : 'none',
                      color: task.status === 'done' ? 'var(--text-muted)' : '#fff'
                    }}>
                      {task.title}
                    </div>
                  </div>

                  {/* Category */}
                  <div style={styles.td}>
                    <div style={styles.categoryBadge}>
                      <Tag size={12} />
                      <span>{task.category}</span>
                    </div>
                  </div>

                  {/* Priority */}
                  <div style={styles.td}>
                    <span 
                      style={{ 
                        ...styles.priorityPill,
                        color: getPriorityColor(task.priority),
                        backgroundColor: getPriorityColor(task.priority) + '15'
                      }}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div style={styles.td}>
                    <div style={styles.dateText}>
                      <Calendar size={12} />
                      <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'No Date'}</span>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div style={{ ...styles.td, width: '120px', justifyContent: 'center', gap: '8px' }}>
                    <button 
                      style={styles.actionBtn} 
                      onClick={() => onTaskClick(task)}
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
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
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  filterBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '24px',
    padding: '16px 24px',
    background: 'var(--bg-secondary)',
    alignItems: 'center'
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  filterLabel: {
    fontSize: '0.78rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  select: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    padding: '8px 16px',
    outline: 'none',
    cursor: 'pointer',
    minWidth: '150px'
  },
  listContainer: {
    background: 'var(--bg-secondary)',
    overflowX: 'auto',
    padding: 0
  },
  table: {
    width: '100%',
    minWidth: '800px',
    display: 'flex',
    flexDirection: 'column'
  },
  tableHeader: {
    display: 'flex',
    padding: '16px 24px',
    borderBottom: '1px solid var(--glass-border)',
    background: 'rgba(255, 255, 255, 0.02)'
  },
  th: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
      color: '#fff'
    }
  },
  sortIcon: {
    color: 'var(--text-muted)'
  },
  tableBody: {
    display: 'flex',
    flexDirection: 'column'
  },
  row: {
    display: 'flex',
    padding: '14px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
    alignItems: 'center',
    transition: 'background var(--transition-fast)',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.01)'
    }
  },
  td: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.9rem',
    overflow: 'hidden'
  },
  checkboxBtn: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: '2px solid',
    background: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-fast)'
  },
  rowTitle: {
    fontWeight: '600',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  categoryBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    background: 'rgba(255, 255, 255, 0.04)',
    padding: '4px 10px',
    borderRadius: '12px'
  },
  priorityPill: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: '0.04em',
    padding: '3px 10px',
    borderRadius: '12px'
  },
  dateText: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.82rem',
    color: 'var(--text-secondary)'
  },
  actionBtn: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-fast)',
    ':hover': {
      color: '#fff',
      background: 'rgba(255, 255, 255, 0.08)'
    }
  },
  emptyState: {
    padding: '60px 20px',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: '0.92rem'
  }
};
