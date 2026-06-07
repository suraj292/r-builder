import httpx
from app.config import settings

class AIHealthService:
    @staticmethod
    async def check_openai_health() -> dict:
        if not settings.OPENAI_API_KEY:
            return {"status": "missing_key", "message": "OpenAI API Key is not configured."}
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://api.openai.com/v1/models",
                    headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                    timeout=5.0
                )
                if response.status_code == 200:
                    return {"status": "healthy", "message": "Connected successfully."}
                elif response.status_code == 401:
                    return {"status": "unauthorized", "message": "Invalid API Key."}
                elif response.status_code == 429:
                    return {"status": "limit_exceeded", "message": "Quota exceeded or rate limited."}
                else:
                    return {"status": "error", "message": f"Unexpected error: {response.status_code}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    @staticmethod
    async def check_gemini_health() -> dict:
        if not settings.GEMINI_API_KEY:
            return {"status": "missing_key", "message": "Gemini API Key is not configured."}
        
        try:
            # Gemini health check via models list
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"https://generativelanguage.googleapis.com/v1beta/models?key={settings.GEMINI_API_KEY}",
                    timeout=5.0
                )
                if response.status_code == 200:
                    return {"status": "healthy", "message": "Connected successfully."}
                elif response.status_code == 400:
                    return {"status": "unauthorized", "message": "Invalid API Key."}
                else:
                    return {"status": "error", "message": f"Unexpected error: {response.status_code}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
