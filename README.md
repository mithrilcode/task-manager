# Task Manager

A full-stack Task Manager application built as a learning-focused, production-style project.

This repository emphasizes:
- clean architecture
- explicit database modeling
- proper migrations
- secure configuration practices

The goal is to rebuild fluency with Python backend development while following real-world best practices.

---

## 🧱 Project Structure

This repository uses a **monorepo** layout:

task-manager/
├── backend/
│ ├── backend_app/
│ │ ├── database/
│ │ │ ├── base.py
│ │ │ ├── engine.py
│ │ │ └── session.py
│ │ ├── models/
│ │ │ └── task.py
│ │ ├── main.py
│ │ └── init.py
│ ├── migrations/
│ │ ├── env.py
│ │ ├── versions/
│ │ └── script.py.mako
│ ├── alembic.ini
│ └── tests/
├── .env.example
├── .gitignore
└── README.md

---

## 🛠️ Technology Stack

### Backend
- Python 3.12
- PostgreSQL 16
- SQLAlchemy 2.x
- Alembic
- psycopg (PostgreSQL driver)

### Frontend (planned)
- React

---

## 🧠 Core Concepts Used

- SQLAlchemy ORM with modern Declarative Base
- UUID primary keys
- Enum-based domain modeling
- UTC timestamps
- Database migrations (Alembic)
- Non-superuser database roles
- Environment-based configuration

---

## 🗄️ Database Setup (PostgreSQL)

This project uses **PostgreSQL 16** with a **dedicated, non-superuser role**, following least-privilege best practices.

---

### 1️⃣ Install PostgreSQL

Install **PostgreSQL 16** for your operating system and ensure the database service is running.

Verify the installation:

```bash
psql --version
```

### 2️⃣ Create the Development Database

Log into PostgreSQL as a superuser (usually postgres):
```bash
psql -U postgres
```

Create the development database:
```bash
CREATE DATABASE task_manager_dev;
```

### 3️⃣ Create a Dedicated Application Role

Create a non-superuser role for the application:
```sql
CREATE ROLE task_manager_user
WITH LOGIN
PASSWORD 'your_password_here';
```

This role is used only by the application.

### 4️⃣ Grant Database Permissions

Grant access to the database:
```sql
GRANT ALL PRIVILEGES ON DATABASE task_manager_dev TO task_manager_user;
```

Grant schema permissions (required for Alembic migrations):
```sql
GRANT USAGE, CREATE ON SCHEMA public TO task_manager_user;
```

### 5️⃣ Verify Access

Exit psql and reconnect using the application role:
```bash
psql -U task_manager_user -d task_manager_dev
```

If successful, you should see:
```ini
task_manager_dev=>
```
