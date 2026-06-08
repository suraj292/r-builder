import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import SessionLocal
from app.models.seo import SEOConfig
from app.models.visibility import VisibilityConfig
from app.models.user import User, UserRole
from app.models.system import SystemSettings
from app.core.security import get_password_hash

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

        # 1.1 Seed Common Public Pages for Sitemap
        public_pages = [
            {"path": "/", "title": "ResumeBP - AI-Powered Resume Builder", "priority": "1.0", "changefreq": "daily"},
            {"path": "/pricing", "title": "Pricing Plans - ResumeBP", "priority": "0.9", "changefreq": "weekly"},
            {"path": "/about", "title": "About Us - ResumeBP", "priority": "0.7", "changefreq": "monthly"},
            {"path": "/contact", "title": "Contact Us - ResumeBP", "priority": "0.7", "changefreq": "monthly"},
            {"path": "/faq", "title": "Frequently Asked Questions - ResumeBP", "priority": "0.8", "changefreq": "weekly"},
            {"path": "/ats-checker", "title": "Free ATS Resume Checker - ResumeBP", "priority": "0.9", "changefreq": "weekly"},
            {"path": "/blog", "title": "Career Advice Blog - ResumeBP", "priority": "0.9", "changefreq": "daily"},
            {"path": "/legal/privacy", "title": "Privacy Policy - ResumeBP", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/legal/terms", "title": "Terms of Service - ResumeBP", "priority": "0.5", "changefreq": "monthly"},
            {"path": "/legal/refund-policy", "title": "Refund Policy - ResumeBP", "priority": "0.5", "changefreq": "monthly"},
        ]

        for page in public_pages:
            res = await db.execute(select(SEOConfig).where(SEOConfig.path == page["path"]))
            existing = res.scalars().first()
            if not existing:
                print(f"Creating SEO config for {page['path']}...")
                new_config = SEOConfig(
                    path=page["path"],
                    title=page["title"],
                    description=f"Professional {page['title']} page for ResumeBP.",
                    include_in_sitemap=True,
                    sitemap_priority=page["priority"],
                    sitemap_changefreq=page["changefreq"]
                )
                db.add(new_config)

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
                "phone": "+91 7042611736",
                "address": "Global Operations",
                "city": "Remote",
                "country": "Worldwide"
            },
            "social_links": {
                "facebook": "https://www.facebook.com/profile.php?id=61590475776900",
                "instagram": "https://www.instagram.com/resumebp/",
                "linkedin": "https://www.linkedin.com/company/resumebp/",
                "twitter": "https://twitter.com/resumebp",
                "youtube": "https://www.youtube.com/@ResumeBP-ai",
                "github": "https://github.com/resumebp",
                "pinterest": "https://pinterest.com/resumebp",
                "tiktok": "https://tiktok.com/@resumebp",
                "og_image": "https://resumebp.com/api/v1/visibility/og-image?title=ResumeBP&subtitle=AI-Powered Career Success"
            },
            "google_settings": {
                "ga4_measurement_id": "G-Q9FFYDH8YC",
                "search_console_tag": "pending",
                "google_business_url": "",
                "google_maps_url": ""
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

        # 3. Seed/Update Super Admin User
        user_res = await db.execute(select(User).where(User.email == "surajkumarsharma123@gmail.com"))
        user = user_res.scalars().first()

        hashed_password = get_password_hash("Shreya@123")

        user_data = {
            "email": "surajkumarsharma123@gmail.com",
            "hashed_password": hashed_password,
            "full_name": "Suraj Sharma",
            "phone_number": "7042611736",
            "role": UserRole.SUPER_ADMIN,
        }

        if not user:
            print("Creating Super Admin user...")
            user = User(**user_data)
            db.add(user)
        else:
            print("Updating existing Super Admin user...")
            for key, value in user_data.items():
                setattr(user, key, value)

        # 4. Seed/Update Global System Settings
        sys_res = await db.execute(select(SystemSettings).limit(1))
        sys_config = sys_res.scalars().first()

        sys_data = {
            "project_name": "ResumeBP",
            "site_domain": "resumebp.com",
            "site_logo": "https://resumebp.com/logo.png",
            "site_icon": "https://resumebp.com/favicon.ico",
            "contact_email": "support@resumebp.com",
            "contact_phone": "+91 7042611736",
            "contact_address": "Remote, Global Operations",
            "social_links": {
                "facebook": "https://www.facebook.com/profile.php?id=61590475776900",
                "twitter": "https://twitter.com/resumebp",
                "linkedin": "https://www.linkedin.com/company/resumebp/",
                "instagram": "https://www.instagram.com/resumebp/"
            },
            "maintenance_mode": False,
            "allow_new_registrations": True
        }

        if not sys_config:
            print("Initializing Global System Settings...")
            sys_config = SystemSettings(**sys_data)
            db.add(sys_config)
        else:
            print("Updating existing System Settings...")
            for key, value in sys_data.items():
                setattr(sys_config, key, value)

        # 5. Seed default plans
        from app.models.subscription import Plan, SubscriptionTier
        
        default_plans = [
            {
                "tier_code": SubscriptionTier.FREE,
                "name": "Free",
                "price_monthly": 0,
                "price_yearly": 0,
                "regional_prices": {
                    "INR": {
                        "monthly": 0,
                        "yearly": 0
                    },
                    "EUR": {
                        "monthly": 0,
                        "yearly": 0
                    }
                },
                "features": {
                    "ai_credits": 20,
                    "ats_scans": 3,
                    "resume_limit": 2,
                    "cover_letters": 1,
                    "premium_templates": False,
                    "pdf_download": True,
                    "docx_download": False,
                    "linkedin_optimizer": False,
                    "job_match_analysis": False,
                    "interview_preparation": False,
                    "resume_versions": 2,
                    "priority_support": False
                },
                "is_active": True
            },
            {
                "tier_code": SubscriptionTier.PRO,
                "name": "Pro",
                "price_monthly": 500,
                "price_yearly": 4900,
                "regional_prices": {
                    "INR": {
                        "monthly": 14900,
                        "yearly": 149900
                    },
                    "EUR": {
                        "monthly": 500,
                        "yearly": 4900
                    }
                },
                "features": {
                    "ai_credits": 300,
                    "ats_scans": 50,
                    "resume_limit": 25,
                    "cover_letters": 25,
                    "premium_templates": True,
                    "pdf_download": True,
                    "docx_download": True,
                    "linkedin_optimizer": True,
                    "job_match_analysis": True,
                    "interview_preparation": False,
                    "resume_versions": 25,
                    "priority_support": True,
                    "advanced_ats_analysis": False,
                    "cover_letter_generator": False,
                    "job_description_matcher": False
                },
                "is_active": True
            },
            {
                "tier_code": SubscriptionTier.CAREER_PLUS,
                "name": "Career+",
                "price_monthly": 900,
                "price_yearly": 9900,
                "regional_prices": {
                    "INR": {
                        "monthly": 39900,
                        "yearly": 399900
                    },
                    "EUR": {
                        "monthly": 9900,
                        "yearly": 900
                    }
                },
                "features": {
                    "ai_credits": 1000,
                    "ats_scans": 200,
                    "resume_limit": 100,
                    "cover_letters": 100,
                    "premium_templates": True,
                    "pdf_download": True,
                    "docx_download": True,
                    "linkedin_optimizer": True,
                    "job_match_analysis": True,
                    "interview_preparation": True,
                    "resume_versions": 100,
                    "priority_support": True,
                    "dedicated_support": True,
                    "advanced_ats_analysis": False,
                    "cover_letter_generator": False,
                    "job_description_matcher": False
                },
                "is_active": True
            }
        ]

        for p_data in default_plans:
            res = await db.execute(select(Plan).where(Plan.tier_code == p_data["tier_code"]))
            existing_plan = res.scalars().first()
            if not existing_plan:
                print(f"Creating subscription plan: {p_data['name']}...")
                new_plan = Plan(**p_data)
                db.add(new_plan)
            else:
                print(f"Updating subscription plan: {p_data['name']}...")
                for key, val in p_data.items():
                    setattr(existing_plan, key, val)

        await db.commit()
        print("Seeding/Update completed successfully!")

if __name__ == "__main__":
    asyncio.run(seed_defaults())
