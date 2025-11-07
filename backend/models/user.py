from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    """Schema for user registration."""
    email: EmailStr
    password: str
    name: str


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema for user data in responses (no password)."""
    id: str
    email: str
    name: str
    created_at: Optional[datetime] = None


class CheckEmailRequest(BaseModel):
    """Schema for checking if email exists."""
    email: EmailStr


class CheckEmailResponse(BaseModel):
    """Schema for email check response."""
    exists: bool
    email: str


class ForgotPasswordRequest(BaseModel):
    """Schema for password reset request."""
    email: EmailStr


class AuthResponse(BaseModel):
    """Schema for authentication success response."""
    success: bool
    user: UserResponse
    token: str


class ErrorResponse(BaseModel):
    """Schema for error responses."""
    success: bool = False
    message: str


class SuccessResponse(BaseModel):
    """Schema for generic success responses."""
    success: bool = True
    message: str


class UserDB(BaseModel):
    """Schema for user document in MongoDB."""
    email: str
    password_hash: str
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)