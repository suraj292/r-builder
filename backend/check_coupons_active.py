import asyncio
from sqlalchemy import text
from app.db.session import SessionLocal

async def check():
    async with SessionLocal() as db:
        result = await db.execute(text("SELECT code, is_active FROM coupons"))
        rows = result.all()
        for r in rows:
            print(r)

if __name__ == "__main__":
    asyncio.run(check())
