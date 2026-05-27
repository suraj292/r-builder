import type { ResumeTemplate } from '../types/template';

const commonFonts = {
  sans: 'Inter, system-ui, sans-serif',
  serif: 'Lora, Georgia, serif',
  mono: 'JetBrains Mono, monospace',
  geometric: 'Poppins, sans-serif',
  classic: 'Garamond, serif',
};

export const TEMPLATE_REGISTRY: Record<string, ResumeTemplate> = {
  // --- WITHOUT PHOTO ---
  
  'ats-single-column': {
    id: 'ats-single-column',
    name: 'ATS Single Column',
    category: 'ATS',
    thumbnail: 'https://placehold.co/200x280/ffffff/000000?text=ATS+Simple',
    requiredTier: 'free',
    layout: { type: 'single-column' },
    typography: { headingFont: commonFonts.sans, bodyFont: commonFonts.sans, scale: 'medium' },
    spacing: { pagePadding: '15mm', sectionGap: '1rem', blockGap: '0.5rem' },
    photo: { enabled: false, required: false, shape: 'square', position: 'top' },
    colors: { primary: '#000000', secondary: '#333333', background: '#ffffff', text: '#000000', textLight: '#555555', accent: '#000000', border: '#cccccc' },
    blocks: { sectionStyle: 'uppercase', sectionBorder: 'bottom', experienceStyle: 'minimal', skillStyle: 'list', headerAlignment: 'center' },
    metadata: {
      occupations: ['Software Engineer', 'Data Analyst', 'Accountant', 'Operations Manager'],
      industries: ['Tech', 'Finance', 'Corporate'],
      experienceLevels: ['fresher', 'mid', 'senior'],
      atsOptimized: true,
      creativityLevel: 1,
      recommendedSections: ['header', 'summary', 'experience', 'education', 'skills']
    }
  },

  'minimal-elegant': {
    id: 'minimal-elegant',
    name: 'Minimal Elegant',
    category: 'Minimal',
    thumbnail: 'https://placehold.co/200x280/ffffff/333333?text=Minimal+Elegant',
    requiredTier: 'free',
    layout: { type: 'single-column' },
    typography: { headingFont: commonFonts.serif, bodyFont: commonFonts.sans, scale: 'medium' },
    spacing: { pagePadding: '20mm', sectionGap: '2rem', blockGap: '1rem' },
    photo: { enabled: false, required: false, shape: 'circle', position: 'top' },
    colors: { primary: '#111827', secondary: '#4B5563', background: '#ffffff', text: '#1f2937', textLight: '#6b7280', accent: '#111827', border: '#e5e7eb' },
    blocks: { sectionStyle: 'none', sectionBorder: 'none', experienceStyle: 'minimal', skillStyle: 'list', headerAlignment: 'left' },
    metadata: {
      occupations: ['Architect', 'Lawyer', 'Consultant', 'Copywriter'],
      industries: ['Design', 'Legal', 'Consulting'],
      experienceLevels: ['mid', 'senior', 'executive'],
      atsOptimized: true,
      creativityLevel: 2,
      recommendedSections: ['header', 'summary', 'experience', 'education', 'skills']
    }
  },

  'modern-professional': {
    id: 'modern-professional',
    name: 'Modern Professional',
    category: 'Professional',
    thumbnail: 'https://placehold.co/200x280/2563eb/ffffff?text=Modern+Pro',
    requiredTier: 'pro',
    layout: { type: 'two-column', sidebar: { width: '30%', position: 'left' } },
    typography: { headingFont: commonFonts.sans, bodyFont: commonFonts.sans, scale: 'medium' },
    spacing: { pagePadding: '20mm', sectionGap: '1.5rem', blockGap: '0.75rem' },
    photo: { enabled: false, required: false, shape: 'circle', position: 'sidebar' },
    colors: { primary: '#2563eb', secondary: '#1e40af', background: '#ffffff', text: '#111827', textLight: '#6b7280', accent: '#3b82f6', border: '#e5e7eb' },
    blocks: { sectionStyle: 'uppercase', sectionBorder: 'bottom', experienceStyle: 'card', skillStyle: 'tag', headerAlignment: 'left' },
    metadata: {
      occupations: ['Product Manager', 'Marketing Executive', 'Project Manager', 'Sales Director'],
      industries: ['Tech', 'Marketing', 'Business'],
      experienceLevels: ['mid', 'senior'],
      atsOptimized: false,
      creativityLevel: 3,
      recommendedSections: ['header', 'summary', 'experience', 'skills', 'education']
    }
  },

  'executive-corporate': {
    id: 'executive-corporate',
    name: 'Executive Corporate',
    category: 'Executive',
    thumbnail: 'https://placehold.co/200x280/1e3a8a/ffffff?text=Executive',
    requiredTier: 'career_plus',
    layout: { type: 'single-column' },
    typography: { headingFont: commonFonts.classic, bodyFont: commonFonts.serif, scale: 'large' },
    spacing: { pagePadding: '20mm', sectionGap: '1.5rem', blockGap: '0.75rem' },
    photo: { enabled: false, required: false, shape: 'square', position: 'top' },
    colors: { primary: '#1e3a8a', secondary: '#1e40af', background: '#f8fafc', text: '#111827', textLight: '#4b5563', accent: '#2563eb', border: '#cbd5e1' },
    blocks: { sectionStyle: 'uppercase', sectionBorder: 'bottom', experienceStyle: 'bordered', skillStyle: 'list', headerAlignment: 'center' },
    metadata: {
      occupations: ['CEO', 'CTO', 'CFO', 'VP of Engineering', 'Director'],
      industries: ['Corporate', 'Finance', 'Legal'],
      experienceLevels: ['executive'],
      atsOptimized: true,
      creativityLevel: 1,
      recommendedSections: ['header', 'summary', 'experience', 'education', 'skills']
    }
  },

  'compact-dense': {
    id: 'compact-dense',
    name: 'Compact Dense',
    category: 'Professional',
    thumbnail: 'https://placehold.co/200x280/ffffff/111827?text=Compact',
    requiredTier: 'free',
    layout: { type: 'single-column' },
    typography: { headingFont: commonFonts.sans, bodyFont: commonFonts.sans, scale: 'medium' },
    spacing: { pagePadding: '10mm', sectionGap: '0.75rem', blockGap: '0.25rem' },
    photo: { enabled: false, required: false, shape: 'square', position: 'top' },
    colors: { primary: '#000000', secondary: '#333333', background: '#ffffff', text: '#111827', textLight: '#6b7280', accent: '#000000', border: '#e5e7eb' },
    blocks: { sectionStyle: 'uppercase', sectionBorder: 'none', experienceStyle: 'minimal', skillStyle: 'list', headerAlignment: 'left' },
    metadata: {
      occupations: ['Software Engineer', 'System Administrator', 'DevOps Engineer'],
      industries: ['Tech', 'Engineering'],
      experienceLevels: ['mid', 'senior'],
      atsOptimized: true,
      creativityLevel: 1,
      recommendedSections: ['header', 'skills', 'experience', 'education']
    }
  },

  'timeline-resume': {
    id: 'timeline-resume',
    name: 'Timeline Resume',
    category: 'Creative',
    thumbnail: 'https://placehold.co/200x280/8b5cf6/ffffff?text=Timeline',
    requiredTier: 'pro',
    layout: { type: 'timeline' },
    typography: { headingFont: commonFonts.geometric, bodyFont: commonFonts.sans, scale: 'medium' },
    spacing: { pagePadding: '20mm', sectionGap: '2rem', blockGap: '1rem' },
    photo: { enabled: false, required: false, shape: 'circle', position: 'top' },
    colors: { primary: '#8b5cf6', secondary: '#6d28d9', background: '#ffffff', text: '#111827', textLight: '#6b7280', accent: '#a78bfa', border: '#e5e7eb' },
    blocks: { sectionStyle: 'capitalize', sectionBorder: 'none', experienceStyle: 'timeline', skillStyle: 'progress', headerAlignment: 'center' },
    metadata: {
      occupations: ['Event Planner', 'PR Specialist', 'Creative Director', 'Artist'],
      industries: ['Media', 'Arts', 'Entertainment'],
      experienceLevels: ['mid', 'senior'],
      atsOptimized: false,
      creativityLevel: 4,
      recommendedSections: ['header', 'experience', 'education', 'skills']
    }
  },

  'traditional-cv': {
    id: 'traditional-cv',
    name: 'Traditional CV',
    category: 'Academic',
    thumbnail: 'https://placehold.co/200x280/ffffff/000000?text=Traditional',
    requiredTier: 'free',
    layout: { type: 'single-column' },
    typography: { headingFont: commonFonts.serif, bodyFont: commonFonts.serif, scale: 'medium' },
    spacing: { pagePadding: '25mm', sectionGap: '1.5rem', blockGap: '1rem' },
    photo: { enabled: false, required: false, shape: 'square', position: 'top' },
    colors: { primary: '#000000', secondary: '#111111', background: '#ffffff', text: '#000000', textLight: '#333333', accent: '#000000', border: '#000000' },
    blocks: { sectionStyle: 'uppercase', sectionBorder: 'all', experienceStyle: 'minimal', skillStyle: 'list', headerAlignment: 'center' },
    metadata: {
      occupations: ['Professor', 'Researcher', 'Lecturer', 'PhD Candidate'],
      industries: ['Education', 'Science'],
      experienceLevels: ['fresher', 'mid', 'senior', 'executive'],
      atsOptimized: true,
      creativityLevel: 1,
      recommendedSections: ['header', 'education', 'experience', 'skills']
    }
  },

  'developer-resume': {
    id: 'developer-resume',
    name: 'Developer Resume',
    category: 'Developer',
    thumbnail: 'https://placehold.co/200x280/10b981/ffffff?text=Developer',
    requiredTier: 'pro',
    layout: { type: 'single-column' },
    typography: { headingFont: commonFonts.mono, bodyFont: commonFonts.sans, scale: 'small' },
    spacing: { pagePadding: '15mm', sectionGap: '1rem', blockGap: '0.75rem' },
    photo: { enabled: false, required: false, shape: 'square', position: 'top' },
    colors: { primary: '#10b981', secondary: '#047857', background: '#1e293b', text: '#f3f4f6', textLight: '#94a3b8', accent: '#34d399', border: '#334155' },
    blocks: { sectionStyle: 'none', sectionBorder: 'bottom', experienceStyle: 'card', skillStyle: 'chip', headerAlignment: 'left' },
    metadata: {
      occupations: ['Frontend Developer', 'Backend Engineer', 'Full Stack Developer', 'DevOps'],
      industries: ['Tech', 'Software'],
      experienceLevels: ['fresher', 'mid', 'senior'],
      atsOptimized: true,
      creativityLevel: 2,
      recommendedSections: ['header', 'skills', 'experience', 'projects', 'education']
    }
  },

  // --- WITH PHOTO ---

  'creative-designer': {
    id: 'creative-designer',
    name: 'Creative Designer',
    category: 'Designer',
    thumbnail: 'https://placehold.co/200x280/ec4899/ffffff?text=Creative+Photo',
    requiredTier: 'career_plus',
    layout: { type: 'grid' },
    typography: { headingFont: commonFonts.geometric, bodyFont: commonFonts.sans, scale: 'medium' },
    spacing: { pagePadding: '20mm', sectionGap: '1.5rem', blockGap: '1rem' },
    photo: { enabled: true, required: true, shape: 'circle', position: 'floating' },
    colors: { primary: '#ec4899', secondary: '#be185d', background: '#fdf2f8', text: '#111827', textLight: '#6b7280', accent: '#fbcfe8', border: '#fbcfe8' },
    blocks: { sectionStyle: 'capitalize', sectionBorder: 'none', experienceStyle: 'card', skillStyle: 'tag', headerAlignment: 'left' },
    metadata: {
      occupations: ['UI/UX Designer', 'Graphic Designer', 'Motion Designer', 'Art Director'],
      industries: ['Design', 'Media', 'Advertising'],
      experienceLevels: ['mid', 'senior'],
      atsOptimized: false,
      creativityLevel: 5,
      recommendedSections: ['header', 'summary', 'experience', 'education', 'skills']
    }
  },

  'portfolio-style': {
    id: 'portfolio-style',
    name: 'Portfolio Style',
    category: 'Creative',
    thumbnail: 'https://placehold.co/200x280/14b8a6/ffffff?text=Portfolio',
    requiredTier: 'career_plus',
    layout: { type: 'two-column', sidebar: { width: '40%', position: 'left' } },
    typography: { headingFont: commonFonts.geometric, bodyFont: commonFonts.sans, scale: 'medium' },
    spacing: { pagePadding: '15mm', sectionGap: '2rem', blockGap: '1rem' },
    photo: { enabled: true, required: true, shape: 'rounded', position: 'sidebar' },
    colors: { primary: '#14b8a6', secondary: '#0f766e', background: '#ffffff', text: '#1f2937', textLight: '#4b5563', accent: '#5eead4', border: '#ccfbf1' },
    blocks: { sectionStyle: 'none', sectionBorder: 'bottom', experienceStyle: 'card', skillStyle: 'chip', headerAlignment: 'left' },
    metadata: {
      occupations: ['Photographer', 'Videographer', 'Content Creator'],
      industries: ['Media', 'Entertainment'],
      experienceLevels: ['fresher', 'mid', 'senior'],
      atsOptimized: false,
      creativityLevel: 4,
      recommendedSections: ['header', 'summary', 'experience', 'education', 'skills']
    }
  },

  'dark-luxury-resume': {
    id: 'dark-luxury-resume',
    name: 'Dark Luxury',
    category: 'Executive',
    thumbnail: 'https://placehold.co/200x280/111827/d4af37?text=Luxury',
    requiredTier: 'career_plus',
    layout: { type: 'two-column', sidebar: { width: '33%', position: 'left' } },
    typography: { headingFont: commonFonts.serif, bodyFont: commonFonts.sans, scale: 'medium' },
    spacing: { pagePadding: '20mm', sectionGap: '1.5rem', blockGap: '1rem' },
    photo: { enabled: true, required: true, shape: 'circle', position: 'sidebar' },
    colors: { primary: '#d4af37', secondary: '#b8860b', background: '#111827', text: '#f9fafb', textLight: '#9ca3af', accent: '#374151', border: '#374151' },
    blocks: { sectionStyle: 'uppercase', sectionBorder: 'bottom', experienceStyle: 'bordered', skillStyle: 'tag', headerAlignment: 'left' },
    metadata: {
      occupations: ['Executive Chef', 'Hotel Manager', 'Fashion Designer', 'Luxury Sales'],
      industries: ['Hospitality', 'Fashion', 'Real Estate'],
      experienceLevels: ['senior', 'executive'],
      atsOptimized: false,
      creativityLevel: 5,
      recommendedSections: ['header', 'summary', 'experience', 'education', 'skills']
    }
  },
  
  'medical-standard': {
    id: 'medical-standard',
    name: 'Medical Standard',
    category: 'Medical',
    thumbnail: 'https://placehold.co/200x280/0ea5e9/ffffff?text=Medical',
    requiredTier: 'pro',
    layout: { type: 'single-column' },
    typography: { headingFont: commonFonts.sans, bodyFont: commonFonts.sans, scale: 'medium' },
    spacing: { pagePadding: '20mm', sectionGap: '1.5rem', blockGap: '0.75rem' },
    photo: { enabled: false, required: false, shape: 'circle', position: 'top' },
    colors: { primary: '#0ea5e9', secondary: '#0369a1', background: '#ffffff', text: '#111827', textLight: '#64748b', accent: '#e0f2fe', border: '#e2e8f0' },
    blocks: { sectionStyle: 'uppercase', sectionBorder: 'bottom', experienceStyle: 'minimal', skillStyle: 'list', headerAlignment: 'left' },
    metadata: {
      occupations: ['Doctor', 'Nurse', 'Pharmacist', 'Surgeon'],
      industries: ['Healthcare', 'Medicine'],
      experienceLevels: ['fresher', 'mid', 'senior'],
      atsOptimized: true,
      creativityLevel: 1,
      recommendedSections: ['header', 'education', 'experience', 'certifications', 'skills']
    }
  },

  'legal-professional': {
    id: 'legal-professional',
    name: 'Legal Professional',
    category: 'Legal',
    thumbnail: 'https://placehold.co/200x280/0f172a/ffffff?text=Legal',
    requiredTier: 'career_plus',
    layout: { type: 'single-column' },
    typography: { headingFont: commonFonts.classic, bodyFont: commonFonts.serif, scale: 'medium' },
    spacing: { pagePadding: '25mm', sectionGap: '1.5rem', blockGap: '1rem' },
    photo: { enabled: false, required: false, shape: 'square', position: 'top' },
    colors: { primary: '#0f172a', secondary: '#334155', background: '#ffffff', text: '#0f172a', textLight: '#475569', accent: '#f1f5f9', border: '#e2e8f0' },
    blocks: { sectionStyle: 'none', sectionBorder: 'bottom', experienceStyle: 'minimal', skillStyle: 'list', headerAlignment: 'center' },
    metadata: {
      occupations: ['Lawyer', 'Legal Assistant', 'Judge', 'Paralegal'],
      industries: ['Legal', 'Government'],
      experienceLevels: ['mid', 'senior', 'executive'],
      atsOptimized: true,
      creativityLevel: 1,
      recommendedSections: ['header', 'summary', 'experience', 'education', 'skills']
    }
  },

  'fresher-standard': {
    id: 'fresher-standard',
    name: 'Fresher Standard',
    category: 'Student',
    thumbnail: 'https://placehold.co/200x280/f97316/ffffff?text=Fresher',
    requiredTier: 'free',
    layout: { type: 'single-column' },
    typography: { headingFont: commonFonts.geometric, bodyFont: commonFonts.sans, scale: 'medium' },
    spacing: { pagePadding: '20mm', sectionGap: '1.25rem', blockGap: '0.75rem' },
    photo: { enabled: true, required: false, shape: 'circle', position: 'top' },
    colors: { primary: '#f97316', secondary: '#c2410c', background: '#ffffff', text: '#111827', textLight: '#6b7280', accent: '#fff7ed', border: '#fed7aa' },
    blocks: { sectionStyle: 'capitalize', sectionBorder: 'bottom', experienceStyle: 'card', skillStyle: 'tag', headerAlignment: 'center' },
    metadata: {
      occupations: ['College Student', 'Intern', 'Fresher', 'Graduate'],
      industries: ['Education', 'All'],
      experienceLevels: ['fresher'],
      atsOptimized: true,
      creativityLevel: 2,
      recommendedSections: ['header', 'education', 'skills', 'projects', 'experience']
    }
  }
};
