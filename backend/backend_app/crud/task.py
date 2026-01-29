from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlalchemy import select, asc, desc
from sqlalchemy.orm import Session

from backend_app.models.task import Task, TaskPriority, TaskStatus


SORT_COLUMNS = {
    "created_at": Task.created_at,
    "due_date": Task.due_date,
    "priority": Task.priority,
}


def create_task(
    db: Session,
    *,
    title: str,
    priority: TaskPriority,
    due_date: datetime,
    description: Optional[str] = None,
    user_id: UUID,
) -> Task:
    task = Task(
        title=title,
        priority=priority,
        due_date=due_date,
        description=description,
        status=TaskStatus.todo,
        user_id=user_id,
    )

    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def get_tasks(
    db: Session,
    *,
    user_id: UUID,
    limit: int = 20,
    offset: int = 0,
    status: Optional[TaskStatus] = None,
    priority: Optional[TaskPriority] = None,
    sort: str = "created_at",
    order: str = "desc",
) -> list[Task]:
    stmt = select(Task).where(Task.user_id == user_id)

    if status is not None:
        stmt = stmt.where(Task.status == status)

    if priority is not None:
        stmt = stmt.where(Task.priority == priority)

    column = SORT_COLUMNS.get(sort)
    if column is None:
        raise ValueError(f"Invalid sort field: {sort}")

    order_by = desc(column) if order == "desc" else asc(column)
    stmt = stmt.order_by(order_by).limit(limit).offset(offset)

    return db.execute(stmt).scalars().all()


def get_task_for_user(
    db: Session,
    *,
    task_id: UUID,
    user_id: UUID,
) -> Optional[Task]:
    stmt = select(Task).where(
        Task.id == task_id,
        Task.user_id == user_id,
    )
    return db.execute(stmt).scalar_one_or_none()


def update_task(
    db: Session,
    *,
    task: Task,
    title: Optional[str] = None,
    priority: Optional[TaskPriority] = None,
    due_date: Optional[datetime] = None,
    description: Optional[str] = None,
    status: Optional[TaskStatus] = None,
) -> Task:
    if title is not None:
        task.title = title
    if priority is not None:
        task.priority = priority
    if due_date is not None:
        task.due_date = due_date
    if description is not None:
        task.description = description
    if status is not None:
        task.status = status

    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, *, task: Task) -> None:
    db.delete(task)
    db.commit()


def mark_task_done(db: Session, *, task: Task) -> Task:
    return update_task(db, task=task, status=TaskStatus.done)
