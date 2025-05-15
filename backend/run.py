import asyncio
from fastapi import FastAPI
from backend.database import engine, Base


app = FastAPI()

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(create_tables())
    uvicorn.run("run:app", host="0.0.0.0", port=8000, reload=True)