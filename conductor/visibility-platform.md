# Visibility Management Platform - Implementation Plan

## Background & Motivation
The objective is to build a centralized Visibility Management Platform that enhances the website's discoverability across search engines (Google) and AI systems (ChatGPT, Gemini, Claude, Perplexity). This platform will encompass 15 modules to manage SEO, Social Media, Google integrations, Analytics, Content Generation, and Site Auditing.

## Scope & Impact
*   **Database:** Introduction of a unified JSON-based `VisibilityConfig` table, and potentially a `SiteAudit` tracking table. Extension of existing `SystemSettings` and `SEOConfig`.
*   **Backend API:** New endpoints for managing the visibility settings, running site audits, generating schema, analyzing content, and aggregating dashboard data.
*   **Frontend Admin:** Extensive additions to the admin sidebar and creation of 15 modular views/dashboards.
*   **Global Impact:** These settings will dictate global meta tags, JSON-LD schema, tracking scripts, and social graph data injected into the frontend `SEOHead` and layout.

## Proposed Solution: Unified JSON Config Approach
Based on the selected architectural approach, we will use a unified database schema leveraging JSONB (or JSON) fields to store flexible configuration settings for Analytics, Social, AI, and Google, while keeping strict routing-based SEO rules in `SEOConfig`.

### 1. Database Schema Additions
**New Table: `visibility_configs`**
*   `id` (PK)
*   `business_info` (JSON) - Brand name, description, address, emails, phones.
*   `social_links` (JSON) - Facebook, X, LinkedIn, Instagram, etc.
*   `google_settings` (JSON) - GA4 ID, GSC tags, GBP URLs.
*   `ai_discovery` (JSON) - Target AI schemas, readiness toggles.
*   `trust_center` (JSON) - Badges, default testimonials/reviews logic.

**New Table: `site_audits`**
*   `id` (PK)
*   `timestamp` (DateTime)
*   `overall_score` (Integer)
*   `seo_score`, `ai_score`, `perf_score` (Integer)
*   `issues` (JSON) - Array of findings.

### 2. Admin Navigation Structure
A new section in the Admin Sidebar: **Growth & Visibility**
*   **Executive Dashboard** (Module 15)
*   **Settings & Branding**
    *   Visibility Settings (Module 1)
    *   Branding (Header/Footer) (Module 13)
*   **SEO & Structure**
    *   SEO Center (Module 2)
    *   Schema Manager (Module 4)
    *   Search Engines (Sitemap/Indexing) (Module 7)
*   **AI & Content**
    *   AI Discovery (Module 3)
    *   Content Optimizer (Module 9)
    *   AI Content Studio (Module 10)
*   **Integrations**
    *   Google Management (Module 5)
    *   Social Media (Module 6)
    *   Analytics Center (Module 8)
*   **Health & Trust**
    *   Site Audit (Module 12)
    *   Trust Center (Module 11)
    *   Performance Center (Module 14)

## Phased Implementation Plan

### Phase 1: Database & Core API Foundation
*   Create SQLAlchemy models for `VisibilityConfig` and `SiteAudit`.
*   Generate Alembic migrations.
*   Create CRUD API endpoints (`/v1/admin/visibility/*`).
*   Update frontend API service library.

### Phase 2: Core Admin Settings (Modules 1, 5, 6, 13)
*   Build UI for Visibility Settings (business data).
*   Build UI for Google Management (GA4, GSC setup).
*   Build UI for Social Media Management.
*   Build UI for Branding.
*   **Integration:** Update `SEOHead.tsx` to pull and inject GA4 scripts and global social data.

### Phase 3: SEO & Structure (Modules 2, 4, 7)
*   Enhance existing SEO Management Dashboard with health scores and bulk updates.
*   Build Schema Manager UI to visually create/inject JSON-LD.
*   Build Search Engines UI for Robots.txt editing and Sitemap generation controls.

### Phase 4: AI & Content (Modules 3, 9, 10)
*   Build AI Discovery Center UI to track schema/entity coverage.
*   Build Content Optimizer UI (using `BlogAIService` to analyze specific page content).
*   Build AI Content Studio UI for generating blog posts and metadata directly from the admin.

### Phase 5: Analytics, Trust, Performance & Master Dashboard (Modules 8, 11, 12, 14, 15)
*   Build Analytics Center UI (fetching metrics from a basic tracker or GA4 API).
*   Build Trust Center UI for managing client logos and reviews.
*   Build Automated Site Audit UI (triggering a backend python task to check all pages).
*   Build Performance Center UI.
*   Build Executive Dashboard (aggregating scores from all modules).

## Verification & Final Output
Upon completing the phases, the system will be validated against the 11-point Final Output list provided in the requirements, including architecture diagrams, documentation, and a PASS/FAIL report.