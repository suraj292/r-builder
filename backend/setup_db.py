import asyncio
import sys
import os

# Add the current directory to sys.path to allow importing from app
sys.path.append(os.getcwd())

from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.models import Base
from app.config import settings

async def setup_db():
    # Connect to MySQL without a database to create it if it doesn't exist
    # format: mysql+aiomysql://user:pass@host:port/
    db_url_base = settings.DATABASE_URL.rsplit('/', 1)[0] + '/'
    db_name = settings.DATABASE_URL.rsplit('/', 1)[1]
    
    print(f"Connecting to MySQL at {db_url_base} to ensure database '{db_name}' exists...")
    try:
        engine = create_async_engine(db_url_base)
        async with engine.connect() as conn:
            await conn.execute(text(f"CREATE DATABASE IF NOT EXISTS {db_name}"))
            await conn.commit()
        await engine.dispose()
        print(f"Database '{db_name}' is ready.")

        # Now connect to the specific database to drop/create tables
        engine = create_async_engine(settings.DATABASE_URL)
        async with engine.begin() as conn:
            print("Dropping all tables...")
            await conn.run_sync(Base.metadata.drop_all)
            print("Creating all tables...")
            await conn.run_sync(Base.metadata.create_all)
        await engine.dispose()
        print("Schema setup completed successfully.")
    except Exception as e:
        print(f"Error during database setup: {e}")

if __name__ == "__main__":
    asyncio.run(setup_db())
