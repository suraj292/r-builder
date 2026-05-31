import type { BlogPost } from '../types/blog';

// Centralized blog post data
export const BLOG_POSTS: BlogPost[] = [
    {
        id: 1,
        slug: '10-hidden-keywords-ats-2024',
        title: '10 Hidden Keywords That Will Triple Your Interview Chances in 2024',
        excerpt: 'Stop guessing what recruiters want. We analyzed 100,000 job descriptions to find the power words that consistently beat the ATS algorithms.',
        category: { id: 1, name: 'ATS Strategy', slug: 'ats-strategy' },
        content_blocks: [],
        status: 'published',
        is_featured: true,
        is_sticky: false,
        views_count: 1240,
        created_at: '2023-10-24T10:00:00Z',
        tags: []
    },
    {
        id: 2,
        slug: 'explain-employment-gaps-resume',
        title: 'How to Explain Employment Gaps on Your Resume',
        excerpt: "Don't let a career break hurt your chances. Here are 5 ATS-friendly ways to frame your time off positively.",
        category: { id: 2, name: 'Guides', slug: 'guides' },
        content_blocks: [],
        status: 'published',
        is_featured: false,
        is_sticky: false,
        views_count: 850,
        created_at: '2023-10-20T10:00:00Z',
        tags: []
    },
    {
        id: 3,
        slug: 'best-fonts-for-resumes',
        title: 'Best Fonts for Resumes: What Recruiters Actually Read',
        excerpt: 'Is Times New Roman dead? We rank the top 10 fonts for readability and parsing compatibility.',
        category: { id: 3, name: 'Templates', slug: 'templates' },
        content_blocks: [],
        status: 'published',
        is_featured: false,
        is_sticky: false,
        views_count: 2100,
        created_at: '2023-10-18T10:00:00Z',
        tags: []
    },
    {
        id: 4,
        slug: 'resume-vs-cv-differences',
        title: 'Resume vs CV: Which One Do You Really Need?',
        excerpt: 'The definitive guide to understanding the differences and when to use each format.',
        category: { id: 4, name: 'Tech', slug: 'tech' },
        content_blocks: [],
        status: 'published',
        is_featured: false,
        is_sticky: false,
        views_count: 1560,
        created_at: '2023-10-15T10:00:00Z',
        tags: []
    },
    {
        id: 5,
        slug: 'action-verbs-list-resume',
        title: 'Action Verbs List: 100+ Words to Replace "Responsible For"',
        excerpt: 'Stop using passive language. Energize your bullet points with these powerful action verbs.',
        category: { id: 5, name: 'Writing', slug: 'writing' },
        content_blocks: [],
        status: 'published',
        is_featured: false,
        is_sticky: false,
        views_count: 3200,
        created_at: '2023-10-10T10:00:00Z',
        tags: []
    }
];
