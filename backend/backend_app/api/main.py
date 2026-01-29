from typing import Optional, Literal
from uuid import UUID

from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend_app.api.dependencies import get_db
from backend_app.crud.task import (
    get_tasks,
    create_task,
    get_task_by_id,
    update_task,
    delete_task,
)
from backend_app.api.auth import router as auth_router
from backend_app.models.task import TaskStatus, TaskPriority
from backend_app.schemas.task import TaskCreate, TaskRead, TaskUpdate
from backend_app.core.auth import get_current_user
from backend_app.models.user import User


app = FastAPI(title="Task Manager API")

app.include_router(auth_router)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/tasks", response_model=list[TaskRead])
def read_tasks(
    *,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    status: Optional[TaskStatus] = None,
    priority: Optional[TaskPriority] = None,
    sort: Literal["created_at", "due_date", "priority"] = "created_at",
    order: Literal["asc", "desc"] = "desc"
):

    return get_tasks(
        db,
        limit=limit,
        offset=offset,
        status=status,
        priority=priority,
        sort=sort,
        order=order
    )


@app.post("/tasks", response_model=TaskRead)
def create_task_endpoint(
    task_in: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_task(
        db,
        title=task_in.title,
        priority=task_in.priority,
        due_date=task_in.due_date,
        description=task_in.description,
        user_id=current_user.id,
    )


@app.get("/tasks/{task_id}", response_model=TaskRead)
def read_task(task_id: UUID, db: Session = Depends(get_db)):
    task = get_task_by_id(db, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.patch("/tasks/{task_id}", response_model=TaskRead)
def update_task_endpoint(
    task_id: UUID,
    task_in: TaskUpdate,
    db: Session = Depends(get_db),
):
    task = get_task_by_id(db, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    return update_task(
        db,
        task=task,
        title=task_in.title,
        priority=task_in.priority,
        due_date=task_in.due_date,
        description=task_in.description,
        status=task_in.status,
    )


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task_endpoint(task_id: UUID, db: Session = Depends(get_db)) -> None:
    task = get_task_by_id(db, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    delete_task(db, task=task)
    return None
