from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from backend.config import Config

engine = create_async_engine(Config.SQLALCHEMY_DATABASE_URL, echo=True)

SessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)

Base = declarative_base()

async def get_db():
    async with SessionLocal() as db:
        yield db