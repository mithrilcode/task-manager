# Task Manager

A full-stack **Task Manager** application built as a learning-focused, production-style project.

This repository emphasizes:
- clean architecture
- explicit database modeling
- proper migrations
- secure authentication
- clear separation of concerns
- real-world backend + frontend workflows

The goal is to rebuild fluency with **Python backend development** and modern **React frontend development** while following industry best practices.

---

## 🧱 Project Structure

This repository uses a **monorepo** layout:

task-manager/
├── backend/
│ ├── backend_app/
│ │ ├── api/
│ │ ├── core/
│ │ ├── crud/
│ │ ├── database/
│ │ ├── models/
│ │ ├── schemas/
│ │ └── api/main.py
│ ├── migrations/
│ ├── alembic.ini
│ └── tests/
├── frontend/
│ ├── src/
│ ├── index.html
│ ├── package.json
│ └── vite.config.ts
├── .env.example
├── .gitignore
└── README.md


---

## 🛠️ Technology Stack

### Backend
- Python 3.12+
- FastAPI
- PostgreSQL 16
- SQLAlchemy 2.x
- Alembic (migrations)
- psycopg (PostgreSQL driver)
- Pydantic v2
- JWT authentication (python-jose, passlib)

### Frontend
- Node.js (LTS)
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios (planned)
- localStorage-based auth persistence

---

## 🧠 Core Concepts Used

- SQLAlchemy ORM (2.x style)
- UUID primary keys
- Enum-based domain modeling
- UTC timestamps
- Database migrations (Alembic)
- JWT authentication & authorization
- Task ownership enforcement
- Non-superuser database roles
- Environment-based configuration
- Monorepo workflow

---

## 🗄️ Database Setup (PostgreSQL)

This project uses **PostgreSQL 16** with a **dedicated, non-superuser role**, following least-privilege best practices.

---

### 1️⃣ Install PostgreSQL

Install **PostgreSQL 16** for your operating system and ensure the database service is running.

Verify installation:
```bash
psql --version
```

### 2️⃣ Create the Development Database

Log into PostgreSQL as a superuser (usually postgres):
```bash
psql -U postgres
```

Create the database:
```sql
CREATE DATABASE task_manager_dev;
```

### 3️⃣ Create a Dedicated Application Role
```sql
CREATE ROLE task_manager_user
WITH LOGIN
PASSWORD 'your_password_here';
```

### 4️⃣ Grant Required Permissions
```sql
GRANT ALL PRIVILEGES ON DATABASE task_manager_dev TO task_manager_user;
GRANT USAGE, CREATE ON SCHEMA public TO task_manager_user;
```

### 5️⃣ Verify Access
```bash
psql -U task_manager_user -d task_manager_dev
```

Expected prompt:
```text
task_manager_dev=>
```

## 🔐 Environment Configuration
Create a .env file in the project root using .env.example as a reference.
```dotenv
SECRET_KEY=your_secret_key_here
DB_USER=task_manager_user
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_manager_dev
```

##🐍 Backend Setup & Running the API

### 1️⃣ Create and Activate Virtual Environment
From the project root:
```bash
python -m venv .venv
```
Activate it:
```bash
.venv\Scripts\activate
```
### 2️⃣ Install Dependencies
```bash
pip install -r requirements.txt
```

### 3️⃣ Run Database Migrations

From backend/:

```bash
alembic upgrade head
```

### 4️⃣ Start the API Server

From backend/:
```bash
uvicorn backend_app.api.main:app --reload
```

API will be available at:
```arduino
http://127.0.0.1:8000
```

Docs:
```arduino
http://127.0.0.1:8000/docs
```

## ⚛️ Frontend Setup & Running Vite

### 1️⃣ Install Node.js

Install Node.js LTS from:
https://nodejs.org

Verify: 
```bash
node -v
npm -v
```

### 2️⃣ Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3️⃣ Start the Frontend Dev Server
```bash
npm run dev
```
Frontend will be available at:
```arduino
http://localhost:5173
```

## 🔮 Roadmap

- Frontend authentication flow

- Task CRUD UI

- User profiles

- Sub-tasks

- Improved filtering & sorting

- Deployment

## 🧪 Status

🚧 Actively developed   
✅ Backend API functional  
🟢 Frontend scaffolded