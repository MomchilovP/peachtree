"""
CRUD operations for User and Transaction models.
Handles database operations.
"""

from sqlalchemy.orm import Session
from typing import Optional, List

from app.models import User, Transaction
from app.schemas import UserCreate, TransactionCreate, TransactionUpdate
from app.core.security import get_password_hash, verify_password


# User CRUD operations
def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        hashed_password=hashed_password,
        full_name=user.full_name,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()


def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
    user = get_user_by_username(db, username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


# Transaction CRUD operations
def create_transaction(
    db: Session, transaction: TransactionCreate, user_id: int
) -> Transaction:
    # Get the sender user
    sender = db.query(User).filter(User.id == user_id).first()
    if not sender:
        raise ValueError("Sender user not found")

    # Check if sender has sufficient funds
    if sender.balance < transaction.amount:
        raise ValueError("Insufficient funds")

    # Check if contractor (recipient) exists by username
    recipient = get_user_by_username(db, transaction.contractor)
    if not recipient:
        raise ValueError(f"Recipient user '{transaction.contractor}' not found")

    # Check if user is trying to send money to themselves
    if sender.id == recipient.id:
        raise ValueError("Cannot send money to yourself")

    # Start transaction - deduct from sender and add to recipient
    sender.balance -= transaction.amount
    recipient.balance += transaction.amount

    # Create transaction record for sender
    db_transaction = Transaction(
        contractor=transaction.contractor,
        amount=transaction.amount,
        type=transaction.type,
        user_id=user_id,
    )

    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


def get_transaction(db: Session, transaction_id: int) -> Optional[Transaction]:
    return db.query(Transaction).filter(Transaction.id == transaction_id).first()


def get_user_transactions(db: Session, user_id: int) -> List[Transaction]:
    return db.query(Transaction).filter(Transaction.user_id == user_id).all()


def update_transaction_status(
    db: Session, transaction_id: int, status_update: TransactionUpdate
) -> Optional[Transaction]:
    db_transaction = get_transaction(db, transaction_id)
    if not db_transaction:
        return None

    db_transaction.type = status_update.type
    db.commit()
    db.refresh(db_transaction)
    return db_transaction
