from fastapi import APIRouter
from app.api.endpoints import auth, transactions

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(
    transactions.router, prefix="/transactions", tags=["transactions"]
)
