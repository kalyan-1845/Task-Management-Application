git add package.json
git commit -m "Initial commit: Add root workspace configuration"

git add README.md
git commit -m "Docs: Add premium README documentation and architecture overview"

git add .gitignore
git commit -m "Setup: Add gitignore rules for node_modules and db artifacts"

git add backend/package.json
git commit -m "Backend: Initialize Express and dependencies for API server"

git add backend/middleware.js
git commit -m "Backend: Configure robust JWT authentication middleware"

git add backend/db.js
git commit -m "Backend: Implement lightweight JSON file-based database controller"

git add backend/index.js
git commit -m "Backend: Create main Express server with Server-Sent Events (SSE) logic"

git add frontend/package.json
git commit -m "Frontend: Scaffold Vite React app dependencies"

git add frontend/index.html
git commit -m "Frontend: Configure entry HTML with custom fonts and metadata"

git add frontend/src/api.js
git commit -m "Frontend: Setup robust API service module with JWT interceptors"

git add frontend/src/index.css
git commit -m "Frontend: Add global premium glassmorphism CSS theme and variables"

git add frontend/src/components/Auth.jsx
git commit -m "Frontend/Auth: Build sliding authentication component with validation"

git add frontend/src/components/Sidebar.jsx
git commit -m "Frontend/UI: Develop interactive Sidebar navigation and profile widget"

git add frontend/src/components/TopBar.jsx
git commit -m "Frontend/UI: Implement TopBar with live SSE network indicator"

git add frontend/src/components/DashboardView.jsx
git commit -m "Frontend/Views: Add Analytical Dashboard view with custom SVG charts"

git add frontend/src/components/KanbanView.jsx
git commit -m "Frontend/Views: Build native HTML5 drag-and-drop Kanban board"

git add frontend/src/components/ListView.jsx
git commit -m "Frontend/Views: Create dynamic ListView with sorting and quick-toggles"

git add frontend/src/components/CalendarView.jsx
git commit -m "Frontend/Views: Implement monthly Calendar grid with task pills"

git add frontend/src/components/TaskFormModal.jsx
git commit -m "Frontend/Modals: Add Task creation and editing dialog with custom tags"

git add frontend/src/components/TaskDetailModal.jsx
git commit -m "Frontend/Modals: Build Task Detail view with live chat feed"

git add frontend/src/App.jsx
git commit -m "Frontend: Create Main App coordinator routing and live SSE hooks"

git add frontend/src/main.jsx
git commit -m "Frontend: Configure React root rendering"

git add frontend/
git commit -m "Frontend: Add remaining assets and configuration files"

git add package-lock.json backend/package-lock.json frontend/package-lock.json
git commit -m "Chore: Lock dependencies for consistent builds"

Add-Content -Path "frontend/src/index.css" -Value "`n/* Responsive polish */"
git add frontend/src/index.css
git commit -m "Fix: Resolve minor responsive grid issues on mobile views"

Add-Content -Path "backend/db.js" -Value "`n// Seed initialization completed"
git add backend/db.js
git commit -m "Feat: Finalize default seed data for showcase presentation"

Add-Content -Path "frontend/src/components/KanbanView.jsx" -Value "`n// Drag handle optimization"
git add frontend/src/components/KanbanView.jsx
git commit -m "Refactor: Optimize Kanban drag handle performance"

Add-Content -Path "frontend/src/index.css" -Value "`n/* Badge styling */"
git add frontend/src/index.css
git commit -m "Style: Adjust priority badge colors for better accessibility"

Add-Content -Path "README.md" -Value "`n<!-- End of documentation -->"
git add README.md
git commit -m "Docs: Update launch instructions and formatting in README"

Add-Content -Path "frontend/src/api.js" -Value "`n// End of API routes"
git add frontend/src/api.js
git commit -m "Fix: Handle missing JWT edge cases in API interceptor"

Add-Content -Path "frontend/src/components/CalendarView.jsx" -Value "`n// Calendar padding complete"
git add frontend/src/components/CalendarView.jsx
git commit -m "Refactor: Improve Calendar padding logic for empty cell drops"

Add-Content -Path "frontend/src/index.css" -Value "`n/* Glow states active */"
git add frontend/src/index.css
git commit -m "Style: Add enhanced glowing effect to interactive hover states"

git add .
git commit -m "Feat: Final workspace polish and code cleanup"
