import type { ResumeTemplate, ExperienceLevel } from '../types/template';

export interface RecommendationCriteria {
  targetOccupation?: string;
  experienceLevel?: ExperienceLevel;
  industry?: string;
}

export function getRecommendedTemplates(
  templates: ResumeTemplate[],
  criteria: RecommendationCriteria
): ResumeTemplate[] {
  const { targetOccupation, experienceLevel } = criteria;

  return templates
    .map((template) => {
      let score = 0;

      // 1. Occupation Match (Primary weight)
      if (targetOccupation) {
        const occupationMatch = template.metadata.occupations.some((occ) =>
          occ.toLowerCase().includes(targetOccupation.toLowerCase()) ||
          targetOccupation.toLowerCase().includes(occ.toLowerCase())
        );
        if (occupationMatch) score += 50;
      }

      // 2. Experience Level Match
      if (experienceLevel && template.metadata.experienceLevels.includes(experienceLevel)) {
        score += 30;
      }

      // 3. Category matching (Internal preference)
      if (targetOccupation?.toLowerCase().includes('designer') && template.category === 'Designer') {
        score += 20;
      }
      if (targetOccupation?.toLowerCase().includes('engineer') && template.category === 'Developer') {
        score += 20;
      }

      return { template, score };
    })
    .sort((a, b) => b.score - a.score)
    .filter(item => item.score > 0)
    .map((item) => item.template);
}

export function groupTemplatesByCategory(templates: ResumeTemplate[]): Record<string, ResumeTemplate[]> {
  return templates.reduce((acc, template) => {
    const cat = template.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(template);
    return acc;
  }, {} as Record<string, ResumeTemplate[]>);
}
