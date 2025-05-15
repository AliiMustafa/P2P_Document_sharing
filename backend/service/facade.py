import random
from typing import List
from sqlalchemy.util import await_only
from persistance.repository import P2P_Repository
from sqlalchemy.ext.asyncio import AsyncSession
from models import User, Document
from models.schemas.custom_oauth_bearer import CustomOAuthBearer
from utils.password import hash_password, verify_password
from utils.token import create_access_token
from datetime import timedelta
from fastapi import HTTPException, UploadFile
from models.schemas.auth import SignupResponse, LoginResponse, SignupRequest
from sqlalchemy.future import select
from sqlalchemy.exc import NoResultFound
from sqlalchemy import select
import aiofiles
import os
import uuid

UPLOAD_DIR = "uploads"

class P2PRepositoryFacade:
    def __init__(self):
        self.p2p_repo = P2P_Repository()

    async def signup(self, db:AsyncSession, data: SignupRequest) -> SignupResponse:
        user = await db.execute(select(User).filter(User.username == data.username))
        user = user.scalars().first()
        if user:
            raise HTTPException(status_code=400, detail="User already exists")

        hashed_password = hash_password(data.password)
        new_user = await self.p2p_repo.create(db, User, username=data.username, email=data.email, password=hashed_password)
        return SignupResponse(msg="User created successfully", user_id=new_user.id)

    async def login(self, db:AsyncSession, formdata: CustomOAuthBearer) -> LoginResponse:
        user = await db.execute(select(User).filter(User.username == formdata.username))
        user = user.scalars().first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        if not verify_password(formdata.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        access_token_expires = timedelta(minutes=30)
        access_token = await create_access_token(
            data={"sub": user.id, "username": user.username}, expires_delta=access_token_expires
        )

        return LoginResponse(access_token=access_token, token_type="bearer")
    

    async def upload_document(self, db: AsyncSession, file: UploadFile, user: User) -> Document:
        filename = f"{uuid.uuid4()}_{file.filename}"
        path = os.path.join(UPLOAD_DIR, filename)


        if not os.path.exists(UPLOAD_DIR):
            os.makedirs(UPLOAD_DIR)


        async with aiofiles.open(path, "wb") as out_file:
            content = await file.read()
            await out_file.write(content)


        document = await self.p2p_repo.create(
            db, Document, filename=file.filename, path=path, owner_p2p_id=user.p2p_id
        )

        return document
    
    
    async def get_document_by_p2p_id(self, db: AsyncSession, doc_id: str) -> Document:
        result = await db.execute(select(Document).filter(Document.owner_p2p_id == doc_id))
        document = result.scalars().first()
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        return document

