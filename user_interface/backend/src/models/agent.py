from pydantic import BaseModel, EmailStr, Field, ConfigDict
from pydantic.functional_validators import BeforeValidator
from typing import Optional
from typing_extensions import Annotated
from enum import Enum

PyObjectId = Annotated[str, BeforeValidator(str)]

class IncontextType(str, Enum):
    game = "Game"
    stratergy = "Stratergy"
    game_stratergy = "Game & Stratergy"

class AgentDataModel(BaseModel):
    name: str = Field(..., description="The name of the agent.  e.g. Game or Strategy")
    strategyName: str = Field(..., description="The stratergy name of the agent, e.g. Game or Strategy")
    strategyRules: str = Field(..., description="The stratergy prolog code description of the agent.")
    status: str = Field(..., description="The status of the agent, e.g. Correct")
    gameRules: str = Field(..., description="The game prolog code description of the agent.")
    gameMoves: list[str] = Field(..., description="The game legal moves, e.g. coperate, defact")
    gamePlayers: list[str] = Field(..., description="the game players.")
    defaultMove: str = Field(..., description="the default move of the agent.")
    moves: list[str] = Field(..., description="The game moves of the example.")
    traceMessages: list[str] = Field(..., description="The error logs list of the code validations.")
    attempts: int = Field(..., description="the number of attempts it mate to correct the code.")

class ExtraDataModel(BaseModel):
    heading: str
    text: str | list[str]
    type: Optional[str] = None
    
class MessageModel(BaseModel):
    text: str | list[str]
    heading: str
    role: str
    data: Optional[list[ExtraDataModel]] = []
    type: Optional[str] = None
    
class AgentModel(BaseModel):
    """
    Container for a single agent record.
    """
    
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    agentData: AgentDataModel = Field(...)
    history: list[MessageModel] = Field(...)
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "history": []
            }
        },
    )