import uuid
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.core.security import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    verify_password,
)
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.user_schema import (
    ForgotPasswordRequest,
    RefreshTokenRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserLoginRequest,
    UserOut,
    UserRegisterRequest,
)

router = APIRouter(prefix="/auth")


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED, summary="Register New Motorist Account")
async def register(
    data: UserRegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Registers a new motorist account and returns authentication access and refresh tokens.
    """
    normalized_email = data.email.lower().strip()

    # Check for existing email
    query = select(User).where(User.email == normalized_email)
    result = await db.execute(query)
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    # Create new user
    new_user = User(
        id=uuid.uuid4(),
        email=normalized_email,
        password_hash=get_password_hash(data.password),
        display_name=data.display_name.strip(),
        role="USER",
        is_active=True,
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # Generate Tokens
    access_token = create_access_token(subject=str(new_user.id))
    refresh_token = create_refresh_token(subject=str(new_user.id))

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserOut.model_validate(new_user),
    )


@router.post("/login", response_model=TokenResponse, summary="Authenticate Motorist")
async def login(
    data: UserLoginRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Authenticates email and password credentials, returning fresh access and refresh tokens.
    """
    normalized_email = data.email.lower().strip()

    query = select(User).where(User.email == normalized_email)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been deactivated. Please contact support.",
        )

    access_token = create_access_token(subject=str(user.id))
    refresh_token = create_refresh_token(subject=str(user.id))

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserOut.model_validate(user),
    )


@router.post("/refresh", response_model=TokenResponse, summary="Rotate Refresh Token")
async def refresh_token(
    data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Rotates the refresh token and returns a new access token paired with a new refresh token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired refresh token.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(data.refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id_str: str = payload.get("sub")
        token_type: str = payload.get("type")

        if user_id_str is None or token_type != "refresh":
            raise credentials_exception

        user_id = uuid.UUID(user_id_str)
    except (JWTError, ValueError):
        raise credentials_exception

    user = await db.get(User, user_id)
    if user is None or not user.is_active:
        raise credentials_exception

    # Token Rotation: Issue both a new access token AND a new refresh token
    new_access_token = create_access_token(subject=str(user.id))
    new_refresh_token = create_refresh_token(subject=str(user.id))

    return TokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserOut.model_validate(user),
    )


@router.get("/me", response_model=UserOut, summary="Get Current User Profile")
async def get_me(
    current_user: User = Depends(get_current_user),
):
    """
    Returns the profile and role details of the currently authenticated motorist.
    """
    return UserOut.model_validate(current_user)


@router.post("/forgot-password", response_model=APIResponse[dict], summary="Request Password Reset")
async def forgot_password(
    data: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Initiates password reset by issuing a signed temporary reset token.
    """
    normalized_email = data.email.lower().strip()
    query = select(User).where(User.email == normalized_email)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if user and user.is_active:
        # Create a 15-minute password reset token
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
        reset_payload = {"exp": expire, "sub": str(user.id), "type": "reset"}
        reset_token = jwt.encode(reset_payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        # In production this dispatches an email via Resend/Sendgrid
        return APIResponse(
            success=True,
            message="If this email is registered, a password reset instruction has been sent.",
            data={"reset_token_preview": reset_token} if settings.ENVIRONMENT == "development" else None,
        )

    # Always return success to prevent email enumeration attacks
    return APIResponse(
        success=True,
        message="If this email is registered, a password reset instruction has been sent.",
    )


@router.post("/reset-password", response_model=APIResponse[dict], summary="Complete Password Reset")
async def reset_password(
    data: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Validates reset token and sets the new password.
    """
    try:
        payload = jwt.decode(data.token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id_str: str = payload.get("sub")
        token_type: str = payload.get("type")

        if user_id_str is None or token_type != "reset":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset token.")

        user_id = uuid.UUID(user_id_str)
    except (JWTError, ValueError):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Expired or malformed reset token.")

    user = await db.get(User, user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found or inactive.")

    user.password_hash = get_password_hash(data.new_password)
    await db.commit()

    return APIResponse(success=True, message="Your password has been successfully reset. You may now log in.")
