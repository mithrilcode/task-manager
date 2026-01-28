from datetime import datetime
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from backend_app.api.dependencies import get_db
from backend_app.crud.task import get_tasks, create_task
from backend_app.models.task import TaskPriority

app = FastAPI(title="Task Manager API")


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/tasks")
def read_tasks(db: Session = Depends(get_db)):
    tasks = get_tasks(db)
    return tasks


@app.post("/tasks")
def create_task_endpoint(
        *,
        title: str,
        priority: TaskPriority,
        due_date: datetime,
        description: str | None = None,
        db: Session = Depends(get_db),
):
    task = create_task(
        db,
        title=title,
        priority=priority,
        due_date=due_date,
        description=description,
    )
    return task