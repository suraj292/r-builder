import asyncio
from sqlalchemy import text
from app.db.session import SessionLocal

async def fix():
    async with SessionLocal() as db:
        await db.execute(text("UPDATE coupons SET used_count_total = 0 WHERE used_count_total IS NULL"))
        await db.commit()
        print("Fixed null used_count_total values.")

if __name__ == "__main__":
    asyncio.run(fix())
