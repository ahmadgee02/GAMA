from pydantic import BaseModel
from typing import Optional

class NewChat(BaseModel):
    prompt_id: str
    description: str