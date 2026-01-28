from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from backend_app.models.task import TaskPriority, TaskStatus


class TaskCreate(BaseModel):
    title: str
    priority: TaskPriority
    due_date: datetime
    description: Optional[str] = None


class TaskRead(BaseModel):
    id: UUID
    title: str
    priority: TaskPriority
    status: TaskStatus
    due_date: datetime
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
