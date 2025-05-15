from sqlalchemy import Column, DateTime, String
import uuid
from datetime import datetime, UTC
from database import Base

class BaseModel(Base):
    __abstract__ = True

    id = Column(String(36), primary_key=True, unique=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=lambda: datetime.now(UTC), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC), nullable=False)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not hasattr(self, "id") or self.id is None:
            self.id = str(uuid.uuid4())
        self.created_at = datetime.now(UTC)
        self.updated_at = datetime.now(UTC)