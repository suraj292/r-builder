export type BlockType = 
  | 'text' 
  | 'section' 
  | 'list' 
  | 'header' 
  | 'group' 
  | 'experience_item' 
  | 'education_item'
  | 'columns'
  | 'photo'
  | 'skill_chart'
  | 'qr_code'
  | 'badge'
  | 'social_links';

export interface ElementStyles {
  // Typography
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  
  // Colors & Background
  color?: string;
  backgroundColor?: string;
  
  // Box Model
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
  boxShadow?: string;
  
  // Dimensions
  width?: string;
  height?: string;
}

export interface BaseBlock {
  id: string;
  type: BlockType;
  parentId?: string; // Used for nested layouts
  customStyles?: ElementStyles; // Block-level design overrides
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  data: {
    content: string;
    variant: 'p' | 'h1' | 'h2' | 'h3';
  };
}

export interface ListBlock extends BaseBlock {
  type: 'list';
  data: {
    items: string[];
    bulletType: 'disc' | 'number' | 'none';
  };
}

export interface HeaderBlock extends BaseBlock {
  type: 'header';
  data: {
    name: string;
    title: string;
    email: string;
    phone: string;
    website?: string;
    location?: string;
    photoUrl?: string;
  };
}

export interface SectionBlock extends BaseBlock {
  type: 'section';
  data: {
    title: string;
  };
}

export interface ExperienceItemBlock extends BaseBlock {
  type: 'experience_item';
  data: {
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  };
}

// --- NEW ADVANCED CUSTOM ELEMENTS ---

export interface ColumnsBlock extends BaseBlock {
  type: 'columns';
  data: {
    columns: number; // 2, 3, etc.
    ratio?: string; // "1:1", "1:2", "2:1"
    gap?: string;
    columnsData: string[][]; // Array of columns, each containing an array of block IDs
  };
}

export interface PhotoBlock extends BaseBlock {
  type: 'photo';
  data: {
    url: string;
    shape: 'circle' | 'square' | 'rounded' | 'hexagon';
    borderStyle?: string;
    filter?: string;
    objectPosition?: string; // e.g., 'center top'
  };
}

export interface SkillChartBlock extends BaseBlock {
  type: 'skill_chart';
  data: {
    skills: { name: string; level: number }[]; // level 1-100
    chartType: 'bar' | 'circle' | 'dots';
    color?: string;
  };
}

export interface QrCodeBlock extends BaseBlock {
  type: 'qr_code';
  data: {
    url: string;
    label?: string;
  };
}

export interface BadgeBlock extends BaseBlock {
  type: 'badge';
  data: {
    text: string;
    icon?: string;
    style: 'solid' | 'outline' | 'soft';
  };
}

export interface SocialLinksBlock extends BaseBlock {
  type: 'social_links';
  data: {
    links: { platform: string; url: string; handle: string }[];
    displayMode: 'icon-only' | 'icon-text';
  };
}

export type Block = 
  | TextBlock 
  | ListBlock 
  | HeaderBlock 
  | SectionBlock 
  | ExperienceItemBlock
  | ColumnsBlock
  | PhotoBlock
  | SkillChartBlock
  | QrCodeBlock
  | BadgeBlock
  | SocialLinksBlock;

export interface ResumeTheme {
  primary: string;
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
}

import type { ExperienceLevel } from './template';
import type { ThemeTokens } from './theme';

export interface ResumeMetadata {
  title: string;
  templateId: string;
  themeId: string; // The active theme preset
  designOverrides?: Partial<ThemeTokens>; // Manual user customizations
  updatedAt: number;
  targetOccupation?: string;
  experienceLevel?: ExperienceLevel;
}

export interface ResumeSchema {
  version: string;
  metadata: ResumeMetadata;
  theme: ResumeTheme;
  blocks: Record<string, Block>;
  layout: (string | LayoutGroup)[];
}

export interface LayoutGroup {
  type: 'columns' | 'single';
  config?: {
    ratio?: string;
  };
  columns?: string[][]; // Array of arrays of block IDs
  blocks?: string[];    // Array of block IDs for single column
}
