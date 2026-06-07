import json
from typing import List, Dict, Any
from app.services.ai_service import AIService
from app.config import settings

SEO_GPT_MASTER_PROMPT = """
# GEMINI SEO AGENT MASTER PROMPT
You are SEO-GPT Enterprise, an autonomous SEO strategist, technical SEO auditor, content optimizer, schema architect, GEO (Generative Engine Optimization) specialist, and AI Search Visibility analyst.
Your objective is to operate as a complete replacement for: Yoast SEO, Rank Math, Semrush SEO Assistant, Surfer SEO, Clearscope, Ahrefs Content Analyzer, Frase, MarketMuse, Schema Pro, and Technical SEO Auditors.

# CORE INSTRUCTIONS
Always think step-by-step. Never provide generic SEO advice. Always provide actionable recommendations. Prioritize recommendations by High, Medium, and Low Impact.

# ANALYSIS MODULES
- MODULE 1: SEO AUDIT (URL, Title, Meta, Sitemap, Core Web Vitals)
- MODULE 2: CONTENT ANALYSIS (Search intent, depth, expertise)
- MODULE 3: KEYWORD ANALYSIS (Primary, Secondary, Semantic, Entities)
- MODULE 4: ON-PAGE SEO (Headings, Alt Text, Internal/External links)
- MODULE 5: READABILITY (Passive voice, Sentence length)
- MODULE 13: GEO (Optimization for AI Overviews, Gemini, ChatGPT, Claude)
- MODULE 14: E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)

# FINAL REPORT FORMAT
Return results in this structure:
## Executive Summary
## SEO Score | GEO Score | EEAT Score
## Critical Issues | Quick Wins
## Recommended Actions (High/Medium/Low Impact)
## AI Search Visibility Improvements
"""

class BlogAIService:
    @staticmethod
    async def generate_outline(title: str, target_audience: str, tone: str) -> str:
        system_prompt = (
            f"{SEO_GPT_MASTER_PROMPT}\n"
            "Your task is to generate a comprehensive, high-converting blog post outline "
            "using your internal 'AI CONTENT CREATION' module. Ensure it is SEO-optimized and structured with H2 and H3 headings."
        )
        
        prompt = (
            f"Generate a blog post outline for the title: '{title}'.\n"
            f"Target Audience: {target_audience}\n"
            f"Tone: {tone}\n"
            f"Include an introduction, 3-5 main sections with sub-points, and a conclusion with a call to action."
        )
        
        # Switching to openai as gemini key is hitting quota limits
        result = await AIService.generate_response(
            provider="openai",
            model="gpt-4o-mini",
            prompt=prompt,
            system_prompt=system_prompt
        )
        return result["response"]

    @staticmethod
    async def optimize_title(current_title: str, focus_keyword: str = None) -> str:
        system_prompt = (
            f"{SEO_GPT_MASTER_PROMPT}\n"
            "Your task is to take a draft blog title and suggest 5 optimized alternatives using your internal Copywriting and CTR modules."
        )
        
        keyword_context = f" and focus on the keyword '{focus_keyword}'" if focus_keyword else ""
        prompt = (
            f"Current Title: '{current_title}'\n"
            f"Please provide 5 alternative titles that are more engaging and SEO-friendly{keyword_context}."
        )
        
        result = await AIService.generate_response(
            provider="openai",
            model="gpt-4o-mini",
            prompt=prompt,
            system_prompt=system_prompt
        )
        return result["response"]

    @staticmethod
    async def get_seo_suggestions(title: str, excerpt: str, content_preview: str) -> str:
        system_prompt = (
            f"{SEO_GPT_MASTER_PROMPT}\n"
            "Run a full 'SEO-GPT Enterprise Audit' on the provided blog details. "
            "Ensure you address GEO (AI Search Visibility) and EEAT signals specifically."
        )
        
        prompt = (
            f"Audit Request:\n"
            f"Title: {title}\n"
            f"Excerpt: {excerpt or 'Not provided'}\n"
            f"Content: {content_preview[:4000]}...\n\n"
            "Please provide the full final report format."
        )
        
        result = await AIService.generate_response(
            provider="openai",
            model="gpt-4o-mini",
            prompt=prompt,
            system_prompt=system_prompt
        )
        return result["response"]

    @staticmethod
    async def generate_draft(title: str, outline: str) -> str:
        system_prompt = (
            f"{SEO_GPT_MASTER_PROMPT}\n"
            "Use 'MODULE 16: AI CONTENT CREATION' to write a full blog post draft based on the provided outline. "
            "Requirement: Human First, SEO Optimized, GEO Optimized, EEAT Compliant, and Original."
        )
        
        prompt = (
            f"Title: {title}\n"
            f"Outline: {outline}\n\n"
            "Write the full article content. Use clear headings and engaging language."
        )
        
        result = await AIService.generate_response(
            provider="openai",
            model="gpt-4o-mini",
            prompt=prompt,
            system_prompt=system_prompt
        )
        return result["response"]

    @staticmethod
    async def optimize_page_seo(path: str, context: str = "") -> str:
        system_prompt = (
            f"{SEO_GPT_MASTER_PROMPT}\n"
            "Your task is to generate optimized SEO metadata for a specific platform page. "
            "Return the response in a structured JSON format (as a string) containing: "
            "title, description, keywords, og_title, og_description."
        )
        
        target_desc = f"Page Path: {path}"
        if path == "__default__":
            target_desc = "Target: GLOBAL DEFAULT FALLBACK (Applied when no specific page SEO is defined. Should be broad and platform-wide.)"

        prompt = (
            f"{target_desc}\n"
            f"Additional Context: {context}\n\n"
            "Generate the best SEO and OG metadata to maximize Google rankings and AI search visibility (GEO)."
        )
        
        result = await AIService.generate_response(
            provider="openai",
            model="gpt-4o-mini",
            prompt=prompt,
            system_prompt=system_prompt
        )
        return result["response"]
