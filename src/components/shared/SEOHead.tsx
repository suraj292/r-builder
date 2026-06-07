import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../../lib/api';
import type { SEOConfig } from '../../types/seo';

import { useSystemStore } from '../../store/useSystemStore';
import { useVisibilityStore } from '../../store/useVisibilityStore';

export default function SEOHead() {
  const location = useLocation();
  const { settings } = useSystemStore();
  const { config: visConfig, fetchConfig } = useVisibilityStore();
  const projectName = visConfig?.business_info?.brand_name || settings?.project_name || 'ResumeAI';

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    fetchSEO();
  }, [location.pathname, visConfig]);

  const fetchSEO = async () => {
    try {
      const data = await api.get<SEOConfig>(`/v1/seo/config?path=${encodeURIComponent(location.pathname)}`);
      
      // Inject Google Verification if available
      if (visConfig?.google_settings?.search_console_tag) {
        injectVerificationTag(visConfig.google_settings.search_console_tag);
      }
      
      // Inject GA4 if available
      if (visConfig?.google_settings?.ga4_measurement_id) {
        injectGA4(visConfig.google_settings.ga4_measurement_id);
      }

      if (data) {
        applySEO(data);
      } else {
        resetSEO();
      }
    } catch (error) {
      console.error('Failed to fetch SEO config');
    }
  };

  const applySEO = (cfg: SEOConfig) => {
    // 1. Title
    const finalTitle = cfg.title || projectName;
    document.title = finalTitle;

    // 2. Meta Tags
    updateMetaTag('description', cfg.description || visConfig?.business_info?.description || '');
    updateMetaTag('keywords', cfg.keywords || '');
    updateMetaTag('robots', `${cfg.is_indexed ? 'index' : 'noindex'}, ${cfg.is_followed ? 'follow' : 'nofollow'}`);

    // 3. Open Graph
    const ogTitle = cfg.og_title || finalTitle;
    const ogDesc = cfg.og_description || cfg.description || visConfig?.business_info?.description || '';
    
    updateMetaTag('og:title', ogTitle);
    updateMetaTag('og:description', ogDesc);
    updateMetaTag('og:image', cfg.og_image || visConfig?.social_links?.og_image || '');
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:site_name', projectName);

    // 4. Twitter
    updateMetaTag('twitter:card', cfg.twitter_card || 'summary_large_image');
    updateMetaTag('twitter:title', ogTitle);
    updateMetaTag('twitter:description', ogDesc);
    updateMetaTag('twitter:image', cfg.og_image || visConfig?.social_links?.og_image || '');
    
    const twitterHandle = visConfig?.social_links?.twitter?.split('/').pop();
    if (twitterHandle) {
      updateMetaTag('twitter:site', `@${twitterHandle}`);
    }

    // 5. Canonical
    updateCanonical(cfg.canonical_url);

    // 6. Schema.org
    removeExistingSchema();
    injectOrganizationSchema();
    if (cfg.faqs && cfg.faqs.length > 0) injectFAQSchema(cfg.faqs);
    if (cfg.custom_schema) injectCustomSchema(cfg.custom_schema);
  };

  const injectVerificationTag = (tag: string) => {
    if (tag.includes('<meta')) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(tag, 'text/html');
      const meta = doc.querySelector('meta');
      if (meta) {
        updateMetaTag(meta.getAttribute('name') || meta.getAttribute('property') || '', meta.getAttribute('content') || '');
      }
    } else {
      updateMetaTag('google-site-verification', tag);
    }
  };

  const injectGA4 = (id: string) => {
    if (window.hasOwnProperty(`ga_injected_${id}`)) return;
    
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${id}');
    `;
    document.head.appendChild(script2);
    (window as any)[`ga_injected_${id}`] = true;
  };

  const injectOrganizationSchema = () => {
    if (!visConfig?.business_info?.business_name) return;
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": visConfig.business_info.business_name,
      "url": visConfig.business_info.website_url,
      "logo": visConfig.business_info.logo,
      "description": visConfig.business_info.description,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": visConfig.business_info.address,
        "addressLocality": visConfig.business_info.city,
        "addressCountry": visConfig.business_info.country
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": visConfig.business_info.phone,
        "contactType": "customer service",
        "email": visConfig.business_info.email
      },
      "sameAs": Object.values(visConfig.social_links || {}).filter(v => typeof v === 'string' && v.startsWith('http'))
    };
    injectCustomSchema(schema);
  };

  const resetSEO = () => {
    // Optional: Implement default SEO behavior here
    updateMetaTag('robots', 'index, follow');
    removeExistingSchema();
  };

  const updateCanonical = (url?: string) => {
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url || window.location.href);
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
