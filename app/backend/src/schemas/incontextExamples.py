from pydantic import BaseModel
from typing import Optional
from enum import Enum

class IncontextType(str, Enum):
    game = "game"
    stratergy = "stratergy"
    game_stratergy = "game_stratergy"

class IncontextExampleAdd(BaseModel):
    name: str
    shortDescription: Optional[str] = None
    description: str
    isEnabled: Optional[bool] = True
    type: IncontextType

class IncontextExampleUpdate(BaseModel):
    name: Optional[str] = None
    shortDescription: Optional[str] = None
    description: Optional[str] = None
    isEnabled: Optional[bool] = None
    type: Optional[IncontextType] = None