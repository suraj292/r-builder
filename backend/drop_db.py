import asyncio
import sys
import os

# Add the current directory to sys.path to allow importing from app
sys.path.append(os.getcwd())

from sqlalchemy.ext.asyncio import create_async_engine
from app.models import Base
from app.config import settings

async def drop_tables():
    print(f"Connecting to {settings.DATABASE_URL}...")
    try:
        engine = create_async_engine(settings.DATABASE_URL)
        async with engine.begin() as conn:
            print("Dropping all tables...")
            await conn.run_sync(Base.metadata.drop_all)
        await engine.dispose()
        print("All tables dropped successfully.")
    except Exception as e:
        print(f"Error dropping tables: {e}")

if __name__ == "__main__":
    asyncio.run(drop_tables())
