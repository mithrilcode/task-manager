from typing import Generator

from sqlalchemy.orm import Session

from backend_app.database.session import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a SQLAlchemy session.

    - One session per request
    - Automatically closed after request completes
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
