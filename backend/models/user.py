from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from models.basemodel import BaseModel
from typing import List
import uuid

class User(BaseModel):
    __tablename__ = "users"

    username = Column(String(100), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    password = Column(String(100), nullable=False)
    p2p_id = Column(String(36), unique=True, default=lambda: str(uuid.uuid4()))
    is_admin = Column(Boolean, default=False, nullable=False)