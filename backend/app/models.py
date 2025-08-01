from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Enum as SQLEnum,
    ForeignKey,
    Numeric,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, declarative_base
from enum import Enum

Base = declarative_base()


class TransactionStatus(str, Enum):
    SENT = "sent"
    RECEIVED = "received"
    PAID = "paid"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    balance = Column(Numeric(precision=10, scale=2), default=1000.00)

    # Relationship
    transactions = relationship("Transaction", back_populates="user")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime(timezone=True), server_default=func.now())
    contractor = Column(String, nullable=False)
    type = Column(SQLEnum(TransactionStatus), default=TransactionStatus.SENT)
    amount = Column(Numeric(precision=10, scale=2), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationship
    user = relationship("User", back_populates="transactions")
