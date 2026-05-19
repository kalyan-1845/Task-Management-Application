import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

// Initialize database with default template
const initialDb = {
  users: [],
  tasks: [],
  comments: []
};

// Seed default data helper
const seedDefaultData = async (db) => {
  if (db.users.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const demoPasswordHash = await bcrypt.hash('password123', salt);
    
    const demoUser = {
      id: 'usr_demo123',
      username: 'demo',
      email: 'demo@example.com',
      name: 'Alex Carter',
      passwordHash: demoPasswordHash,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
      createdAt: new Date().toISOString()
    };
    db.users.push(demoUser);

    const initialTasks = [
      {
        id: 'tsk_1',
        title: 'Design Premium Dashboard UI',
        description: 'Create a gorgeous glassmorphism dashboard layout with responsive CSS and dark mode aesthetic.',
        status: 'todo',
        priority: 'high',
        category: 'Work',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
        createdBy: 'usr_demo123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'tsk_2',
        title: 'Integrate SSE for Real-Time Updates',
        description: 'Implement Server-Sent Events (SSE) to broadcast real-time task modifications to all active clients.',
        status: 'inprogress',
        priority: 'medium',
        category: 'Work',
        dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0], // 4 days from now
        createdBy: 'usr_demo123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'tsk_3',
        title: 'Plan Weekly Groceries',
        description: 'Buy organic greens, almond milk, proteins, and healthy snacks for meal prep.',
        status: 'done',
        priority: 'low',
        category: 'Shopping',
        dueDate: new Date().toISOString().split('T')[0], // today
        createdBy: 'usr_demo123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'tsk_4',
        title: 'Morning Yoga and Mindfulness',
        description: 'Start the day with a 20-minute flow and 5 minutes of focused breathing exercise.',
        status: 'todo',
        priority: 'low',
        category: 'Health & Fitness',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
        createdBy: 'usr_demo123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    db.tasks.push(...initialTasks);

    const initialComments = [
      {
        id: 'cmt_1',
        taskId: 'tsk_2',
        userId: 'usr_demo123',
        username: 'Alex Carter',
        text: 'Working on establishing the SSE connections. Testing event streaming payloads.',
        createdAt: new Date().toISOString()
      }
    ];
    db.comments.push(...initialComments);
  }
};

class JSONDatabase {
  constructor() {
    this.data = { ...initialDb };
    this.read();
  }

  read() {
    try {
      if (fs.existsSync(DB_PATH)) {
        const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        this.write();
      }
    } catch (error) {
      console.error('Error reading JSON database, resetting to empty', error);
      this.data = { ...initialDb };
    }
  }

  write() {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing to JSON database', error);
    }
  }

  async seed() {
    await seedDefaultData(this.data);
    this.write();
  }

  // Users CRUD
  getUsers() {
    return this.data.users;
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  getUserByUsername(username) {
    return this.data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  addUser(user) {
    this.data.users.push(user);
    this.write();
    return user;
  }

  // Tasks CRUD
  getTasks() {
    return this.data.tasks;
  }

  getTaskById(id) {
    return this.data.tasks.find(t => t.id === id);
  }

  addTask(task) {
    this.data.tasks.push(task);
    this.write();
    return task;
  }

  updateTask(id, updatedFields) {
    const idx = this.data.tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;

    this.data.tasks[idx] = {
      ...this.data.tasks[idx],
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };
    this.write();
    return this.data.tasks[idx];
  }

  deleteTask(id) {
    const idx = this.data.tasks.findIndex(t => t.id === id);
    if (idx === -1) return false;

    this.data.tasks.splice(idx, 1);
    
    // Also remove comments related to the task
    this.data.comments = this.data.comments.filter(c => c.taskId !== id);
    
    this.write();
    return true;
  }

  // Comments CRUD
  getCommentsByTaskId(taskId) {
    return this.data.comments.filter(c => c.taskId === taskId);
  }

  addComment(comment) {
    this.data.comments.push(comment);
    this.write();
    return comment;
  }
}

const dbInstance = new JSONDatabase();
// Run async seeding
dbInstance.seed().then(() => {
  console.log('JSON Database initialized and seeded.');
});

export default dbInstance;
