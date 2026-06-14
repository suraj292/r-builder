import json
import os
import httpx
from google.oauth2 import service_account
from google.auth.transport.requests import Request
from fastapi import HTTPException

class GoogleIndexingService:
    SCOPES = ['https://www.googleapis.com/auth/indexing']
    ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish'
    
    @classmethod
    def _get_credentials(cls):
        """
        Loads credentials from backend/service_account.json
        """
        # Look for service_account.json in the backend directory
        cred_path = os.path.join(os.getcwd(), "service_account.json")
        
        if not os.path.exists(cred_path):
            # Try one level up if we are in app/api/v1 (though os.getcwd() should be backend root)
            alt_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "service_account.json")
            if os.path.exists(alt_path):
                cred_path = alt_path
            else:
                raise HTTPException(
                    status_code=400, 
                    detail="Google Service Account key (service_account.json) missing in backend root."
                )
        
        try:
            return service_account.Credentials.from_service_account_file(
                cred_path, scopes=cls.SCOPES
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to load Google credentials: {str(e)}")

    @classmethod
    async def submit_urls(cls, urls: list[str], action: str = "URL_UPDATED"):
        """
        Submits a list of URLs to the Google Indexing API.
        action: 'URL_UPDATED' (force crawl) or 'URL_DELETED'
        """
        creds = cls._get_credentials()
        
        # Refresh credentials to get access token
        creds.refresh(Request())
        token = creds.token
        
        results = []
        async with httpx.AsyncClient() as client:
            for url in urls:
                try:
                    payload = {
                        "url": url,
                        "type": action
                    }
                    headers = {
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {token}"
                    }
                    
                    response = await client.post(
                        cls.ENDPOINT,
                        json=payload,
                        headers=headers
                    )
                    
                    if response.status_code == 200:
                        results.append({"url": url, "status": "success", "data": response.json()})
                    else:
                        results.append({
                            "url": url, 
                            "status": "error", 
                            "code": response.status_code, 
                            "detail": response.text
                        })
                except Exception as e:
                    results.append({"url": url, "status": "exception", "detail": str(e)})
                    
        return results
