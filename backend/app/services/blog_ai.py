import json
from typing import List, Dict, Any
from app.services.ai_service import AIService
from app.config import settings

class BlogAIService:
    @staticmethod
    async def generate_outline(title: str, target_audience: str, tone: str) -> str:
        system_prompt = (
            "You are an expert career coach and blog strategist. "
            "Your goal is to generate a comprehensive, high-converting blog post outline "
            "specifically designed to help job seekers and professionals. "
            "The outline should be SEO-optimized and structured with H2 and H3 headings. "
            "Format the output as a clear, readable outline."
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
            "You are an expert copywriter and SEO specialist. "
            "Your task is to take a draft blog title and suggest 5 optimized alternatives. "
            "The alternatives should be catchy, high-CTR, and include keywords for better ranking."
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
            "You are an AI SEO Auditor. Your job is to analyze a blog post's metadata and content "
            "to provide actionable recommendations for improving search engine visibility."
        )
        
        prompt = (
            f"Analyze the following blog post details:\n"
            f"Title: {title}\n"
            f"Excerpt: {excerpt or 'Not provided'}\n"
            f"Content Preview: {content_preview[:2000]}...\n\n"
            f"Please provide:\n"
            f"1. A recommended SEO Title (max 60 chars)\n"
            f"2. A recommended Meta Description (max 160 chars)\n"
            f"3. 5 Focus Keywords\n"
            f"4. 3 suggestions for improving content SEO (e.g., heading structure, keyword usage)."
        )
        
        result = await AIService.generate_response(
            provider="openai",
            model="gpt-4o-mini",
            prompt=prompt,
            system_prompt=system_prompt
        )
        return result["response"]
