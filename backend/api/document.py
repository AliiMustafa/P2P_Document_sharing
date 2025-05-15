from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from service import facades
from models.schemas.custom_oauth_bearer import get_current_user
from models.schemas.document import DocumentResponse
from models import User
from typing import List
from pathlib import Path
from fastapi.responses import FileResponse


router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await facades.upload_document(db, file, user)

@router.get("/download/")
async def download_document_by_p2p_id(
    p2p_id: str,
    db: AsyncSession = Depends(get_db),
):
    document = await facades.get_document_by_p2p_id(db, p2p_id)
    if not document:
        raise HTTPException(status_code=404, detail="No document found for this p2p_id")

    file_path = Path(document.path)
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=file_path,
        filename=document.filename,
        media_type="application/octet-stream"
    )