import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './db.js';
import { authenticateToken, JWT_SECRET } from './middleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*', // Allow all origins for local dev simplicity
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// --- SERVER-SENT EVENTS (SSE) SYSTEM FOR REAL-TIME UPDATES ---
let sseClients = [];

const broadcast = (event, data) => {
  const payload = JSON.stringify({ event, data });
  sseClients.forEach(client => {
    client.write(`data: ${payload}\n\n`);
  });
};

// SSE connection endpoint
app.get('/api/events', (req, res) => {
  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Send initial ping to client
  res.write(`data: ${JSON.stringify({ event: 'connected', message: 'SSE Connection Established' })}\n\n`);

  // Add this response to our pool
  sseClients.push(res);

  // Remove client on disconnect
  req.on('close', () => {
    sseClients = sseClients.filter(client => client !== res);
  });
});

// --- AUTHENTICATION ROUTES ---

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, name, password } = req.body;

    if (!username || !email || !name || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (db.getUserByUsername(username)) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      username,
      email,
      name,
      passwordHash,
      avatarUrl: `https://images.unsplash.com/photo-${['1535713875002-d1d0cf377fde', '1494790108377-be9c29b29330', '1599566150163-29194dcaad36', '1570295999919-56ceb5ecca61'][Math.floor(Math.random() * 4)]}?w=100&auto=format&fit=crop&q=60`,
      createdAt: new Date().toISOString()
    };

    db.addUser(newUser);

    // Generate JWT
    const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name,
        avatarUrl: newUser.avatarUrl
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = db.getUserByUsername(username);
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get User Profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl
  });
});

// --- TASKS ROUTES ---

// Get all tasks
app.get('/api/tasks', authenticateToken, (req, res) => {
  // Let's filter tasks to return only the ones created by the user (or return all, since it's a shared team task manager!
  // A team task manager is cooler. Let's return all tasks, but annotate them)
  const tasks = db.getTasks();
  res.json(tasks);
});

// Create task
app.post('/api/tasks', authenticateToken, (req, res) => {
  const { title, description, priority, category, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: `tsk_${Math.random().toString(36).substr(2, 9)}`,
    title,
    description: description || '',
    status: 'todo', // default status
    priority: priority || 'medium',
    category: category || 'Work',
    dueDate: dueDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
    createdBy: req.user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.addTask(newTask);

  // Broadcast creation to all connected clients
  broadcast('TASK_CREATED', newTask);

  res.status(201).json(newTask);
});

// Update task
app.put('/api/tasks/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const fieldsToUpdate = req.body;

  const currentTask = db.getTaskById(id);
  if (!currentTask) {
    return res.status(404).json({ error: 'Task not found' });
  }

  // Update fields
  const updatedTask = db.updateTask(id, fieldsToUpdate);

  // Broadcast update to all connected clients
  broadcast('TASK_UPDATED', updatedTask);

  res.json(updatedTask);
});

// Delete task
app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  const currentTask = db.getTaskById(id);
  if (!currentTask) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const success = db.deleteTask(id);
  if (!success) {
    return res.status(500).json({ error: 'Failed to delete task' });
  }

  // Broadcast deletion to all connected clients
  broadcast('TASK_DELETED', id);

  res.json({ success: true, message: 'Task deleted successfully', id });
});

// --- COMMENTS ROUTES ---

// Get task comments
app.get('/api/tasks/:id/comments', authenticateToken, (req, res) => {
  const { id } = req.params;
  const comments = db.getCommentsByTaskId(id);
  res.json(comments);
});

// Add comment to task
app.post('/api/tasks/:id/comments', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const user = db.getUserById(req.user.id);

  if (!text) {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  const task = db.getTaskById(id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const newComment = {
    id: `cmt_${Math.random().toString(36).substr(2, 9)}`,
    taskId: id,
    userId: req.user.id,
    username: user ? user.name : req.user.username,
    text,
    createdAt: new Date().toISOString()
      };

  db.addComment(newComment);

  // Broadcast the new comment to all SSE clients
  broadcast('COMMENT_ADDED', newComment);

  res.status(201).json(newComment);
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Task Management API listening on port ${PORT}`);
});
