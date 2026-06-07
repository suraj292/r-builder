import asyncio
import os
from dotenv import load_dotenv

# Load env from backend/.env
load_dotenv("backend/.env")

import sys
sys.path.append("backend")

from app.services.blog_ai import BlogAIService

async def test():
    try:
        # Mocking what happens in the endpoint
        path = "/about"
        context = "ResumeAI About Us page"
        print(f"Testing optimization for {path} with context: {context}")
        suggestion = await BlogAIService.optimize_page_seo(path, context)
        print("Suggestion received:", suggestion)
    except Exception as e:
        print("Error caught:", str(e))
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())
