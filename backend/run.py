from fastapi import FastAPI
from database import engine, Base
import uvicorn
from api.document import router as document_router
from api.auth import router as auth_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(document_router)


@app.on_event("startup")
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    uvicorn.run("run:app", host="0.0.0.0", port=8000, reload=True)