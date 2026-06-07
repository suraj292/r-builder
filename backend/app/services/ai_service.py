import time
import httpx
from app.config import settings

class AIService:
    @staticmethod
    async def generate_response(provider: str, model: str, prompt: str, system_prompt: str) -> dict:
        start_time = time.time()
        
        if provider == "openai":
            return await AIService._openai_call(model, prompt, system_prompt, start_time)
        elif provider == "gemini":
            return await AIService._gemini_call(model, prompt, system_prompt, start_time)
        else:
            raise ValueError(f"Unsupported provider: {provider}")

    @staticmethod
    async def _openai_call(model: str, prompt: str, system_prompt: str, start_time: float):
        if not settings.OPENAI_API_KEY:
            raise ValueError("OpenAI API Key not configured")
            
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
                json={
                    "model": model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ]
                },
                timeout=30.0
            )
            
            if response.status_code != 200:
                raise Exception(f"OpenAI Error: {response.text}")
                
            data = response.json()
            return {
                "response": data["choices"][0]["message"]["content"],
                "latency": round(time.time() - start_time, 2)
            }

    @staticmethod
    async def _gemini_call(model: str, prompt: str, system_prompt: str, start_time: float):
        if not settings.GEMINI_API_KEY:
            raise ValueError("Gemini API Key not configured")
            
        async with httpx.AsyncClient() as client:
            # Gemini 1.5 format - using v1 for better model support
            url = f"https://generativelanguage.googleapis.com/v1/models/{model}:generateContent?key={settings.GEMINI_API_KEY}"
            response = await client.post(
                url,
                json={
                    "contents": [
                        {"role": "user", "parts": [{"text": f"{system_prompt}\n\nUser: {prompt}"}]}
                    ]
                },
                timeout=30.0
            )
            
            if response.status_code != 200:
                raise Exception(f"Gemini Error: {response.text}")
                
            data = response.json()
            return {
                "response": data["candidates"][0]["content"]["parts"][0]["text"],
                "latency": round(time.time() - start_time, 2)
            }
