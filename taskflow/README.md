# TaskFlow — MERN Task Management Dashboard

A full-stack task management app built with MongoDB, Express, React, and Node.js.

## Features
- JWT authentication (register/login)
- Kanban board with 4 columns (To Do, In Progress, Review, Done)
- Create, update, delete tasks
- Priority levels, tags, due dates, assignees
- Progress tracking per task
- List view + board view
- Protected API routes

## Quick Start

### 1. Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 2. Configure environment
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Run both servers
```bash
# From root
cd server && npm run dev   # Terminal 1 → http://localhost:5000
cd client && npm start     # Terminal 2 → http://localhost:3000
```

## Project Structure
```
taskflow/
├── server/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/User.js
│   ├── models/Task.js
│   ├── models/Project.js
│   ├── routes/auth.js
│   ├── routes/tasks.js
│   ├── routes/projects.js
│   ├── .env.example
│   └── index.js
└── client/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── styles/
    └── public/
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create task |
| PATCH | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| GET | /api/projects | Get projects |
| POST | /api/projects | Create project |

## Tech Stack
- **MongoDB** + Mongoose
- **Express.js** + JWT auth
- **React** + Context API + React Router
- **Node.js**
- **Axios** for HTTP requests
- **@dnd-kit** for drag and drop
