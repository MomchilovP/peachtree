from typing import Optional
from pydantic import BaseModel, Field, validator
from datetime import datetime
from decimal import Decimal
from enum import Enum


class TransactionStatus(str, Enum):
    SENT = "sent"
    RECEIVED = "received"
    PAID = "paid"


# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# User schemas
class UserCreate(BaseModel):
    username: str = Field(
        ..., min_length=3, max_length=50, description="Username (3-50 characters)"
    )
    password: str = Field(
        ..., min_length=6, max_length=100, description="Password (minimum 6 characters)"
    )
    full_name: Optional[str] = Field(
        None, max_length=100, description="Full name (optional)"
    )

    @validator("username")
    def username_alphanumeric(cls, v):
        if not v.replace("_", "").replace("-", "").isalnum():
            raise ValueError(
                "Username must contain only letters, numbers, underscores, and hyphens"
            )
        return v


class UserLogin(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=1, max_length=100)


class User(BaseModel):
    id: int
    username: str
    full_name: Optional[str] = None
    balance: Decimal

    class Config:
        from_attributes = True


# Transaction schemas
class TransactionCreate(BaseModel):
    contractor: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Contractor name or destination account",
    )
    amount: Decimal = Field(
        ..., gt=0, decimal_places=2, description="Transaction amount (must be positive)"
    )
    type: TransactionStatus = Field(
        default=TransactionStatus.SENT, description="Transaction type"
    )


class TransactionUpdate(BaseModel):
    type: TransactionStatus = Field(..., description="New transaction status")


class Transaction(BaseModel):
    id: int
    date: datetime
    contractor: str
    type: TransactionStatus
    amount: Decimal
    user_id: int

    class Config:
        from_attributes = True
