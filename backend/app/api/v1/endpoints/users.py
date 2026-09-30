from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.user_schema import UserOut, UserUpdateRequest

router = APIRouter(prefix="/users")


@router.put("/me", response_model=UserOut, summary="Update Current User Profile")
async def update_me(
    data: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Updates the authenticated user's display name or password.
    """
    if data.display_name:
        current_user.display_name = data.display_name.strip()

    if data.new_password:
        if not data.current_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is required to change password.",
            )
        if not verify_password(data.current_password, current_user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect current password.",
            )
        current_user.password_hash = get_password_hash(data.new_password)

    await db.commit()
    await db.refresh(current_user)

    return UserOut.model_validate(current_user)
