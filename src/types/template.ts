export type LayoutType = 'single-column' | 'two-column' | 'grid' | 'timeline' | 'magazine';
export type PhotoShape = 'circle' | 'square' | 'rounded';
export type PhotoPosition = 'top' | 'sidebar' | 'floating' | 'banner';
export type TypographyScale = 'small' | 'medium' | 'large';
export type ExperienceLevel = 'fresher' | 'mid' | 'senior' | 'executive';

export interface ResumeTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail: string;

  layout: {
    type: LayoutType;
    sidebar?: {
      width: string;
      position: 'left' | 'right';
    };
  };

  typography: {
    headingFont: string;
    bodyFont: string;
    scale: TypographyScale;
  };

  spacing: {
    pagePadding: string;
    sectionGap: string;
    blockGap: string;
  };

  photo: {
    enabled: boolean;
    required: boolean;
    shape: PhotoShape;
    position: PhotoPosition;
  };

  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    textLight: string;
    accent: string;
    border: string;
  };

  blocks: {
    sectionStyle: 'uppercase' | 'none' | 'capitalize';
    sectionBorder: 'none' | 'bottom' | 'all';
    experienceStyle: 'timeline' | 'card' | 'minimal' | 'bordered';
    skillStyle: 'chip' | 'progress' | 'tag' | 'list';
    headerAlignment: 'left' | 'center' | 'right';
  };

  metadata: {
    occupations: string[];
    industries: string[];
    experienceLevels: ExperienceLevel[];
    atsOptimized: boolean;
    creativityLevel: number; // 1-5
    recommendedSections: string[];
  };
}
