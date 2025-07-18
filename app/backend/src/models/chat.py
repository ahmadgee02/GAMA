from pydantic import BaseModel, EmailStr, Field, ConfigDict
from pydantic.functional_validators import BeforeValidator
from typing import Optional
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]

class ChatModel(BaseModel):
    """
    Container for a single chat record.
    """

    # The primary key for the UserModel, stored as a `str` on the instance.
    # This will be aliased to `_id` when sent to MongoDB,
    # but provided as `id` in the API requests and responses.
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    history: list() = Field(...)
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "history": []
            }
        },
    )