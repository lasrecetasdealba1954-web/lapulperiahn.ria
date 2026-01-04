from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend  # O usa Redis si configuras
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

# CORS (mejorado: solo origins permitidos, de tu .env)
origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB conexión async
MONGO_URL = os.getenv("MONGO_URL")
client = AsyncIOMotorClient(MONGO_URL)
db = client["la_pulperia_db"]

# Crear índices para optimizar búsquedas (ejecuta una vez)
async def create_indexes():
    await db.products.create_index("name")  # Index para search
    await db.pulperias.create_index("name")
    logger.info("Índices de DB creados para optimización.")

@app.on_event("startup")
async def startup_event():
    await create_indexes()
    FastAPICache.init(InMemoryBackend(), prefix="fastapi-cache")  # Init caching
    logger.info("Server started successfully!")

# Modelos (ejemplo, ajusta si necesitas)
class HealthResponse(BaseModel):
    status: str

# Endpoints optimizados

@app.get("/api/health", response_model=HealthResponse)
@limiter.limit("100/minute")  # Rate limit
async def health(request: Request):
    return {"status": "healthy"}

@app.get("/api/global-announcements")
@cache(expire=300)  # Cache 5 min
@limiter.limit("100/minute")
async def global_announcements(request: Request):
    announcements = await db.global_announcements.find().to_list(100)
    return announcements

@app.get("/api/products")
@cache(expire=300)  # Cache searches
@limiter.limit("100/minute")
async def products_search(request: Request, search: str = ""):
    query = {"name": {"$regex": search, "$options": "i"}} if search else {}
    products = await db.products.find(query).to_list(100)
    return products

@app.get("/api/pulperias")
@cache(expire=300)
@limiter.limit("100/minute")
async def pulperias_search(request: Request, search: str = ""):
    query = {"name": {"$regex": search, "$options": "i"}} if search else {}
    pulperias = await db.pulperias.find(query).to_list(100)
    return pulperias

# Auth endpoints (simplificado y optimizado, ajusta según tu código original)
# ... (agrega tus auth routes aquí, hazlas async si no lo son)

# Email (de tus docs, optimizado)
# Asume tienes una función send_email, hazla async

# Manejo de errores global
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    logger.error(f"Error: {exc.detail}")
    return {"error": exc.detail}

# Otros endpoints de tus tests/docs (agrega similares con @cache y @limiter)
