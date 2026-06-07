import httpx
from typing import Dict, Any

class LocationService:
    @staticmethod
    async def get_location_from_ip(ip: str) -> Dict[str, Any]:
        """
        Detect country and currency info from IP.
        In production, prefer Cloudflare headers (CF-IPCountry) or a local GeoLite2 DB.
        """
        # Common local/private IP ranges
        if ip in ["127.0.0.1", "localhost", "::1"] or ip.startswith("192.168."):
            # For development, default to a specific region or use a public IP of the server
            return {
                "country": "India",
                "country_code": "IN",
                "currency": "INR",
                "symbol": "₹",
                "locale": "en-IN"
            }

        try:
            async with httpx.AsyncClient() as client:
                # Using ip-api.com (Free tier for non-commercial/testing)
                response = await client.get(f"http://ip-api.com/json/{ip}?fields=status,country,countryCode")
                data = response.json()
                
                if data.get("status") == "success":
                    country_code = data.get("countryCode")
                    return LocationService.get_currency_config(country_code, data.get("country"))
        except Exception as e:
            print(f"Location detection error: {e}")
            
        # Fallback to USD
        return {
            "country": "United States",
            "country_code": "US",
            "currency": "USD",
            "symbol": "$",
            "locale": "en-US"
        }

    @staticmethod
    def get_currency_config(country_code: str, country_name: str = "") -> Dict[str, Any]:
        """
        Map country code to currency rules.
        """
        # India Rule
        if country_code == "IN":
            return {
                "country": country_name or "India",
                "country_code": "IN",
                "currency": "INR",
                "symbol": "₹",
                "locale": "en-IN"
            }
        
        # Europe Rule (Approximate list of Eurozone codes)
        eu_countries = [
            "AT", "BE", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", 
            "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES"
        ]
        if country_code in eu_countries:
            return {
                "country": country_name or "Europe",
                "country_code": country_code,
                "currency": "EUR",
                "symbol": "€",
                "locale": "de-DE" # Generic EU locale
            }

        # Rest of World -> USD
        return {
            "country": country_name or "United States",
            "country_code": country_code,
            "currency": "USD",
            "symbol": "$",
            "locale": "en-US"
        }
