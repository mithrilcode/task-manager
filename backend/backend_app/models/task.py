import uuid
from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import (
    Column,
    DateTime,
    Enum as SQLEnum,
    String,
    Text,
    ForeignKey
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend_app.database.base import Base

class TaskPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class TaskStatus(str, Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False,
    )

    title = Column(
        String(255),
        nullable=False,
    )

    priority = Column(
        SQLEnum(TaskPriority, name="task_priority"),
        nullable=False,
    )

    due_date = Column(
        DateTime(timezone=True),
        nullable=False,
    )

    description = Column(
        Text,
        nullable=True,
    )

    status = Column(
        SQLEnum(TaskStatus, name="task_status"),
        nullable=False,
        default=TaskStatus.todo,
    )

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    user = relationship(
        "User",
        back_populates="tasks",
    )

