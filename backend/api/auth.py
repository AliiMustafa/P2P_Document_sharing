from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from service import facades
from database import get_db
from models.schemas.auth import SignupRequest, SignupResponse, LoginResponse
from models.schemas.custom_oauth_bearer import CustomOAuthBearer

router = APIRouter(tags=["Authentication"])

@router.post("/signup", response_model=SignupResponse)
async def signup(data: SignupRequest, db: AsyncSession = Depends(get_db)):
    return await facades.signup(db, data)

@router.post("/login", response_model=LoginResponse)
async def login(formdata: CustomOAuthBearer = Depends(), db: AsyncSession = Depends(get_db)):
    return await facades.login(db, formdata)