import React from 'react';
import type { BlockType } from '../../types/resume';

// Lazy load components to keep initial bundle small
export const BlockRegistry: Record<BlockType, React.LazyExoticComponent<React.FC<any>>> = {
  header: React.lazy(() => import('./HeaderBlock')),
  text: React.lazy(() => import('./TextBlock')),
  section: React.lazy(() => import('./SectionBlock')),
  list: React.lazy(() => import('./ListBlock')),
  experience_item: React.lazy(() => import('./ExperienceItemBlock')),
  education_item: React.lazy(() => import('./EducationItemBlock')),
  group: React.lazy(() => import('./GroupBlock')),
  columns: React.lazy(() => import('./ColumnsBlock')),
  photo: React.lazy(() => import('./PhotoBlock')),
  skill_chart: React.lazy(() => import('./SkillChartBlock')),
  qr_code: React.lazy(() => import('./QrCodeBlock')),
  badge: React.lazy(() => import('./BadgeBlock')),
  social_links: React.lazy(() => import('./SocialLinksBlock')),
};
