from fastapi import FastAPI, Depends, HTTPException, Request
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

app = FastAPI()

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

@app.get("/api/global-announcements")
@cache(expire=300)
@limiter.limit("100/minute")
async def global_announcements(request: Request):
    announcements = await db.global_announcements.find().to_list(100)
    return announcements

@app.get("/api/products")
@cache(expire=300)
@limiter.limit("100/minute")
async def products_search(request: Request, search: str = ""):  # FIX: request primero
    query = {"name": {"$regex": search, "$options": "i"}} if search else {}
    products = await db.products.find(query).to_list(100)
    return products

@app.get("/api/pulperias")
@cache(expire=300)
@limiter.limit("100/minute")
async def pulperias_search(request: Request, search: str = ""):  # FIX: request primero
    query = {"name": {"$regex": search, "$options": "i"}} if search else {}
    pulperias = await db.pulperias.find(query).to_list(100)
    return pulperias

# Agrega aquí tus otros endpoints (auth, email, etc.) tal como estaban

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    logger.error(f"Error: {exc.detail}")
    return {"error": exc.detail}
