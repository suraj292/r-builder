export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOConfig {
  id?: number;
  path: string;
  title?: string;
  description?: string;
  keywords?: string;
  canonical_url?: string;
  is_indexed: boolean;
  is_followed: boolean;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_card: string;
  faqs?: FAQItem[];
  custom_schema?: any;
  include_in_sitemap: boolean;
  sitemap_priority: string;
  sitemap_changefreq: string;
  created_at?: string;
  updated_at?: string;
}
