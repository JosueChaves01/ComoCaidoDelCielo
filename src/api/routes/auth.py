from fastapi import APIRouter, HTTPException, status
from src.auth.schemas import LoginRequest, TokenResponse
from src.auth.service import verify_credentials, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest):
    if not verify_credentials(data.username, data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas.",
        )
    token = create_access_token(subject=data.username)
    return TokenResponse(access_token=token)
