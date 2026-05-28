import json
import time
from typing import Optional, Dict, Any
from app.config import settings
from app.services.ai_health import AIHealthService

# Need to implement the wrapper over httpx similar to what was done for test endpoint
import httpx

class ResumeAIWorkflowService:
    
    @staticmethod
    async def _call_llm(prompt: str, system_prompt: str, json_mode: bool = False) -> str:
        """Helper to call the active LLM."""
        provider = settings.AI_PROVIDER
        
        if provider == 'openai':
            model = settings.OPENAI_MODEL
            headers = {"Authorization": f"Bearer {settings.OPENAI_API_KEY}"}
            payload: Dict[str, Any] = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ]
            }
            if json_mode and "gpt" in model:
                payload["response_format"] = { "type": "json_object" }
                
            async with httpx.AsyncClient() as client:
                resp = await client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=60.0)
                resp.raise_for_status()
                return resp.json()["choices"][0]["message"]["content"]
                
        elif provider == 'gemini':
            model = settings.GEMINI_MODEL
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={settings.GEMINI_API_KEY}"
            
            # Gemini JSON mode (for Gemini 1.5 Pro)
            generation_config = {}
            if json_mode:
                generation_config["response_mime_type"] = "application/json"
                
            payload = {
                "contents": [
                    {"role": "user", "parts": [{"text": f"{system_prompt}\n\n{prompt}"}]}
                ],
                "generationConfig": generation_config
            }
            
            async with httpx.AsyncClient() as client:
                resp = await client.post(url, json=payload, timeout=60.0)
                resp.raise_for_status()
                return resp.json()["candidates"][0]["content"]["parts"][0]["text"]
        
        raise ValueError(f"Unknown AI Provider: {provider}")


    @staticmethod
    async def parse_resume_text(text: str) -> dict:
        """
        Takes raw text (from PDF/DOCX parsing) and returns a structured ResumeSchema representation.
        """
        system_prompt = """
        You are an expert resume parser. Extract the information from the provided raw text and format it EXACTLY according to the following JSON structure. 
        Do not add any Markdown formatting like ```json. Return ONLY raw JSON.

        Required Structure:
        {
          "version": "1.0",
          "metadata": {
            "title": "Parsed Resume",
            "templateId": "modern-professional",
            "themeId": "clean-white",
            "targetOccupation": "Auto-detect from text"
          },
          "theme": { "primary": "#2563eb", "fontFamily": "Inter, sans-serif", "fontSize": "14px", "lineHeight": "1.5" },
          "blocks": {
            "block-header": {
              "id": "block-header", "type": "header", 
              "data": { "name": "", "title": "", "email": "", "phone": "", "location": "", "website": "" }
            },
            "block-summary": {
               "id": "block-summary", "type": "text", "data": { "content": "Professional summary...", "variant": "p" }
            },
            "block-sec-exp": { "id": "block-sec-exp", "type": "section", "data": { "title": "Experience" } },
            // Generate IDs like block-exp-1, block-exp-2, etc. for each experience
            // type: "experience_item", data: { "company": "", "role": "", "location": "", "startDate": "", "endDate": "", "description": "• Bullet points" }
            
            "block-sec-edu": { "id": "block-sec-edu", "type": "section", "data": { "title": "Education" } },
            // Generate IDs like block-edu-1 for education (type: "text", data: { "content": "...", "variant": "p" })
            
            "block-sec-skills": { "id": "block-sec-skills", "type": "section", "data": { "title": "Skills" } },
            "block-skills-1": { "id": "block-skills-1", "type": "text", "data": { "content": "Comma separated skills", "variant": "p" } }
          },
          "layout": [
             "block-header", "block-summary", "block-sec-exp", 
             // ... include all generated block IDs in correct order
             "block-sec-edu", "block-sec-skills", "block-skills-1"
          ]
        }
        """
        
        try:
            result_text = await ResumeAIWorkflowService._call_llm(text, system_prompt, json_mode=True)
            return json.loads(result_text)
        except Exception as e:
            raise Exception(f"Failed to parse resume: {str(e)}")

    @staticmethod
    async def analyze_ats(resume_data: dict, job_description: str = "", target_profession: str = "") -> dict:
        """
        Analyzes the resume data against an optional JD and returns ATS score and issues.
        """
        # Convert schema to flat text for analysis
        flat_text = json.dumps(resume_data.get('blocks', {}))
        
        system_prompt = """
        You are an expert ATS (Applicant Tracking System) analyzer. 
        Analyze the provided resume content. If a Job Description is provided, analyze the match against that JD.
        If no JD is provided, analyze against general best practices for the Target Profession.
        
        Return ONLY valid JSON in this exact format:
        {
          "score": 0-100,
          "readability": 0-100,
          "keywordDensity": 0-100,
          "missingKeywords": ["keyword1", "keyword2", ...],
          "issues": [
            {
              "type": "missing_keyword" | "weak_action_verb" | "formatting" | "length",
              "message": "Description of the issue",
              "severity": "high" | "medium" | "low"
            }
          ]
        }
        """
        
        prompt = f"Target Profession: {target_profession}\n\nJob Description:\n{job_description}\n\nResume Content:\n{flat_text}"
        
        try:
            result_text = await ResumeAIWorkflowService._call_llm(prompt, system_prompt, json_mode=True)
            return json.loads(result_text)
        except Exception as e:
            raise Exception(f"Failed to analyze ATS: {str(e)}")


    @staticmethod
    async def optimize_resume(resume_data: dict, ats_analysis: dict, job_description: str = "", target_profession: str = "") -> dict:
        """
        Takes the current resume schema, the ATS issues, and a JD, and returns a fully rewritten schema.
        """
        system_prompt = """
        You are an expert resume writer and optimizer.
        I will provide a JSON representing a resume, a Job Description (optional), and a list of ATS issues.
        
        Your task is to REWRITE the content of the 'blocks' to fix the ATS issues and match the Job Description.
        - Inject missing keywords naturally into the summary and experience bullets.
        - Rewrite weak bullet points to start with strong action verbs and include metrics/quantified results.
        - DO NOT change the structure, keys, or IDs of the JSON. Only change the 'content', 'description', and 'title' values inside the 'data' objects.
        
        Return the EXACT SAME JSON structure, but with optimized text. Return ONLY valid JSON.
        """
        
        prompt = f"Target Profession: {target_profession}\n\nATS Issues:\n{json.dumps(ats_analysis)}\n\nJob Description:\n{job_description}\n\nCurrent Resume JSON:\n{json.dumps(resume_data)}"
        
        try:
            result_text = await ResumeAIWorkflowService._call_llm(prompt, system_prompt, json_mode=True)
            return json.loads(result_text)
        except Exception as e:
            raise Exception(f"Failed to optimize resume: {str(e)}")
