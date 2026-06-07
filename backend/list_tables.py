import asyncio
from sqlalchemy import text
from app.db.session import SessionLocal

async def list_tables():
    async with SessionLocal() as db:
        result = await db.execute(text("SHOW TABLES"))
        tables = [row[0] for row in result.all()]
        print(f"Tables: {tables}")

if __name__ == "__main__":
    asyncio.run(list_tables())
