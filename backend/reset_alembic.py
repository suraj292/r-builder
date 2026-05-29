import asyncio
from sqlalchemy import text
from app.db.session import SessionLocal

async def reset_alembic():
    async with SessionLocal() as db:
        await db.execute(text("UPDATE alembic_version SET version_num = '2c817b7b8f35'"))
        await db.commit()
    print("Reset alembic version to 2c817b7b8f35")

if __name__ == "__main__":
    asyncio.run(reset_alembic())
