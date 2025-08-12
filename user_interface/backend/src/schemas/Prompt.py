from pydantic import BaseModel
from typing import Optional
from enum import Enum

class PromptType(str, Enum):
    game = "game"
    stratergy = "stratergy"

class PromptAdd(BaseModel):
    name: str
    shortDescription: Optional[str] = None
    description: str
    isEnabled: Optional[bool] = True
    type: PromptType

class PromptUpdate(BaseModel):
    name: Optional[str] = None
    shortDescription: Optional[str] = None
    description: Optional[str] = None
    isEnabled: Optional[bool] = None
    type: PromptType