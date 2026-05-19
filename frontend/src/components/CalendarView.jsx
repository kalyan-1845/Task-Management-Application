import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Tag, Plus } from 'lucide-react';

export default function CalendarView({ tasks, onTaskClick, onAddTaskClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get month name
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper: number of days in the current month
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();

  // Helper: first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const totalDays = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Build Calendar Days array
  const calendarDays = [];

  // Padding days from previous month
  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevMonthDays - i,
      month: month - 1,
      year: month === 0 ? year - 1 : year,
      isCurrentMonth: false
    });
  }

  // Days of current month
  for (let d = 1; d <= totalDays; d++) {
    calendarDays.push({
      day: d,
      month: month,
      year: year,
      isCurrentMonth: true
    });
  }

  // Padding days for next month to complete the grid (usually 42 cells total)
  const remainingCells = 42 - calendarDays.length;
  for (let d = 1; d <= remainingCells; d++) {
    calendarDays.push({
      day: d,
      month: month + 1,
      year: month === 11 ? year + 1 : year,
      isCurrentMonth: false
    });
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--priority-high)';
      case 'medium': return 'var(--priority-medium)';
      case 'low': return 'var(--priority-low)';
      default: return 'var(--text-muted)';
    }
  };

  const getTasksForDate = (y, m, d) => {
    // format as YYYY-MM-DD
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      // split to YYYY-MM-DD to avoid timezone shifts
      const taskDate = task.dueDate.split('T')[0];
      return taskDate === dateStr;
    });
  };

  const handleDayClick = (dayObj) => {
    const formattedDate = `${dayObj.year}-${String(dayObj.month + 1).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`;
    onAddTaskClick('todo', formattedDate);
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Calendar Header */}
      <div className="glass-card" style={styles.calendarHeader}>
        <div style={styles.headerTitle}>
          <CalendarIcon size={20} color="var(--accent-secondary)" />
          <h2 style={styles.monthName}>{monthNames[month]} {year}</h2>
        </div>

        <div style={styles.navControls}>
          <button style={styles.navBtn} onClick={prevMonth}>
            <ChevronLeft size={18} />
          </button>
          <button style={styles.navBtn} onClick={nextMonth}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="glass-card" style={styles.calendarGrid}>
        {/* Days of Week Row */}
        <div style={styles.daysHeader}>
          {daysOfWeek.map(d => (
            <div key={d} style={styles.dayOfWeek}>{d}</div>
          ))}
        </div>

        {/* Days Cells */}
        <div style={styles.cellsGrid}>
          {calendarDays.map((dayObj, idx) => {
            const dayTasks = getTasksForDate(dayObj.year, dayObj.month, dayObj.day);
            const isToday = new Date().toDateString() === new Date(dayObj.year, dayObj.month, dayObj.day).toDateString();

            return (
              <div 
                key={idx} 
                style={{ 
                  ...styles.dayCell, 
                  opacity: dayObj.isCurrentMonth ? 1 : 0.4,
                  borderColor: isToday ? 'var(--accent-primary)' : 'var(--glass-border)',
                  background: isToday ? 'rgba(139, 92, 246, 0.04)' : 'none'
                }}
                onClick={() => handleDayClick(dayObj)}
              >
                {/* Day Number */}
                <div style={styles.dayCellHeader}>
                  <span style={{ 
                    ...styles.dayNumber,
                    background: isToday ? 'var(--accent-primary)' : 'none',
                    color: isToday ? '#fff' : 'var(--text-primary)',
                    padding: isToday ? '2px 6px' : '0',
                    borderRadius: isToday ? '4px' : '0'
                  }}>
                    {dayObj.day}
                  </span>
                  
                  {dayObj.isCurrentMonth && (
                    <button 
                      style={styles.inlineAddBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDayClick(dayObj);
                      }}
                      title="Add task on this day"
                    >
                      <Plus size={12} />
                    </button>
                  )}
                </div>

                {/* Day Tasks List */}
                <div style={styles.cellTasks}>
                  {dayTasks.map(task => (
                    <button
                      key={task.id}
                      style={{ 
                        ...styles.taskPill, 
                        borderLeft: `3px solid ${getPriorityColor(task.priority)}` 
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick(task);
                      }}
                      title={task.title}
                    >
                      <span style={styles.taskPillTitle}>{task.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    height: 'calc(100vh - 70px)',
    overflowY: 'auto'
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'var(--bg-secondary)',
    padding: '16px 24px'
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  monthName: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#fff'
  },
  navControls: {
    display: 'flex',
    gap: '8px'
  },
  navBtn: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    width: '34px',
    height: '34px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    ':hover': {
      color: '#fff',
      background: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'var(--accent-primary)'
    }
  },
  calendarGrid: {
    background: 'var(--bg-secondary)',
    padding: '16px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '600px'
  },
  daysHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    textAlign: 'center',
    borderBottom: '1px solid var(--glass-border)',
    paddingBottom: '10px',
    marginBottom: '10px'
  },
  dayOfWeek: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  cellsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gridTemplateRows: 'repeat(6, 1fr)',
    gap: '6px',
    flex: 1
  },
  dayCell: {
    border: '1px solid var(--glass-border)',
    borderRadius: '8px',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '90px',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all var(--transition-fast)',
    ':hover': {
      borderColor: 'var(--glass-border-glow)'
    }
  },
  dayCellHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px'
  },
  dayNumber: {
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  inlineAddBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    opacity: 0,
    transition: 'opacity var(--transition-fast)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '16px',
    height: '16px',
    borderRadius: '4px',
    ':hover': {
      color: '#fff',
      background: 'rgba(255,255,255,0.08)'
    }
  },
  cellTasks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    overflowY: 'auto',
    flex: 1
  },
  taskPill: {
    width: '100%',
    textAlign: 'left',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '4px',
    padding: '3px 6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all var(--transition-fast)',
    ':hover': {
      background: 'rgba(255, 255, 255, 0.07)'
    }
  },
  taskPillTitle: {
    fontSize: '0.72rem',
    fontWeight: '500',
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
};
// Add custom selector hover opacity for inline add button via standard JS styling or inline behavior
