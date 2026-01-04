# backend/server.py (actualizado con 'request: Request' en endpoints con limiter para compatibilidad con SlowAPI)

from fastapi import FastAPI, Depends, HTTPException, Request, APIRouter, Query
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend
from fastapi_cache.decorator import cache
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import os
from datetime import datetime, timezone
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(docs_url="/api/docs")  # Habilita Swagger para testing

# Rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB
MONGO_URL = os.getenv("MONGO_URL")
client = AsyncIOMotorClient(MONGO_URL)
db = client["la_pulperia_db"]

# Índices
async def create_indexes():
    await db.products.create_index("name")
    await db.pulperias.create_index("name")
    logger.info("Índices creados")

@app.on_event("startup")
async def startup_event():
    await create_indexes()
    FastAPICache.init(InMemoryBackend(), prefix="fastapi-cache")
    logger.info("¡Server iniciado correctamente!")

class HealthResponse(BaseModel):
    status: str

@app.get("/api/health", response_model=HealthResponse)
@limiter.limit("100/minute")
async def health(request: Request):
    return {"status": "healthy"}

# Router para endpoints API (incluyendo auth)
api_router = APIRouter()

@api_router.get("/global-announcements")
@cache(expire=300)
@limiter.limit("100/minute")
async def global_announcements(request: Request):
    announcements = await db.global_announcements.find().to_list(100)
    return announcements

@api_router.get("/products")
@cache(expire=300)
@limiter.limit("100/minute")
async def products_search(request: Request, search: str = ""):
    query = {"name": {"$regex": search, "$options": "i"}} if search else {}
    products = await db.products.find(query).to_list(100)
    return products

@api_router.get("/pulperias")
@cache(expire=300)
@limiter.limit("100/minute")
async def pulperias_search(request: Request, search: str = ""):
    query = {"name": {"$regex": search, "$options": "i"}} if search else {}
    pulperias = await db.pulperias.find(query).to_list(100)
    return pulperias

# Endpoint para obtener URL de auth Google (usando env vars)
@api_router.get("/auth/google/url")
@limiter.limit("100/minute")
async def get_google_auth_url(request: Request, redirect_uri: str = Query(...)):
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    if not client_id:
        raise HTTPException(status_code=500, detail="Google Client ID not configured")
    
    auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={client_id}&"
        f"redirect_uri={redirect_uri}&"
        f"response_type=code&"
        f"scope=email profile&"
        f"access_type=offline"
    )
    return {"auth_url": auth_url}

# Endpoint de callback (ajusta según tu lógica; usa env var para secret si necesitas)
from google.oauth2 import id_token  # Import para verificación (si usas en callback)
from google.auth.transport import requests as google_requests

@api_router.get("/auth/google/callback")
@limiter.limit("100/minute")  # Agregado si quieres limit, sino quita
async def google_callback(request: Request, code: str):
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    if not client_id or not client_secret:
        raise HTTPException(status_code=500, detail="Google credentials not configured")
    
    # Lógica de intercambio de code por token (ejemplo placeholder; implementa según necesidades)
    # Por ejemplo: Usa requests para post a Google token endpoint
    token_url = "https://oauth2.googleapis.com/token"
    payload = {
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": "TU_REDIRECT_URI",  # Reemplaza con el real (puede venir de env o query)
        "grant_type": "authorization_code"
    }
    # response = requests.post(token_url, data=payload)  # Descomenta y maneja
    return {"message": "Auth successful"}  # Placeholder; actualiza con lógica real

# Incluye el router en la app con prefix /api
app.include_router(api_router, prefix="/api")

# Agrega aquí tus otros endpoints (email, etc.) si los tienes

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    logger.error(f"Error: {exc.detail}")
    return {"error": exc.detail}
