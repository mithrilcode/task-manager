from uuid import UUID

from jose import JWTError, jwt
from sqlalchemy.orm import Session

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from backend_app.api.dependencies import get_db
from backend_app.core.config import settings
from backend_app.models.user import User


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class InvalidTokenError(Exception):
    """Raised when a JWT is invalid or expired."""


class UserNotFoundError(Exception):
    """Raised when a user referenced by a token does not exist."""


def decode_access_token(token: str) -> UUID:
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm],
        )
    except JWTError:
        raise InvalidTokenError("Invalid or expired token")

    user_id = payload.get("sub")
    if user_id is None:
        raise InvalidTokenError("Token missing subject")

    try:
        return UUID(user_id)
    except ValueError:
        raise InvalidTokenError("Invalid user ID in token")


def get_user_by_id(db: Session, user_id: UUID) -> User:
    """Return a user by ID or raise if not found."""
    user = db.get(User, user_id)
    if user is None:
        raise UserNotFoundError("User not found")
    return user


def get_current_user_from_token(token: str, db: Session) -> User:
    user_id = decode_access_token(token)
    return get_user_by_id(db, user_id)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    try:
        return get_current_user_from_token(token, db)
    except (InvalidTokenError, UserNotFoundError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
