from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.deps import get_current_user
from app.schemas import Transaction, TransactionCreate, TransactionUpdate, User
from app.crud.crud import (
    create_transaction,
    get_transaction,
    get_user_transactions,
    update_transaction_status,
)

router = APIRouter()


@router.post("/", response_model=Transaction, status_code=status.HTTP_201_CREATED)
async def create_transaction_endpoint(
    transaction: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new transaction for the authenticated user"""
    try:
        return create_transaction(
            db=db, transaction=transaction, user_id=current_user.id
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/", response_model=List[Transaction])
async def list_transactions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all transactions for the authenticated user"""
    return get_user_transactions(db, current_user.id)


@router.get("/{transaction_id}", response_model=Transaction)
async def get_transaction_details(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get transaction details by ID (only if it belongs to the authenticated user)"""
    db_transaction = get_transaction(db, transaction_id)
    if not db_transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found"
        )

    # Ensure the transaction belongs to the current user
    if db_transaction.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this transaction",
        )

    return db_transaction


@router.put("/{transaction_id}", response_model=Transaction)
async def update_transaction_endpoint(
    transaction_id: int,
    transaction_update: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update transaction status (only if it belongs to the authenticated user)"""
    db_transaction = get_transaction(db, transaction_id)
    if not db_transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found"
        )

    # Ensure the transaction belongs to the current user
    if db_transaction.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this transaction",
        )

    updated_transaction = update_transaction_status(
        db, transaction_id, transaction_update
    )
    return updated_transaction
