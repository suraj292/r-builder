# Enterprise Blog Management Module Architecture

## 1. Background & Motivation
The platform requires a complete, enterprise-grade Blog Management Module comparable to WordPress in content management capabilities, but built natively within the existing modern stack (FastAPI + React). This module must be fast, scalable, heavily SEO-focused, and seamlessly integrate with the existing AI capabilities of the platform.

While previous architectural drafts suggested using a third-party headless CMS (like Directus) for blogs, the requirement for deep native integration—specifically regarding AI features (auto-tagging, SEO suggestions, outline generation) and a custom Drag & Drop content builder—necessitates a native implementation.

## 2. Scope & Impact
This module will impact both the internal **Admin Dashboard** and the **Public Frontend**.

**Admin Scope:**
- Comprehensive CRUD operations with draft/publish/schedule/archive states.
- Version history and revisions.
- Drag & Drop block-based content editor (reusing paradigms from the Resume Builder).
- Complete SEO metadata management.
- Centralized Media Library.
- AI Assistant integration for content generation and optimization.

**Public Scope:**
- Fast, SSR/SSG-ready (or highly optimized CSR) blog listing and detail pages.
- Category, Tag, and Author archives.
- Search and filtering.
- Dynamic XML sitemaps and structured data (Schema.org).

**Backend Scope (FastAPI):**
- New database tables: `posts`, `categories`, `tags`, `post_tag`, `media`, `post_revisions`.
- RESTful APIs for admin management and public consumption.
- Integration with AI services for content generation.
- Background tasks for scheduled publishing and image optimization.

## 3. Proposed Solution (FastAPI + React Stack)

### 3.1. Database Design (PostgreSQL / SQLAlchemy)
We will introduce a normalized schema for the blog module.
- `blog_posts`: `id`, `slug`, `title`, `excerpt`, `content_blocks` (JSONB), `status` (enum), `author_id`, `category_id`, `featured_image_id`, `published_at`, `seo_title`, `seo_description`, `seo_keywords`.
- `blog_categories`: `id`, `slug`, `name`, `parent_id`.
- `blog_tags`: `id`, `slug`, `name`.
- `blog_post_tags`: Association table.
- `blog_revisions`: `id`, `post_id`, `content_blocks` (JSONB), `created_at`.
- `media_library`: `id`, `file_path`, `alt_text`, `mime_type`, `size`.

### 3.2. Drag & Drop Content Builder (React)
Instead of a standard WYSIWYG editor (like TinyMCE), we will build a Block-Based Editor (similar to Notion or Gutenberg) using the existing architectural principles defined in `architecture.md`.
- **State:** Zustand store managing an array of blocks.
- **DnD:** `dnd-kit` for reordering blocks.
- **Block Types:** Heading, Paragraph, Image, Video Embed, Code Block, CTA, Divider.
- **Storage:** Saved as structured JSONB in the `content_blocks` column, parsed on the public frontend.

### 3.3. AI Integration
Leveraging the existing FastAPI AI infrastructure:
- **Endpoints:** `/api/v1/admin/blog/ai/generate-title`, `/api/v1/admin/blog/ai/generate-outline`, `/api/v1/admin/blog/ai/seo-suggestions`.
- **Functionality:** Admins can highlight text in the editor to "Rewrite" or "Improve Readability".

### 3.4. SEO & Performance
- **React Helmet / native meta tags:** Inject Open Graph, Twitter Cards, and canonical URLs on the public frontend.
- **FastAPI Sitemap Generator:** An endpoint `/sitemap-blog.xml` that queries published posts and generates dynamic XML.
- **Schema.org:** JSON-LD injection for `Article` and `BreadcrumbList`.

## 4. Alternatives Considered
- **Directus / Strapi:** Using a headless CMS. *Rejected* because deep AI integration into the editor workflow and sharing the media library/auth system with the core app is cleaner natively.
- **Laravel / Vue.js:** The original request. *Rejected* as the user approved adapting the requirements to the existing, invested FastAPI/React monorepo to maintain a single unified codebase.

## 5. Phased Implementation Plan

### Phase 1: Database & Core API (Backend)
1. Create SQLAlchemy models (`BlogPost`, `Category`, `Tag`, `Media`).
2. Generate Alembic migrations.
3. Build CRUD endpoints in `/api/v1/admin/blog/*` (Requires Admin Role).
4. Build public read-only endpoints in `/api/v1/public/blog/*`.

### Phase 2: Admin Media Library & Block Editor Foundation (Frontend)
1. Implement Media Library UI for uploading, deleting, and selecting images.
2. Scaffold the Block-Based Editor interface in `/admin/blog/create`.
3. Implement core blocks (Text, Heading, Image).

### Phase 3: Advanced Editor & AI Features
1. Add drag-and-drop reordering to the editor using `dnd-kit`.
2. Connect FastAPI AI endpoints to the editor for title/outline generation and SEO suggestions.
3. Implement post settings sidebar (Categories, Tags, Featured Image, SEO metadata, Slug).

### Phase 4: Public Frontend & SEO
1. Update `BlogListing.tsx` and `BlogDetail.tsx` to fetch live data from the FastAPI backend instead of the static `blog-data.ts`.
2. Implement Category and Tag archive views.
3. Add dynamic meta tag injection (React Helmet/Custom hook) for SEO.
4. Add `/api/v1/public/sitemap.xml` generation on the backend.

## 6. Verification
- **Backend:** Comprehensive PyTest coverage for all blog endpoints, including role-based access control.
- **Frontend:** Verify editor state persistence, block reordering, and image upload flows.
- **SEO Tools:** Run generated public pages through Google Lighthouse and Rich Results Testing Tool to verify structured data and Web Vitals.

## 7. Migration & Rollback
- Existing static blog data in `src/lib/blog-data.ts` will be seeded into the database via an initial migration script.
- Rollback involves reverting the Alembic migrations and restoring the static `blog-data.ts` imports in the frontend components.