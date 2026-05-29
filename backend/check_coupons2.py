import asyncio
from sqlalchemy import select
from app.db.session import SessionLocal
from app.models.coupon import Coupon

async def check():
    async with SessionLocal() as db:
        stmt = select(Coupon)
        result = await db.execute(stmt)
        coupons = result.scalars().all()
        for c in coupons:
            print(f"Code: {c.code}, Discount: {c.discount_percent}, Max Uses Total: {c.max_uses_total}, Per User: {c.per_user_limit}")

if __name__ == "__main__":
    asyncio.run(check())
