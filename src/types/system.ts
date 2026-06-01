export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
}

export interface SystemSettings {
  project_name: string;
  site_domain: string;
  site_logo?: string;
  site_icon?: string;
  contact_email: string;
  contact_phone?: string;
  contact_address?: string;
  social_links: SocialLinks;
  maintenance_mode: boolean;
  allow_new_registrations: boolean;
  updated_at: string;
}
