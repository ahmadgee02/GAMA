from fastapi import APIRouter, Depends

from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer

from ..models.user import UserModel
from ..schemas.user import UserLogin
from ..database import user_collection
from ..utils.jwt_handler import verify_password, create_access_token, decode_access_token
from ..logger import logging


router = APIRouter(prefix="/auth", tags=["login"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
logger = logging.getLogger(__name__)

@router.post("/login")
def login(
    form_data: UserLogin
):
    user = user_collection.find_one({"email": form_data.email})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    logger.info("User loggedin...", user["email"])

    token = create_access_token(
        data={
            "name": user["name"],
            "email": user["email"],
            "isAdmin": user["isAdmin"]
        }
    )

    return {"access_token": token, "token_type": "bearer"}


@router.get(
    "/user",
    response_description="Get a single user",
    response_model=UserModel
)
def profile(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = user_collection.find_one({"email": payload.get("sub")})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user