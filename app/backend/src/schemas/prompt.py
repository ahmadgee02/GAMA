from pydantic import BaseModel
from typing import Optional

class PromptAdd(BaseModel):
    name: str
    description: str
    isEnabled: bool

class PromptUpdate(BaseModel):
    name: str
    description: str
    isEnabled: bool