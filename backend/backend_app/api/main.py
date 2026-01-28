from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from backend_app.api.dependencies import get_db
from backend_app.crud.task import get_tasks, create_task, get_task_by_id, update_task, delete_task
from backend_app.schemas.task import TaskCreate, TaskRead, TaskUpdate

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


@app.get("/tasks/{task_id}", response_model=TaskRead)
def read_task(task_id: UUID, db: Session = Depends(get_db)):
    task = get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.patch("/tasks/{task_id}", response_model=TaskRead)
def update_task_endpoint(
    task_id: UUID,
    task_in: TaskUpdate,
        db: Session = Depends(get_db),
):
    task = get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    updated = update_task(
        db,
        task=task,
        title=task_in.title,
        priority=task_in.priority,
        due_date=task_in.due_date,
        description=task_in.description,
        status=task_in.status,
    )
    return updated


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task_endpoint(task_id: UUID, db: Session = Depends(get_db)):
    task = get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    delete_task(db, task=task)
    return None
