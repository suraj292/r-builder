# Visibility Management Platform - Architecture Diagram

```mermaid
graph TD
    User((Website Owner)) --> AdminDashboard[Admin Panel]
    
    subgraph Growth_Visibility_Modules
        AdminDashboard --> Module1[Visibility Settings]
        AdminDashboard --> Module2[SEO Center]
        AdminDashboard --> Module3[AI Discovery Center]
        AdminDashboard --> Module4[Schema Manager]
        AdminDashboard --> Module5[Google Management]
        AdminDashboard --> Module6[Social Media]
        AdminDashboard --> Module7[Search Engines]
        AdminDashboard --> Module8[Analytics Center]
        AdminDashboard --> Module9[Content Optimizer]
        AdminDashboard --> Module10[AI Content Studio]
        AdminDashboard --> Module11[Trust Center]
        AdminDashboard --> Module12[Site Audit]
        AdminDashboard --> Module15[Executive Dashboard]
    end
    
    subgraph Backend_Services
        Module10 --> BlogAIService[AI Content Engine]
        Module9 --> BlogAIService
        Module12 --> AuditEngine[Audit Engine]
        Module7 --> SitemapService[Sitemap Service]
    end
    
    subgraph Database
        VisibilityConfig[(VisibilityConfig Table)]
        SiteAudit[(SiteAudit Table)]
        SEOConfig[(SEOConfig Table)]
        SystemSettings[(SystemSettings Table)]
    end
    
    Module1 & Module5 & Module6 & Module11 --> VisibilityConfig
    Module2 & Module4 & Module7 --> SEOConfig
    Module12 --> SiteAudit
    
    subgraph Public_Site
        SEOConfig --> SEOHead[SEOHead Component]
        VisibilityConfig --> SEOHead
        SEOHead --> MetaTags[Meta / OG / Twitter Tags]
        SEOHead --> JSONLD[JSON-LD Schemas]
        SEOHead --> Tracking[GA4 / Search Console]
    end
```

# Database Schema
- **visibility_configs**: Unified storage for business info, social links, google settings, trust badges, and branding using JSON fields.
- **site_audits**: Historical tracking of site audits with detailed issues and scores.
- **seo_configs**: Route-specific SEO metadata and custom schemas.

# Admin Navigation
- **Growth & Visibility** (Divider)
  - Executive Dashboard
  - Visibility Settings
  - SEO Center
  - Schema Manager
  - Google Management
  - Social Media
  - Analytics Center
  - AI Discovery
  - Content Optimizer
  - AI Content Studio
  - Search Engines
  - Trust Center
  - Site Audit

# Deployment Checklist
- [x] Run Alembic migrations: `alembic upgrade head`
- [x] Register new API routers in `main.py`
- [x] Build frontend assets
- [x] Verify `SEOHead` is receiving visibility config from public endpoint
- [x] Test AI generation with valid API keys

# PASS / FAIL Report
1.  **Module 1 - Visibility Settings**: PASS
2.  **Module 2 - SEO Management Dashboard**: PASS
3.  **Module 3 - AI Discovery Center**: PASS
4.  **Module 4 - Structured Data Manager**: PASS
5.  **Module 6 - Social Media Management**: PASS
6.  **Module 7 - Sitemap & Indexing**: PASS
7.  **Module 8 - Analytics Center**: PASS
8.  **Module 9 - Content Optimizer**: PASS
9.  **Module 10 - AI Content Studio**: PASS
10. **Module 11 - Website Trust Center**: PASS
11. **Module 12 - Automated Site Audit**: PASS
12. **Module 13 - Header & Footer Management**: PASS
13. **Module 15 - Executive Dashboard**: PASS
14. **Production Ready & TypeScript**: PASS
15. **Responsive UI**: PASS
