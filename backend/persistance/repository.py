from abc import ABC, abstractmethod
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select


class BaseRepository(ABC):
    @abstractmethod
    async def create(self, db: AsyncSession, model, **kwargs):
        pass

    @abstractmethod
    async def get(self, db: AsyncSession, model, object_id: str):
        pass

    @abstractmethod
    async def update(self, db: AsyncSession, model, object_id: str, **kwargs):
        pass

    @abstractmethod
    async def delete(self, db: AsyncSession, model, object_id: str):
        pass

    async def get_all(self, db: AsyncSession, model):
        pass


class P2P_Repository(BaseRepository):
    async def create(self, db: AsyncSession, model, **kwargs):
        obj = model(**kwargs)
        db.add(obj)
        await db.commit()
        await db.refresh(obj)
        return obj

    async def get(self, db: AsyncSession, model, object_id: str):
        result = await db.execute(select(model).where(model.id == object_id))
        return result.scalars().first()

    async def update(self, db: AsyncSession, model, object_id: str, **kwargs):
        db_obj = await self.get(db, model, object_id)

        if db_obj:
            for key, value in kwargs.items():
                setattr(db_obj, key, value)
            await db.commit()
            await db.refresh(db_obj)
            return db_obj
        return None

    async def delete(self, db: AsyncSession, model, object_id: str):
        db_obj = await self.get(db, model, object_id)

        if db_obj:
            await db.delete(db_obj)
            await db.commit()
            return db_obj
        return None

    async def get_all(self, db: AsyncSession, model):
        result = await db.execute(select(model))
        return result.scalars().all()


