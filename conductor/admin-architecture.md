# ResumeAI: Enterprise Admin Ecosystem & Backend Architecture

This document outlines the production-grade backend management ecosystem, admin architecture, and deployment strategy for the AI-powered Resume Builder SaaS platform. 

Designed for massive scale, extensibility, and modern SaaS standards (comparable to Canva, Notion, and Stripe).

---

## 1. SCALABLE MONOREPO STRUCTURE (Architecture Foundation)

To support a sprawling SaaS with an end-user app, an admin dashboard, and shared packages, a **Turborepo** (or npm workspaces) monorepo structure is highly recommended.

```text
resume-ai-monorepo/
├── apps/
│   ├── web/                 # Main Next.js/Vite app (Landing, Builder, User Auth)
│   ├── admin/               # React 19 Admin Dashboard (Internal tools)
│   └── api/                 # FastAPI Backend (Core business logic)
├── packages/
│   ├── ui/                  # Shared UI components (shadcn/ui + Tailwind v4)
│   ├── editor/              # Shared drag-drop editor core & block registry
│   ├── schema/              # Shared Zod/Pydantic schemas (Types, validations)
│   ├── tsconfig/            # Shared TypeScript configs
│   └── eslint-config/       # Shared linting rules
├── docker/                  # Dockerfiles & Compose for local dev/prod
└── turbo.json               # Monorepo orchestration
```

---

## 2. ADMIN DASHBOARD ARCHITECTURE

The Admin Dashboard (`apps/admin`) is an independent React 19 SPA communicating with a protected set of FastAPI routes (`/api/v1/admin/*`).

### Routing & Component Structure
- `/dashboard` - High-level metrics (MRR, active users, AI generations)
- `/users` - User management, impersonation, billing history
- `/resumes` - Resume moderation, template analytics
- `/templates` - Visual template builder, JSON schema editor, category mapping
- `/ai` - Prompt engineering, provider fallbacks, ATS rule tuning
- `/content` - Headless CMS integration for Blogs, FAQs
- `/settings` - Global system settings, feature flags

### Permissions System
- Handled via JWT claims (`role: 'super_admin'`).
- UI dynamically hides routes based on `useAuthStore().role`.

---

## 3. ADMIN UI/UX DESIGN

Inspired by Stripe, Vercel, and Supabase.

- **Layout**: Collapsible left sidebar navigation, top bar with breadcrumbs and user profile.
- **Command Palette**: `⌘ + K` to quick-search users, jump to templates, or execute admin actions (using `cmdk`).
- **Data Tables**: Built with **TanStack Table v8**. Supports infinite scroll, server-side pagination, column pinning, and bulk actions.
- **State Management**: **Zustand** for local dashboard state (sidebar toggle, current filters).
- **Theme**: Forced Light/Dark mode toggle. Tailwind CSS v4 using CSS variables for a clean, minimal aesthetic (zinc/slate color palette).

---

## 4. DATABASE MANAGEMENT STRATEGY

**Recommendation: Directus + Supabase**

- **PostgreSQL Hosting**: **Supabase** or **Neon**. Both offer incredible serverless Postgres scaling.
- **Raw DB Management UI**: **Supabase Studio** (if using Supabase) is unbeatable for raw SQL queries, RLS testing, and table management.
- **Internal Tooling / Backoffice**: **Directus**. 
  - *Why?* Directus attaches perfectly to an existing SQL database. It provides an instant, beautiful, no-code data browser for your backend tables. It prevents you from having to build CRUD screens for *everything* in your custom React Admin app.

---

## 5. CMS ARCHITECTURE

**Recommendation: Directus (Headless CMS)**

Instead of building a custom CMS from scratch or wrestling with Markdown files, use **Directus** side-by-side with your FastAPI backend on the same PostgreSQL database.

- **Architecture**: 
  - FastAPI owns: Users, Resumes, Subscriptions, AI logic.
  - Directus owns: Blogs, FAQs, Pricing Configurations, Policies.
- **Editing Workflow**: Content managers use the Directus App to write rich text/markdown. 
- **Publishing**: Directus exposes a REST/GraphQL API. The `apps/web` frontend fetches published posts directly from Directus or caches them via Next.js/Vite SSG.

---

## 6. ROLE-BASED ACCESS CONTROL (RBAC)

**DB Schema Structure:**
```sql
CREATE TYPE admin_role AS ENUM ('super_admin', 'admin', 'content_manager', 'support', 'template_designer');

ALTER TABLE users ADD COLUMN role admin_role DEFAULT 'user';
```

**FastAPI Middleware Strategy:**
```python
def RequireRole(required_roles: list[str]):
    async def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in required_roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return Depends(role_checker)

@router.get("/admin/users", dependencies=[RequireRole(["super_admin", "admin", "support"])])
```

---

## 7. ANALYTICS SYSTEM

- **Backend Aggregation**: Use **PostgreSQL Materialized Views** to aggregate daily metrics (e.g., resumes generated per day, AI token usage) to avoid heavy analytical queries on live transactional tables.
- **Frontend Visualization**: **Recharts** for beautiful, responsive area/bar/line charts in the React Admin dashboard.
- **Product Analytics**: Integrate **PostHog** for user behavior tracking (funnel drops, button clicks on the resume builder).

---

## 8. AI MANAGEMENT SYSTEM

