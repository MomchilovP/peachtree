"""
Security utilities for authentication and password hashing.
Uses only Python standard library - no external dependencies.
"""

import hashlib
import hmac
import json
import base64
from datetime import datetime, timedelta
from typing import Optional
from app.core.config import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash using SHA-256"""
    return hashed_password == get_password_hash(plain_password)


def get_password_hash(password: str) -> str:
    """Hash a password using SHA-256 with salt"""
    salt = settings.SECRET_KEY
    return hashlib.sha256((password + salt).encode()).hexdigest()


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a simple JWT-like token using HMAC"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire.timestamp()})

    # Create a simple token structure
    header = {"alg": "HS256", "typ": "JWT"}

    # Encode header and payload
    header_encoded = (
        base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    )

    payload_encoded = (
        base64.urlsafe_b64encode(json.dumps(to_encode).encode()).decode().rstrip("=")
    )

    # Create signature
    message = f"{header_encoded}.{payload_encoded}"
    signature = hmac.new(
        settings.SECRET_KEY.encode(), message.encode(), hashlib.sha256
    ).digest()

    signature_encoded = base64.urlsafe_b64encode(signature).decode().rstrip("=")

    return f"{header_encoded}.{payload_encoded}.{signature_encoded}"


def verify_token(token: str) -> Optional[str]:
    """Verify and decode a simple JWT-like token"""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None

        header_encoded, payload_encoded, signature_encoded = parts

        # Verify signature
        message = f"{header_encoded}.{payload_encoded}"
        expected_signature = hmac.new(
            settings.SECRET_KEY.encode(), message.encode(), hashlib.sha256
        ).digest()

        # Decode received signature
        received_signature = base64.urlsafe_b64decode(
            signature_encoded + "=" * (4 - len(signature_encoded) % 4)
        )

        if not hmac.compare_digest(expected_signature, received_signature):
            return None

        # Decode payload
        payload_json = base64.urlsafe_b64decode(
            payload_encoded + "=" * (4 - len(payload_encoded) % 4)
        ).decode()
        payload = json.loads(payload_json)

        # Check expiration
        if payload.get("exp", 0) < datetime.utcnow().timestamp():
            return None

        return payload.get("sub")

    except Exception:
        return None
