import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import SessionLocal
from app.models.seo import SEOConfig
from app.models.visibility import VisibilityConfig

async def seed_defaults():
    async with SessionLocal() as db:
        # 1. Update/Seed Global Default SEO (__default__)
        res = await db.execute(select(SEOConfig).where(SEOConfig.path == "__default__"))
        default_seo = res.scalars().first()
        
        seo_data = {
            "path": "__default__",
            "title": "ResumeBP - AI-Powered Resume Builder | Get Hired Faster",
            "description": "Build a professional, ATS-optimized resume in minutes with ResumeBP. Our AI-driven platform helps you land your dream job with smart templates and career optimization tools.",
            "keywords": "resume builder, ai resume, ats optimizer, career growth, ResumeBP, online cv maker",
            "is_indexed": True,
            "is_followed": True,
            "og_title": "ResumeBP: Your Future, AI-Optimized",
            "og_description": "Create a world-class resume in seconds. ATS-friendly, professional, and powered by the latest AI.",
            "og_image": "https://resumebp.com/api/v1/visibility/og-image?title=ResumeBP&subtitle=AI-Powered Career Success",
            "twitter_card": "summary_large_image",
            "include_in_sitemap": False,
            "sitemap_priority": "0.5",
            "sitemap_changefreq": "monthly",
            "custom_schema": {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "ResumeBP",
                "operatingSystem": "Web",
                "applicationCategory": "CareerApplication",
                "offers": {
                    "@type": "Offer",
                    "price": "0.00",
                    "priceCurrency": "USD"
                }
            }
        }

        if not default_seo:
            print("Creating Global Default SEO configuration...")
            default_seo = SEOConfig(**seo_data)
            db.add(default_seo)
        else:
            print("Updating existing Global Default SEO...")
            for key, value in seo_data.items():
                setattr(default_seo, key, value)

        # 2. Update/Seed Global Visibility Config
        res = await db.execute(select(VisibilityConfig).limit(1))
        vis_config = res.scalars().first()
        
        vis_data = {
            "business_info": {
                "business_name": "ResumeBP AI Solutions",
                "brand_name": "ResumeBP",
                "website_url": "https://resumebp.com",
                "description": "ResumeBP is a premier AI career platform dedicated to helping job seekers maximize their potential through high-performance resume building and AI-driven job discovery.",
                "email": "support@resumebp.com",
                "phone": "+1 (555) RESUME-BP",
                "address": "Global Operations",
                "city": "Remote",
                "country": "Worldwide"
            },
            "social_links": {
                "facebook": "https://facebook.com/resumebp",
                "instagram": "https://instagram.com/resumebp",
                "linkedin": "https://linkedin.com/company/resumebp",
                "twitter": "https://twitter.com/resumebp",
                "github": "https://github.com/resumebp",
                "og_image": "https://resumebp.com/api/v1/visibility/og-image?title=ResumeBP&subtitle=AI-Powered Career Success"
            },
            "google_settings": {
                "ga4_measurement_id": "G-RESUMEBPR",
                "search_console_tag": "pending"
            },
            "trust_center": {
                "google_stars": True,
                "secure_checkout": True,
                "guarantee": True
            }
        }

        if not vis_config:
            print("Initializing Global Visibility Configuration...")
            vis_config = VisibilityConfig(**vis_data)
            db.add(vis_config)
        else:
            print("Updating existing Visibility Configuration...")
            for key, value in vis_data.items():
                setattr(vis_config, key, value)

        await db.commit()
        print("Seeding/Update completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_defaults())
