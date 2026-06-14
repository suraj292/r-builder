import asyncio
from sqlalchemy.future import select
from app.db.session import SessionLocal
from app.models.visibility import VisibilityConfig

async def get_google_config():
    async with SessionLocal() as db:
        result = await db.execute(select(VisibilityConfig).limit(1))
        config = result.scalars().first()
        if config:
            print("Google Settings:", config.google_settings)
        else:
            print("No VisibilityConfig found.")

if __name__ == "__main__":
    asyncio.run(get_google_config())
