import React, { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';

const CATEGORY_PRESETS = ['Work', 'Personal', 'Shopping', 'Health & Fitness'];

export default function TaskFormModal({ task, isOpen, onClose, onSubmit, defaultStatus, defaultDate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Work');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [dueDate, setDueDate] = useState('');

  // Prepopulate form if editing an existing task or using lane presets
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'medium');
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');

      if (CATEGORY_PRESETS.includes(task.category)) {
        setCategory(task.category);
        setIsCustomCategory(false);
      } else {
        setCategory('Custom...');
        setCustomCategory(task.category || '');
        setIsCustomCategory(true);
      }
    } else {
      // Create mode
      setTitle('');
      setDescription('');
      setStatus(defaultStatus || 'todo');
      setPriority('medium');
      setDueDate(defaultDate || new Date(Date.now() + 86400000).toISOString().split('T')[0]); // tomorrow by default
      setCategory('Work');
      setCustomCategory('');
      setIsCustomCategory(false);
    }
  }, [task, isOpen, defaultStatus, defaultDate]);

  if (!isOpen) return null;

  const handleCategoryChange = (val) => {
    setCategory(val);
    if (val === 'Custom...') {
      setIsCustomCategory(true);
    } else {
      setIsCustomCategory(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalCategory = isCustomCategory ? (customCategory.trim() || 'General') : category;
    
    const taskPayload = {
      title,
      description,
      status,
      priority,
      category: finalCategory,
      dueDate
    };

    onSubmit(taskPayload);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div 
        className="glass-card animate-slide-down" 
        style={styles.modal} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={styles.header}>
          <h3 style={styles.modalTitle}>
            {task ? 'Edit Task' : 'Create Task'}
          </h3>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleFormSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Design Dashboard Prototype"
              className="glass-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              placeholder="Provide a detailed breakdown of the task requirements..."
              className="glass-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
            />
          </div>

          {/* Row 1 */}
          <div style={styles.row}>
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={styles.select}
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="inreview">In Review</option>
                <option value="done">Completed</option>
              </select>
            </div>

            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={styles.select}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div style={styles.row}>
            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>Category</label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                style={styles.select}
              >
                {CATEGORY_PRESETS.map(preset => (
                  <option key={preset} value={preset}>{preset}</option>
                ))}
                <option value="Custom...">Custom...</option>
              </select>

              {isCustomCategory && (
                <input
                  type="text"
                  placeholder="e.g. Marketing"
                  className="glass-input"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  style={{ ...styles.input, marginTop: '8px' }}
                  required
                />
              )}
            </div>

            <div style={{ ...styles.formGroup, flex: 1 }}>
              <label style={styles.label}>Due Date</label>
              <input
                type="date"
                className="glass-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.actions}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-glow" style={styles.saveBtn}>
              <Save size={16} />
              <span>{task ? 'Update Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
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
    maxWidth: '540px',
    background: 'var(--bg-secondary)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    padding: '28px',
    borderRadius: '16px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#fff',
    letterSpacing: '-0.01em'
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.03)'
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    padding: '12px 16px',
    outline: 'none',
    border: '1px solid var(--glass-border)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    resize: 'vertical',
    ':focus': {
      borderColor: 'var(--accent-primary)'
    }
  },
  row: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  select: {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    padding: '11px 16px',
    outline: 'none',
    cursor: 'pointer'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '10px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.04)'
  },
  cancelBtn: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    color: 'var(--text-secondary)',
    padding: '10px 20px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#fff'
    }
  },
  saveBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 24px',
    borderRadius: '8px'
  }
};