To avoid hardcoding prompts, store them in the DB.

**Schema:**
- `ai_prompts`: `id`, `identifier` (e.g., `resume_summary_v1`), `system_prompt`, `user_prompt_template`, `model_name`, `temperature`, `is_active`.
- `ai_providers`: Configure OpenAI, Gemini, Claude endpoints and priority (fallback mechanism).
- `ai_usage_logs`: Track tokens used per user per day for rate-limiting and billing.

**Admin UI**: A dedicated prompt playground in the admin dashboard to test prompts against sample resume data before setting them to `is_active = True`.

---

## 9. TEMPLATE MANAGEMENT SYSTEM

- **Template Registry**: Templates are not hardcoded components; they are JSON configurations stored in PostgreSQL.
- **Admin Capabilities**:
  - **Visual Editor**: Template designers use a special internal version of the builder to compose layouts.
  - **Publishing**: Draft -> Review -> Published workflow.
  - **Premium Flags**: Toggle `is_premium` boolean on specific templates to instantly lock them behind the paywall.

---

## 10. USER MANAGEMENT SYSTEM

**Admin Tools:**
- **Search & Filter**: Find users by email, Stripe Customer ID, or role.
- **Impersonation**: Securely generate an impersonation JWT to log into the main app *as* the user (crucial for debugging support tickets).
- **Credit Adjustment**: Manually add or revoke AI generation credits.
- **Audit Logs**: Track who (which admin) modified a user's account.

---

## 11. PAYMENT + SUBSCRIPTION MANAGEMENT

**Strategy:** Stripe as the primary source of truth.
- **Integration**: FastAPI Stripe Webhook receiver updates the `users.is_premium` flag and `subscriptions` table.
- **Architecture**: 
  - `subscriptions` table: `user_id`, `stripe_sub_id`, `plan_id`, `status` (active, canceled, past_due), `current_period_end`.
- **Admin View**: Show MRR, Churn rate, and a direct link to the user's Stripe Customer Portal in the dashboard.

---

## 12. FILE STORAGE ARCHITECTURE

**Recommendation: Cloudflare R2**
- *Why?* S3-compatible, significantly cheaper than AWS S3, and **zero egress fees**. Perfect for serving millions of profile photos, exported PDF resumes, and template thumbnails.
- **Integration**: FastAPI uses `boto3` or `aioboto3` pointing to the R2 endpoint to generate Pre-signed Upload URLs. The React frontend uploads directly to R2, bypassing the FastAPI server for large file streams.

---

## 13. DEVOPS + DEPLOYMENT

**Production Architecture:**
- **Frontend (Web & Admin)**: **Vercel**. Provides automatic CDN edge caching, PR preview deployments, and optimal Vite/Next.js support.
- **Backend (FastAPI)**: **Railway** or **Render**. Dockerized container deployment. Auto-scales based on CPU/Memory.
- **Database**: **Neon.tech** (Serverless Postgres). Separates compute and storage, allowing for branching databases (perfect for staging environments).
- **Caching/Queue**: **Upstash Redis** for Celery/RQ task queues (e.g., background PDF generation, bulk emails).

---

## 14. MONITORING + LOGGING

- **Error Tracking**: **Sentry** (integrated in React frontends and FastAPI middleware).
- **Analytics & Feature Flags**: **PostHog**.
- **Log Aggregation**: **Axiom** or **Datadog** (via Railway/Render log drains).
- **Uptime Monitoring**: **BetterStack** (pinging the `/health` endpoint).

---

## 15. BEST UI LIBRARIES

For the Admin & Web Apps:
- **Component Primitives**: **shadcn/ui** (Accessible, copy-paste components).
- **Tables**: **TanStack Table v8** (Headless UI for massive data tables).
- **Forms & Validation**: **React Hook Form** + **Zod**.
- **Charts**: **Recharts** or **Tremor** / **Shadcn Charts**.
- **Command Palette**: **cmdk**.
- **Notifications**: **Sonner** (Toast notifications).
- **Drag & Drop**: **dnd-kit** (For the resume builder and admin list reordering).

---

## 16. SECURITY ARCHITECTURE

- **Authentication**: JWTs with short expirations (15 mins) and HTTP-only HttpOnly secure cookies for refresh tokens.
- **API Security**: FastAPI `Slowapi` or Redis-based rate limiting to prevent AI credit abuse.
- **CORS/CSRF**: Strict `BACKEND_CORS_ORIGINS` in FastAPI. 
- **Secure Uploads**: Pre-signed URLs for file uploads. Backend validates file types (mime) and sizes before granting upload URLs.
- **Audit Logging**: Every mutating action in the Admin API logs to an `audit_logs` table (`admin_id`, `action`, `target_id`, `timestamp`).

---

## 17. FUTURE ROADMAP PREPARATION

The architecture supports:
- **Collaborative Editing**: Because the builder is block-schema driven, moving to CRDTs (like **Yjs**) and WebSockets (via FastAPI WebSockets or Socket.io) is a natural evolution.
- **Workspaces/Teams**: The DB should be designed with a `tenant_id` or `workspace_id` from day one, even if every workspace currently only has 1 user.
- **White-label / Agency Mode**: Custom domains can be supported via Vercel's Edge APIs, linking a custom domain to a specific `workspace_id`.
