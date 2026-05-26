# ResumeAI - System Architecture

This document outlines the technical architecture for the ResumeAI platform, mapping the existing React frontend to the proposed **FastAPI** backend.

## 1. Tech Stack Overview

### Frontend
*   **Core:** React 19, TypeScript
*   **Build Tool:** Vite
*   **Routing:** React Router v6
*   **Styling:** Tailwind CSS
*   **State Management:** Zustand (Recommended for Builder Workspace)

### Backend (Proposed)
*   **Core Framework:** FastAPI (Python 3.10+)
*   **Database:** PostgreSQL (Ideal for relational data + JSONB for resumes)
*   **ORM:** SQLAlchemy 2.0
*   **Data Validation:** Pydantic
*   **Authentication:** JWT (JSON Web Tokens) & Authlib (for OAuth/Google Login)
*   **AI Integration:** OpenAI Python SDK

---

## 2. Frontend Modules & Backend Mapping

Based on the frontend routing and UI, here is the feature mapping and the required FastAPI endpoints.

### 2.1 Authentication (`/auth`)
*Frontend:* `LoginSignup.tsx` (Email/Password & Social Login)

**FastAPI Endpoints:**
*   `POST /api/auth/register`: Create a new user account with email/password.
*   `POST /api/auth/login`: Authenticate and return JWT access & refresh tokens.
*   `GET /api/auth/google/login`: Redirect user to Google OAuth consent screen.
*   `GET /api/auth/google/callback`: Handle Google callback, verify token, and issue internal JWT.
*   `POST /api/auth/forgot-password`: Trigger password reset email (via SMTP/SendGrid).

### 2.2 User Dashboard (`/user`)
*Frontend:* `Profile.tsx`, `MyResumes.tsx`, `Checkout.tsx`

**FastAPI Endpoints:**
*   `GET /api/users/me`: Fetch current logged-in user details.
*   `PUT /api/users/me`: Update user profile details.
*   `GET /api/resumes`: List all resumes created by the user.
*   `POST /api/payments/checkout`: Generate a Stripe/Razorpay checkout session URL.
*   `POST /api/payments/webhook`: Webhook listener to automatically upgrade the user's account upon successful payment.

### 2.3 Builder Workspace (`/builder`)
*Frontend:* `Workspace.tsx`

**FastAPI Endpoints:**
*   `POST /api/resumes`: Create a new, blank resume.
*   `GET /api/resumes/{id}`: Fetch full resume data to load into the React editor.
*   `PUT /api/resumes/{id}`: Auto-save the resume. The payload should be a structured JSON object representing the resume state.
*   `DELETE /api/resumes/{id}`: Delete a resume.

### 2.4 Marketing & Features (`/`, `/ats-checker`, `/contact`)
*Frontend:* `Home.tsx`, `AtsChecker.tsx`, `Contact.tsx`

**FastAPI Endpoints:**
*   `POST /api/contact`: Accept contact form submissions and send an alert email to the admin.
*   `POST /api/ai/ats-score`: Accept Resume text and Job Description text. The backend calls the LLM (OpenAI) to generate an ATS score and suggestions, returning it to the frontend.
*   `POST /api/ai/generate-summary`: Accept user job title/skills, generate a professional summary using AI, and stream response back.

---

## 3. Database Schema Concept (PostgreSQL + SQLAlchemy)

### `users` table
*   `id` (UUID, Primary Key)
*   `email` (String, Unique)
*   `hashed_password` (String, Nullable for Google logins)
*   `auth_provider` (String - 'local' or 'google')
*   `plan_tier` (String - 'free', 'pro', 'premium')
*   `ai_credits` (Integer)
*   `created_at`, `updated_at`

### `resumes` table
*   `id` (UUID, Primary Key)
*   `user_id` (UUID, Foreign Key -> users.id)
*   `title` (String - e.g., "Software Engineer Draft")
*   `content` (JSONB) - *Stores the entire structured resume state from the frontend builder.*
*   `created_at`, `updated_at`

---

## 4. Key Implementation Details for FastAPI

1.  **CORS (Cross-Origin Resource Sharing):** 
    Ensure FastAPI is configured with `CORSMiddleware` to allow requests from your React development server (e.g., `http://localhost:5173`).
2.  **Dependencies (DI):** 
    Use FastAPI's Dependency Injection (`Depends()`) to verify JWT tokens on protected routes (like `/api/resumes`).
3.  **JSONB for Resumes:** 
    Because a resume structure changes often (adding a new skill, reordering experience), do not create strict relational tables for every single resume item (e.g., a table just for "Experience"). Instead, use PostgreSQL's `JSONB` column to store the whole resume state as one JSON block. This allows the frontend to have total control over the data structure while the backend simply saves and loads it.
4.  **Email Sending:** 
    Use `aiosmtplib` or `fastapi-mail` for non-blocking asynchronous email sending (for password resets and contact forms).
