# backend/server.py
# This is a reconstructed version based on the available documentation, test scripts, and error logs.
# I've fixed the rate limiter issue by adding 'request: Request' to the get_google_auth_url function.
# Note: This may not be the exact code, as the original file wasn't accessible. Update with your actual imports and logic as needed.

from fastapi import FastAPI, APIRouter, Request, Query
from fastapi.responses import JSONResponse
from urllib.parse import urlencode
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Load environment variables
load_dotenv()

# Environment variables
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "la_pulperia_db")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
# Add other env vars as needed, e.g., RESEND_API_KEY for email

# MongoDB client (example connection)
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# FastAPI app
app = FastAPI()

# Rate limiter setup
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# API router
api_router = APIRouter(prefix="/api")

# Example health endpoint (from tests)
@api_router.get("/health")
async def health():
    return {"status": "healthy"}

# Example global announcements endpoint (from tests, returns empty list initially)
@api_router.get("/global-announcements")
async def get_global_announcements():
    # In real code, query db.announcements.find() or similar
    return []

# Example products search endpoint (from tests)
@api_router.get("/products")
async def get_products(search: str = Query(None)):
    # In real code, query db.products.find({"name": {"$regex": search}}) or similar
    return {"products": []}  # Placeholder

# Example pulperias search endpoint (from tests)
@api_router.get("/pulperias")
async def get_pulperias(search: str = Query(None)):
    # In real code, query db.pulperias.find({"name": {"$regex": search}}) or similar
    return {"pulperias": []}  # Placeholder

# Google auth URL endpoint (fixed with request for limiter)
@api_router.get("/auth/google/url")
@limiter.limit("100/minute")
async def get_google_auth_url(request: Request, redirect_uri: str):
    google_auth_url = "https://accounts.google.com/o/oauth2/v2/auth"
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "email profile openid",
        "access_type": "offline",
        "prompt": "consent",
    }
    auth_url = google_auth_url + "?" + urlencode(params)
    return {"auth_url": auth_url}

# Add other endpoints here, e.g., /auth/google/callback, etc.
# For example:
# @api_router.get("/auth/google/callback")
# async def google_callback(code: str):
#     # Handle code exchange for token, etc.
#     pass

# Include the router
app.include_router(api_router)

# If there are more routes or middleware, add them here.

if __name__ == "__main__":
    # This is typically run via uvicorn, but for testing
    pass
