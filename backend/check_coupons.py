import asyncio
from sqlalchemy import select
from app.db.session import SessionLocal
from app.models.coupon import Coupon

async def check():
    async with SessionLocal() as db:
        stmt = select(Coupon)
        result = await db.execute(stmt)
        coupons = result.scalars().all()
        print(f"Coupons in DB: {coupons}")

if __name__ == "__main__":
    asyncio.run(check())
