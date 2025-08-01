from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import api_router


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="A secure banking transaction API with user authentication",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    """Root endpoint - API status"""
    return {
        "message": "PeachTree Bank API",
        "version": settings.VERSION,
        "docs": "/docs",
    }
