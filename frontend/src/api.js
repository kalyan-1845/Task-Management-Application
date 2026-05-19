const API_BASE = 'http://localhost:5000/api';

export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

const request = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  return response.json();
};

export const api = {
  // Auth API
  login: async (username, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    setAuthToken(data.token);
    return data;
  },

  register: async (username, email, name, password) => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, name, password })
    });
    setAuthToken(data.token);
    return data;
  },

  getMe: async () => {
    return request('/auth/me');
  },

  logout: () => {
    setAuthToken(null);
  },

  // Tasks API
  getTasks: async () => {
    return request('/tasks');
  },

  createTask: async (taskData) => {
    return request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  },

  updateTask: async (id, updatedFields) => {
    return request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedFields)
    });
  },

  deleteTask: async (id) => {
    return request(`/tasks/${id}`, {
      method: 'DELETE'
    });
  },

  // Comments API
  getComments: async (taskId) => {
    return request(`/tasks/${taskId}/comments`);
  },

  addComment: async (taskId, text) => {
    return request(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  },

  // SSE Stream URL helper
  getEventsUrl: () => `${API_BASE}/events`
};
