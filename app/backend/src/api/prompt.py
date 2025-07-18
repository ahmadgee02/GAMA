from fastapi import APIRouter, HTTPException

from bson.objectid import ObjectId
from bson.errors import InvalidId

from ..models.prompt import PromptModel
from ..schemas.prompt import PromptAdd, PromptUpdate
from ..database import prompt_collection
from ..logger import logging

router = APIRouter(prefix="/prompts", tags=["prompts"])
logger = logging.getLogger(__name__)

@router.get(
    "/",
    response_description="Get All prompts",
    response_model=list[PromptModel]
)
def getAllPrompts():
    Prompts_data = prompt_collection.find()
    return Prompts_data

@router.get(
    "/{prompt_id}",
    response_description="Get a single prompt",
    response_model=PromptModel
)
def getPrompt(prompt_id: str):
    prompt = prompt_collection.find_one({"_id": ObjectId(prompt_id) })

    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    return prompt

@router.post(
    "/",
    response_description="Creats a single prompt",
    response_model=PromptModel
)
def createPrompt(user: PromptAdd):
    
    user_dict = {
        "name": user.name,
        "description": user.description,
        "isEnabled": user.isEnabled
    }

    result = prompt_collection.insert_one(user_dict)
    prompt = prompt_collection.find_one({"_id": result.inserted_id })

    return prompt


@router.put(
        "/{prompt_id}",
        response_description="Get a single prompt",
        response_model=PromptModel
) 
def updatePrompt(prompt_id: str, prompt: PromptUpdate):
 
    update_data = {}

    if prompt.name is not None:
        update_data["name"] = prompt.name

    if prompt.description is not None:
        update_data["description"] = prompt.description

    if prompt.isEnabled is not None:
        update_data["isEnabled"] = prompt.isEnabled

    try:
        updated_result = prompt_collection.update_one({"_id": ObjectId(prompt_id)}, {"$set": update_data})
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid Prompt ID")

    if updated_result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = prompt_collection.find_one({"_id": ObjectId(prompt_id)})
    return updated_user

@router.delete(
    "/{prompt_id}",
    response_description="Get a single prompt"
)
def deletePrompt(prompt_id: str):
    try:
        result = prompt_collection.delete_one({"_id": ObjectId(prompt_id)})
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid prompt ID")

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Prompt not found")

    return {"message": "Item deleted"}