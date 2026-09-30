import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


# --- USER SCHEMAS ---

class UserBase(BaseModel):
    email: EmailStr
    display_name: str = Field(..., min_length=2, max_length=100)


class UserRegisterRequest(UserBase):
    password: str = Field(..., min_length=8, max_length=128, description="Password with min 8 characters")


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(UserBase):
    id: uuid.UUID
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdateRequest(BaseModel):
    display_name: Optional[str] = Field(None, min_length=2, max_length=100)
    current_password: Optional[str] = None
    new_password: Optional[str] = Field(None, min_length=8, max_length=128)


# --- TOKEN SCHEMAS ---

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserOut


class RefreshTokenRequest(BaseModel):
    refresh_token: str


# --- PASSWORD RESET SCHEMAS ---

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)
