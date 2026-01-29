from datetime import datetime, timezone
from enum import Enum
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Enum as SQLEnum

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

    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    priority: Mapped[TaskPriority] = mapped_column(
        SQLEnum(TaskPriority, name="task_priority"),
        nullable=False,
    )

    due_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    status: Mapped[TaskStatus] = mapped_column(
        SQLEnum(TaskStatus, name="task_status"),
        default=TaskStatus.todo,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="tasks",
    )
