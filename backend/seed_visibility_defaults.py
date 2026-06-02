import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import SessionLocal
from app.models.seo import SEOConfig
from app.models.visibility import VisibilityConfig

async def seed_defaults():
    async with SessionLocal() as db:
        # 1. Seed Global Default SEO (__default__)
        res = await db.execute(select(SEOConfig).where(SEOConfig.path == "__default__"))
        default_seo = res.scalars().first()
        
        if not default_seo:
            print("Creating Global Default SEO configuration...")
            default_seo = SEOConfig(
                path="__default__",
                title="resumebp - The Ultimate AI-Powered Career Platform",
                description="Create professional, ATS-optimized resumes in seconds with resumebp. Enhance your career with AI discovery, SEO optimization, and smart templates.",
                keywords="resume builder, ai resume, ats resume, career growth, job search",
                is_indexed=True,
                is_followed=True,
                og_title="resumebp - AI-Powered Career Excellence",
                og_description="Build your future with AI. The smartest resume builder on the market.",
                twitter_card="summary_large_image",
                include_in_sitemap=False, # Global defaults shouldn't be in sitemap
                sitemap_priority="0.5",
                sitemap_changefreq="monthly",
                custom_schema={
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "resumebp",
                    "url": "https://resumebp.com",
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": "https://resumebp.com/search?q={search_term_string}",
                        "query-input": "required name=search_term_string"
                    }
                }
            )
            db.add(default_seo)
        else:
            print("Global Default SEO already exists.")

        # 2. Seed Initial Visibility Config
        res = await db.execute(select(VisibilityConfig).limit(1))
        vis_config = res.scalars().first()
        
        if not vis_config:
            print("Initializing Global Visibility Configuration...")
            vis_config = VisibilityConfig(
                business_info={
                    "business_name": "resumebp",
                    "brand_name": "resumebp",
                    "website_url": "https://resumebp.com",
                    "description": "resumebp is a leading career technology platform using Generative AI to bridge the gap between talent and opportunity.",
                    "email": "support@resumebp.com",
                    "phone": "+917042611736",
                    "address": "Gurugram, Haryana",
                    "city": "Gurugram",
                    "country": "India"
                },
                social_links={
                    "facebook": "https://facebook.com/resumebp",
                    "instagram": "https://instagram.com/resumebp",
                    "linkedin": "https://linkedin.com/company/resumebp",
                    "twitter": "https://twitter.com/resumebp",
                    "github": "https://github.com/resumebp"
                },
                google_settings={
                    "ga4_measurement_id": "G-DEMO123",
                    "search_console_tag": "google-demo-verification-tag"
                },
                trust_center={
                    "google_stars": True,
                    "secure_checkout": True,
                    "guarantee": True
                }
            )
            db.add(vis_config)
        else:
            print("Global Visibility Configuration already exists.")

        await db.commit()
        print("Seeding completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_defaults())
