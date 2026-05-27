# ResumeAI: Monetization & Subscription Architecture

This document defines the production-grade subscription, monetization, and feature access management system for the platform.

## 1. SUBSCRIPTION PLAN SYSTEM
The platform operates on a 3-tier model:

| Feature | FREE | PRO | CAREER+ |
| :--- | :--- | :--- | :--- |
| **Price** | $0/mo | $9/mo | $19/mo |
| **Templates** | Basic (4) | All Premium (20+) | Executive + Portfolios |
| **Resumes** | 1 | Unlimited | Unlimited |
| **ATS Scans** | 3 / month | Unlimited | Advanced Insights |
| **AI Credits** | 10 / month | 500 / month | Unlimited (Fair Use) |
| **Exports** | Watermarked PDF | No Watermark, Word, TXT | Analytics Tracking |

## 2. DATABASE SCHEMA (PostgreSQL)

### `plans`
Defines the available tiers.
- `id` (PK)
- `tier_code` ('free', 'pro', 'career_plus')
- `name` 
- `price_monthly`, `price_yearly`
- `razorpay_plan_id_monthly`, `razorpay_plan_id_yearly`
- `features` (JSONB) - Defines exact limits (e.g., `{"ai_credits": 500, "ats_scans": -1}`)

### `subscriptions`
Tracks active Razorpay subscriptions.
- `id` (PK)
- `user_id` (FK)
- `plan_id` (FK)
- `razorpay_subscription_id`
- `status` ('active', 'past_due', 'canceled', 'trialing')
- `current_period_start`
- `current_period_end`
- `cancel_at_period_end` (Boolean)

### `users` (Updates)
- `tier` (Enum: 'free', 'pro', 'career_plus') - Denormalized for fast access.
- `ai_credits_used` (Integer)
- `ats_scans_used` (Integer)
- `quota_reset_date` (DateTime)

## 3. FEATURE ACCESS CONTROL (Backend Middleware)

A centralized `FeatureGate` dependency in FastAPI checks limits before executing logic.

```python
async def check_feature_access(feature: str, cost: int = 1):
    async def _checker(user: User = Depends(get_current_user)):
        plan_limits = get_plan_limits(user.tier)
        
        # Check specific booleans
        if feature == "premium_templates" and not plan_limits.get("premium_templates_enabled"):
            raise HTTPException(403, "Upgrade required for premium templates")
            
        # Check quotas
        if feature == "ai_generation":
            if plan_limits.get("ai_credits") != -1 and (user.ai_credits_used + cost) > plan_limits.get("ai_credits"):
                raise HTTPException(402, "AI Credit limit reached. Please upgrade.")
                
        return True
    return _checker

# Usage:
@router.post("/ai/summary", dependencies=[Depends(check_feature_access("ai_generation", cost=1))])
```

## 4. TEMPLATE MONETIZATION
Templates in the frontend registry and backend DB have a `required_tier` attribute.
```typescript
interface ResumeTemplate {
  id: string;
  name: string;
  required_tier: 'free' | 'pro' | 'career_plus';
}
```
If a Free user selects a Pro template, the UI renders the template but adds a "Premium" badge, disables the PDF download button, and triggers the `UpgradeModal`.

## 5. PAYMENT INTEGRATION: RAZORPAY
1. **Checkout**: Frontend requests a Razorpay Subscription ID from FastAPI.
2. **Payment**: Frontend opens Razorpay Checkout using the generated ID.
3. **Webhook**: Razorpay sends `subscription.charged` to FastAPI.
4. **Fulfillment**: FastAPI validates the signature, updates the `subscriptions` table, and sets `users.tier = 'pro'`.

## 6. FRONTEND STATE: `useSubscriptionStore`
A Zustand store fetches the user's current limits and provides helper functions:
```typescript
interface SubscriptionState {
  tier: 'free' | 'pro' | 'career_plus';
  aiCreditsUsed: number;
  aiCreditLimit: number;
  canUseFeature: (feature: string) => boolean;
  openUpgradeModal: (featureName: string) => void;
}
```

## 7. CRON JOBS / BACKGROUND TASKS
A nightly background task (using Celery/RQ or FastAPI BackgroundTasks) scans `users`. If `datetime.now() > user.quota_reset_date`, it resets `ai_credits_used = 0` and sets the next reset date to +30 days.
