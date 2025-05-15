from pydantic import BaseModel
from typing import List, Optional

class DocumentResponse(BaseModel):
    id: str
    filename: str
    owner_p2p_id: str

    class Config:
        orm_mode = True

class DocumentsListResponse(BaseModel):
    documents: List[DocumentResponse]
