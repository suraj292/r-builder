import asyncio
import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from app.services.google_analytics import GoogleAnalyticsService

async def test_analytics():
    property_id = "540212767"
    print(f"Testing GA4 Data API for Property ID: {property_id}")
    try:
        stats = await GoogleAnalyticsService.get_basic_stats(property_id, days=30)
        print("Stats fetched successfully:", stats)
        
        sources = await GoogleAnalyticsService.get_traffic_sources(property_id, days=30)
        print("Sources fetched successfully:", sources)
    except Exception as e:
        print("Error encountered:", str(e))

if __name__ == "__main__":
    # Ensure we are in the root so service_account.json can be found or adjust path
    # The service expects service_account.json in os.getcwd() (which will be root if run from root)
    # or it tries to find it relative to the file.
    asyncio.run(test_analytics())
