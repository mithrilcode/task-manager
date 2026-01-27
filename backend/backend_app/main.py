from backend_app.database.base import Base
import backend_app.models  # noqa: F401

print(Base.metadata.tables.keys())


