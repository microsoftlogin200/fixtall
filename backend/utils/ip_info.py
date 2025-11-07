import requests
import logging
from typing import Optional, Dict

logger = logging.getLogger(__name__)


def get_country_from_ip(ip_address: str) -> str:
    """
    Get country from IP address using free ip-api.com service.
    Returns country name or 'Unknown' if lookup fails.
    """
    if not ip_address or ip_address == "127.0.0.1" or ip_address.startswith("192.168.") or ip_address.startswith("10."):
        return "Local/Private Network"
    
    try:
        # Using free ip-api.com service (no API key required)
        response = requests.get(f"http://ip-api.com/json/{ip_address}", timeout=3)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'success':
                country = data.get('country', 'Unknown')
                city = data.get('city', '')
                region = data.get('regionName', '')
                
                # Build location string
                location_parts = [city, region, country]
                location = ', '.join([part for part in location_parts if part])
                
                return location if location else 'Unknown'
        
        return 'Unknown'
    
    except Exception as e:
        logger.warning(f"Failed to get country for IP {ip_address}: {str(e)}")
        return 'Unknown'


def get_client_ip(request) -> str:
    """
    Extract the client's real IP address from the request.
    Handles proxies and load balancers.
    """
    # Check common headers used by proxies
    x_forwarded_for = request.headers.get('X-Forwarded-For')
    if x_forwarded_for:
        # X-Forwarded-For can contain multiple IPs, get the first one (client IP)
        ip = x_forwarded_for.split(',')[0].strip()
        return ip
    
    x_real_ip = request.headers.get('X-Real-IP')
    if x_real_ip:
        return x_real_ip
    
    # Fallback to client address
    if hasattr(request, 'client') and request.client:
        return request.client.host
    
    return 'Unknown'
