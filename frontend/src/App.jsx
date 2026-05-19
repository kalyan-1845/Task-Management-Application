import React, { useState, useEffect } from 'react';
import { api } from './api';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardView from './components/DashboardView';
import KanbanView from './components/KanbanView';
import ListView from './components/ListView';
import CalendarView from './components/CalendarView';
import TaskFormModal from './components/TaskFormModal';
import TaskDetailModal from './components/TaskDetailModal';

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [sseStatus, setSseStatus] = useState('disconnected');

  // Sidebar / Navigation views
  const [activeView, setActiveView] = useState('dashboard');
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modals state
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('todo');
  const [defaultDate, setDefaultDate] = useState('');

  // 1. Authenticate user on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await api.getMe();
          setUser(userData);
          fetchTasksAndComments();
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
        api.logout();
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  // 2. Fetch Tasks and Seed comments
  const fetchTasksAndComments = async () => {
    try {
      const allTasks = await api.getTasks();
      setTasks(allTasks);

      // Fetch comments for all tasks in parallel
      const commentPromises = allTasks.map(t => api.getComments(t.id).catch(() => []));
      const commentsArrays = await Promise.all(commentPromises);
      const flattenedComments = commentsArrays.flat();
      setComments(flattenedComments);
    } catch (err) {
      console.error('Failed to load workspace details:', err);
    }
  };

  // 3. Setup SSE Connection for Real-Time Synchronization
  useEffect(() => {
    if (!user) {
      setSseStatus('disconnected');
      return;
    }

    let eventSource;
    const connectSSE = () => {
      eventSource = new EventSource(api.getEventsUrl());

      eventSource.onopen = () => {
        setSseStatus('connected');
        console.log('SSE Real-Time Sync Connected');
      };

      eventSource.onerror = (e) => {
        setSseStatus('disconnected');
        console.error('SSE Stream error, reconnecting...', e);
        eventSource.close();
        setTimeout(connectSSE, 5000); // automatic retry
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.event === 'connected') {
            console.log(data.message);
            return;
          }

          const { event: type, data: payload } = data;
          console.log(`Live Event Received [${type}]:`, payload);

          if (type === 'TASK_CREATED') {
            setTasks(prev => {
              if (prev.some(t => t.id === payload.id)) return prev; // avoid duplicate
              return [payload, ...prev];
            });
          } else if (type === 'TASK_UPDATED') {
            setTasks(prev => prev.map(t => t.id === payload.id ? payload : t));
            // Also update currently viewed task details
            setSelectedTask(curr => (curr && curr.id === payload.id) ? payload : curr);
          } else if (type === 'TASK_DELETED') {
            setTasks(prev => prev.filter(t => t.id !== payload));
            // Close details modal if open
            setSelectedTask(curr => {
              if (curr && curr.id === payload) {
                setIsTaskDetailOpen(false);
                return null;
              }
              return curr;
            });
          } else if (type === 'COMMENT_ADDED') {
            setComments(prev => {
              if (prev.some(c => c.id === payload.id)) return prev; // avoid duplicate
              return [...prev, payload];
            });
          }
        } catch (err) {
          console.error('Error handling SSE notification payload:', err);
        }
      };
    };

    connectSSE();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [user]);

  // Auth helper
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    fetchTasksAndComments();
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
    setComments([]);
  };

  // --- TASK CRUD LOGIC ---

  // Create or Update task submit
  const handleTaskSubmit = async (taskPayload) => {
    try {
      if (selectedTask) {
        // Edit Mode
        const updated = await api.updateTask(selectedTask.id, taskPayload);
        setTasks(prev => prev.map(t => t.id === selectedTask.id ? updated : t));
      } else {
        // Create Mode
        const created = await api.createTask(taskPayload);
        setTasks(prev => [created, ...prev]);
      }
      setIsTaskFormOpen(false);
      setSelectedTask(null);
    } catch (err) {
      alert(err.message || 'Operation failed.');
    }
  };

  const handleStatusChange = async (taskId, nextStatus) => {
    try {
      const updated = await api.updateTask(taskId, { status: nextStatus });
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    } catch (err) {
      console.error('Failed to change status:', err);
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to permanently delete this task?')) return;
    try {
      await api.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      alert('Failed to delete task.');
    }
  };

  const handleTaskEditTrigger = (task) => {
    setSelectedTask(task);
    setIsTaskFormOpen(true);
  };

  const handleAddTaskTrigger = (status = 'todo', date = '') => {
    setSelectedTask(null);
    setDefaultStatus(status);
    setDefaultDate(date);
    setIsTaskFormOpen(true);
  };

  const handleTaskDetailTrigger = async (task) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
    // Fetch comments again to make sure they are fresh
    try {
      const taskComments = await api.getComments(task.id);
      setComments(prev => {
        // Filter out existing comments for this task, then add fresh ones
        const otherComments = prev.filter(c => c.taskId !== task.id);
        return [...otherComments, ...taskComments];
      });
    } catch (err) {
      console.error('Failed to reload fresh comments:', err);
    }
  };

  const handleCommentAdded = async (taskId) => {
    // Re-fetch comments to sync local
    try {
      const taskComments = await api.getComments(taskId);
      setComments(prev => {
        const otherComments = prev.filter(c => c.taskId !== taskId);
        return [...otherComments, ...taskComments];
      });
    } catch (err) {
      console.error('Failed to sync comment feed:', err);
    }
  };

  // --- FILTERING LOGIC ---
  const getFilteredTasks = () => {
    return tasks.filter(task => {
      // 1. Text Search Query
      const query = searchQuery.toLowerCase().trim();
      const matchQuery = !query || 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query));

      // 2. Sidebar Category Select
      const matchCategory = activeCategory === 'All Categories' || task.category === activeCategory;

      // 3. Status filter (applied on Kanban board or List view headers)
      const matchStatus = statusFilter === 'all' || task.status === statusFilter;

      return matchQuery && matchCategory && matchStatus;
    });
  };

  if (authLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p style={{ marginTop: 16, color: 'var(--text-secondary)' }}>Synchronizing Vortex workspace...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  const displayedTasks = getFilteredTasks();

  return (
    <div className="app-layout">
      {/* Sidebar - responsive visibility */}
      <div 
        style={{
          ...styles.sidebarWrapper,
          '@media (max-width: 1024px)': {
            transform: mobileSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            position: 'fixed',
            zIndex: 1000
          }
        }}
      >
        <Sidebar
          activeView={activeView}
          onViewChange={(view) => {
            setActiveView(view);
            setStatusFilter('all'); // reset status filters on view change
            setMobileSidebarOpen(false);
          }}
          activeCategory={activeCategory}
          onCategoryChange={(cat) => {
            setActiveCategory(cat);
            setMobileSidebarOpen(false);
          }}
          user={user}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Workspace Panels */}
      <main style={styles.mainWorkspace}>
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sseStatus={sseStatus}
          onAddTaskClick={() => handleAddTaskTrigger('todo')}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          user={user}
        />

        {/* View Router */}
        <div style={styles.viewPanel}>
          {activeView === 'dashboard' && (
            <DashboardView
              tasks={tasks}
              comments={comments}
              user={user}
              onViewChange={setActiveView}
              onStatusFilterChange={setStatusFilter}
              onTaskClick={handleTaskDetailTrigger}
            />
          )}

          {activeView === 'kanban' && (
            <KanbanView
              tasks={displayedTasks}
              onTaskClick={handleTaskDetailTrigger}
              onTaskEdit={handleTaskEditTrigger}
              onTaskDelete={handleTaskDelete}
              onStatusChange={handleStatusChange}
              onAddTaskClick={handleAddTaskTrigger}
            />
          )}

          {activeView === 'list' && (
            <ListView
              tasks={displayedTasks}
              onTaskClick={handleTaskDetailTrigger}
              onTaskEdit={handleTaskEditTrigger}
              onTaskDelete={handleTaskDelete}
              onStatusChange={handleStatusChange}
            />
          )}

          {activeView === 'calendar' && (
            <CalendarView
              tasks={displayedTasks}
              onTaskClick={handleTaskDetailTrigger}
              onAddTaskClick={handleAddTaskTrigger}
            />
          )}
        </div>
      </main>

      {/* Dynamic Form Modal (Create & Edit) */}
      <TaskFormModal
        isOpen={isTaskFormOpen}
        task={selectedTask}
        defaultStatus={defaultStatus}
        defaultDate={defaultDate}
        onClose={() => {
          setIsTaskFormOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleTaskSubmit}
      />

      {/* Task Details & Live Discussions Modal */}
      <TaskDetailModal
        isOpen={isTaskDetailOpen}
        task={selectedTask}
        comments={comments}
        onClose={() => {
          setIsTaskDetailOpen(false);
          setSelectedTask(null);
        }}
        onAddComment={handleCommentAdded}
      />
    </div>
  );
}

const styles = {
  loadingContainer: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'var(--bg-primary)'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(139, 92, 246, 0.1)',
    borderTop: '4px solid var(--accent-primary)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  sidebarWrapper: {
    transition: 'transform var(--transition-normal)'
  },
  mainWorkspace: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    background: 'radial-gradient(circle at 100% 0%, rgba(139, 92, 246, 0.05) 0%, var(--bg-primary) 100%)'
  },
  viewPanel: {
    flex: 1,
    overflowY: 'auto'
  }
};

// Add standard spinner animation to head
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
