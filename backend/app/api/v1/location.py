from fastapi import APIRouter, Request
from app.services.location_service import LocationService

router = APIRouter()

@router.get("/currency")
async def get_currency_info(request: Request):
    """
    Get currency and location info based on requester's IP.
    """
    # Get client IP, taking proxy headers into account
    client_ip = request.headers.get("x-forwarded-for")
    if not client_ip:
        client_ip = request.client.host
    else:
        # x-forwarded-for can be a list: "client, proxy1, proxy2"
        client_ip = client_ip.split(",")[0]
        
    return await LocationService.get_location_from_ip(client_ip)
