export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  content_blocks: any[]; // JSON array of blocks
  status: PostStatus;
  author_id?: number;
  category_id?: number;
  featured_image?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  canonical_url?: string;
  focus_keyword?: string;
  is_featured: boolean;
  is_sticky: boolean;
  views_count: number;
  published_at?: string;
  created_at: string;
  updated_at?: string;
  category?: BlogCategory;
  tags: BlogTag[];
}

export const BLOG_POST_TYPE = 'blog_post';
