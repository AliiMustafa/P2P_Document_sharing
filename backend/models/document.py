from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from models.basemodel import BaseModel
from typing import List

class Document(BaseModel):
    __tablename__ = "documents"

    filename = Column(String(255))
    path = Column(String(255))
    owner_p2p_id = Column(String(36), ForeignKey("users.p2p_id"))

    owner = relationship("User", backref="documents")