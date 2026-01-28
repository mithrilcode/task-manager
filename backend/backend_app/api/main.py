from datetime import datetime
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from backend_app.api.dependencies import get_db
from backend_app.crud.task import get_tasks, create_task
from backend_app.schemas.task import TaskCreate, TaskRead

app = FastAPI(title="Task Manager API")


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/tasks", response_model=list[TaskRead])
def read_tasks(db: Session = Depends(get_db)):
    return get_tasks(db)


@app.post("/tasks", response_model=TaskRead)
def create_task_endpoint(
    task_in: TaskCreate,
    db: Session = Depends(get_db),
):
    task = create_task(
        db,
        title=task_in.title,
        priority=task_in.priority,
        due_date=task_in.due_date,
        description=task_in.description,
    )
    return task
