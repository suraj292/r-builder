import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../../lib/api';
import type { SEOConfig } from '../../types/seo';

import { useSystemStore } from '../../store/useSystemStore';

export default function SEOHead() {
  const location = useLocation();
  const { settings } = useSystemStore();
  const [config, setConfig] = useState<SEOConfig | null>(null);

  const projectName = settings?.project_name || 'ResumeAI';

  useEffect(() => {
    fetchSEO();
  }, [location.pathname]);

  const fetchSEO = async () => {
    try {
      const data = await api.get<SEOConfig>(`/v1/seo/config?path=${encodeURIComponent(location.pathname)}`);
      if (data) {
        applySEO(data);
        setConfig(data);
      } else {
        // Reset or use defaults if no custom config for this path
        resetSEO();
      }
    } catch (error) {
      console.error('Failed to fetch SEO config');
    }
  };

  const applySEO = (cfg: SEOConfig) => {
    // 1. Title
    const finalTitle = cfg.title || document.title;
    document.title = finalTitle;

    // 2. Meta Tags
    updateMetaTag('description', cfg.description || '');
    updateMetaTag('keywords', cfg.keywords || '');
    updateMetaTag('robots', `${cfg.is_indexed ? 'index' : 'noindex'}, ${cfg.is_followed ? 'follow' : 'nofollow'}`);

    // 3. Open Graph (Dynamic fallbacks)
    const ogTitle = cfg.og_title || finalTitle;
    const ogDesc = cfg.og_description || cfg.description || '';
    
    updateMetaTag('og:title', ogTitle);
    updateMetaTag('og:description', ogDesc);
    updateMetaTag('og:image', cfg.og_image || '');
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('og:type', 'website');

    // 4. Twitter
    updateMetaTag('twitter:card', cfg.twitter_card || 'summary_large_image');
    updateMetaTag('twitter:title', ogTitle);
    updateMetaTag('twitter:description', ogDesc);
    updateMetaTag('twitter:image', cfg.og_image || '');

    // 5. Canonical
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', cfg.canonical_url || window.location.href);

    // 6. Schema.org (JSON-LD)
    removeExistingSchema();
    if (cfg.faqs && cfg.faqs.length > 0) {
        injectFAQSchema(cfg.faqs);
    }
    if (cfg.custom_schema) {
        injectCustomSchema(cfg.custom_schema);
    }
  };

  const resetSEO = () => {
    // Optional: Implement default SEO behavior here
    updateMetaTag('robots', 'index, follow');
    removeExistingSchema();
  };

  const updateMetaTag = (name: string, content: string) => {
    if (!content) return;
    let tag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      if (name.startsWith('og:')) {
        tag.setAttribute('property', name);
      } else {
        tag.setAttribute('name', name);
      }
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };

  const removeExistingSchema = () => {
    const existing = document.querySelectorAll('script[type="application/ld+json"].custom-seo-schema');
    existing.forEach(e => e.remove());
  };

  const injectFAQSchema = (faqs: { question: string; answer: string }[]) => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    };
    injectCustomSchema(schema);
  };

  const injectCustomSchema = (schema: any) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.className = 'custom-seo-schema';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  };

  return null; // This component doesn't render anything UI-wise
}
