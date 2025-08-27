from fastapi import APIRouter

from .auth import router as auth_router
from .user import router as user_router
from .Incontext_example import router as incontext_example_router
from .prompt import router as prompt_router
from .agent import router as agent_router

router = APIRouter()

router.include_router(auth_router)
router.include_router(user_router)
router.include_router(incontext_example_router)
router.include_router(prompt_router)
router.include_router(agent_router)