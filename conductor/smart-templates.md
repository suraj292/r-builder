# Intelligent Occupation-Based Template Ecosystem

## Objective
Transform the template system into a smart, occupation-aware marketplace. The system will categorize templates, match them to user profiles (occupation, experience), and present them in a highly organized gallery.

## 1. Upgraded Template Schema (`src/types/template.ts`)
The `ResumeTemplate` interface will be extended with metadata for the recommendation engine.

```typescript
export type ExperienceLevel = 'fresher' | 'mid' | 'senior' | 'executive';

export interface ResumeTemplate {
  // ... existing fields ...
  metadata: {
    occupations: string[]; // e.g., ['Software Engineer', 'Data Scientist']
    industries: string[]; // e.g., ['Tech', 'Finance']
    experienceLevels: ExperienceLevel[];
    atsOptimized: boolean;
    creativityLevel: number; // 1 (conservative) to 5 (highly creative)
    recommendedSections: string[]; // Optimal order of sections
  };
}
```

## 2. User Profile State (`src/store/useResumeStore.ts`)
To drive recommendations, the resume metadata must track the user's target occupation and experience level.

```typescript
export interface ResumeMetadata {
  // ...
  targetOccupation?: string;
  experienceLevel?: ExperienceLevel;
}
```

## 3. The Recommendation Engine (`src/lib/recommendations.ts`)
A utility module that scores and sorts templates based on the user's profile.
- **ATS Match**: If applying to enterprise roles, boost ATS templates.
- **Occupation Match**: Exact or partial matches in the template's supported occupations.
- **Experience Match**: Filter out 'executive' templates for 'freshers'.

## 4. Enhanced Template Registry (`src/templates/registry.ts`)
We will expand the registry to cover specific use cases:
- `tech-startup`: Tech, high creativity, mid-senior.
- `academic-cv`: Research, publications focus.
- `medical-standard`: Healthcare, clean, conservative.
- `designer-portfolio`: Creative, heavy visual focus.

## 5. Template Marketplace UI (`src/components/editor/TemplateGallery.tsx`)
A complete overhaul of the sidebar into a multi-section marketplace:
- **Header**: User profile selector (e.g., "I am a [Software Engineer] with [Mid-Level] experience").
- **Sections**:
  - ✨ Recommended for You
  - 🏢 ATS Optimized
  - 🎨 Creative & Design
  - 👔 Executive
- **Cards**: Show badges like "ATS Safe" or "Best for Tech".

## 6. Dynamic Structure Strategy
When a template is selected, we provide an option (or a "Magic Reorder" button) to reorder the user's blocks based on `template.metadata.recommendedSections`. Since we don't want to destroy content without permission, this will be an explicit action rather than an automatic destructive reshuffle.
