from fastapi import APIRouter, HTTPException, Depends

from bson.objectid import ObjectId
from bson.errors import InvalidId
from .auth import get_current_user

from ..models.Prompt import PromptModel
from ..schemas.Prompt import PromptAdd, PromptUpdate
from ..database import prompt_collection
from ..logger import logging

router = APIRouter(
    prefix="/prompts", 
    tags=["prompts"],
    dependencies=[Depends(get_current_user)]
)

logger = logging.getLogger(__name__)

@router.get(
    "/",
    response_description="Get All prompts",
    response_model=list[PromptModel]
)
def getAllPrompts():
    prompts = prompt_collection.find()
    return prompts

@router.get(
    "/{prompt_id}",
    response_description="Get a single prompt",
    response_model=PromptModel
)
def getPrompt(prompt_id: str):
    try:
        prompt = prompt_collection.find_one({"_id": ObjectId(prompt_id) })

        if not prompt:
            raise HTTPException(status_code=404, detail="prompt not found")
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid prompt ID format")
    
    return prompt

@router.post(
    "/",
    response_description="Creats a single prompt",
    response_model=PromptModel
)
def createPrompt(example: PromptAdd):
    
    prompt_dict = {
        "name": example.name,
        "shortDescription": example.shortDescription,
        "description": example.description,
        "isEnabled": example.isEnabled,
        "type": example.type
    }

    result = prompt_collection.insert_one(prompt_dict)
    prompt = prompt_collection.find_one({"_id": result.inserted_id })

    return prompt


@router.put(
        "/{prompt_id}",
        response_description="Update a single prompt",
        response_model=PromptModel
) 
def updatePrompt(prompt_id: str, prompt: PromptUpdate):
 
    update_data = {}

    if prompt.name is not None:
        update_data["name"] = prompt.name

    if prompt.shortDescription is not None:
        update_data["shortDescription"] = prompt.shortDescription

    if prompt.description is not None:
        update_data["description"] = prompt.description

    if prompt.isEnabled is not None:
        update_data["isEnabled"] = prompt.isEnabled
    
    if prompt.type is not None:
        update_data["type"] = prompt.type

    try:
        updated_result = prompt_collection.update_one({"_id": ObjectId(prompt_id)}, {"$set": update_data})
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid prompt ID")

    if updated_result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    updated_prompt = prompt_collection.find_one({"_id": ObjectId(prompt_id)})
    return updated_prompt

@router.delete(
    "/{prompt_id}",
    response_description="Delete a single prompt"
)
def deletePrompt(prompt_id: str):
    try:
        result = prompt_collection.delete_one({"_id": ObjectId(prompt_id)})
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid prompt id")

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Prompt not found")

    return {"message": "Item deleted"}