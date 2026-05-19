# 🌌 Vortex Tasks — Premium Full-Stack Real-Time Workspace

Welcome to **Vortex Tasks**, an ultra-premium, high-performance task management application developed inside your `assign 2` folder. 

Vortex Tasks is a complete full-stack web application implementing secure JWT-based user authentication, standard CRUD task operations, collaborative commentary, and native **Server-Sent Events (SSE)** for zero-latency, real-time UI synchronization across all connected dashboards.

---

## 🏗️ Full-Stack System Architecture

The application is structured into three unified tiers, orchestrated concurrently from your root workspace:

- **Vite + React Frontend (Port 5173)**: Built with elegant Vanilla CSS, featuring custom glassmorphism design, SVG dashboards, HTML5 drag-and-drop Kanban lanes, list sorts, and month-by-month calendar controls.
- **Express Node.js Backend (Port 5000)**: Serves REST API CRUD paths, secures routes with JSON Web Token (JWT) verification, and manages connection pools for SSE real-time broadcasts.
- **Local JSON Storage**: Persists data locally into `backend/db.json` with secure hashed user registrations (`bcryptjs`).

---

## ⚡ SSE (Server-Sent Events) Real-Time Sync Engine

Instead of relying on heavy WebSocket wrappers or resource-intensive REST polling, Vortex Tasks utilizes native browser **Server-Sent Events (SSE)**. 

When any client triggers a CRUD mutation (e.g. creating, editing, or deleting a task, or adding a comments log), the Express server broadcasts a payload to all connected streams. The client's event listener catches this and updates the React state hooks immediately, keeping everyone's workspace dashboards in absolute sync.

---

## 🚀 How to Launch the Application

Getting Vortex Tasks up and running takes less than 30 seconds:

### Step 1: Open a terminal inside the project root
Make sure your terminal is navigated to the workspace:
`c:\Users\prsnl\OneDrive\Desktop\assign 2`

### Step 2: Spin up both servers
Run the unified dev command:
```bash
npm run dev
```
> [!NOTE]
> This command uses `concurrently` to launch the API server (Port 5000) and the Vite React server (Port 5173) in a single shell.

### Step 3: Access your workspace
1. Open your browser and navigate to **`http://localhost:5173`**.
2. To skip registration, log in using the pre-seeded team account:
   * **Username**: `demo`
   * **Password**: `password123`
3. Open a second browser tab (or incognito window) side-by-side to witness real-time SSE syncing! Drag a task or post a comment in one tab and watch it instantly update in the other.

<!-- End of documentation -->
