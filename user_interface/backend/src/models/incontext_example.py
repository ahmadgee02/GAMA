from pydantic import BaseModel, Field, ConfigDict
from pydantic.functional_validators import BeforeValidator
from typing import Optional
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]

class IncontextExampleModel(BaseModel):
    """
    Container for a single incontext example record.
    """

    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(..., description="The name of the example e.g. Tic Tak Toe")
    description: str = Field(..., description="A brief description of the prompt e.g. PD example")
    shortDescription: Optional[str] = Field(None, description="A short humain readable description of the example")
    isEnabled: bool = Field(..., description="Indicates whether the prompt is enabled or not")
    type: str = Field(..., description="The type of the example, e.g. Game or Strategy")
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "name": "Tic Tak Toe",
                "shortDescription": "A simple game description",
                "description": "Some PD code example",
                "isEnabled": False,
                "type": "Game"
            }
        },
    )