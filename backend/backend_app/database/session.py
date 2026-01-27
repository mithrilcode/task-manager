from sqlalchemy.orm import sessionmaker
from backend_app.database.engine import engine

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)
