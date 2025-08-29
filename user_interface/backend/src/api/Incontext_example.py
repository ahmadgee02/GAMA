from fastapi import APIRouter, HTTPException, Depends

from bson.objectid import ObjectId
from bson.errors import InvalidId
from .auth import get_current_user

from ..models.incontext_example import IncontextExampleModel
from ..schemas.incontext_examples import IncontextExampleAdd, IncontextExampleUpdate
from ..database import incontext_example_collection
from ..logger import logging

router = APIRouter(
    prefix="/incontext-examples", 
    tags=["incontext_examples"],
    dependencies=[Depends(get_current_user)]
)

logger = logging.getLogger(__name__)

@router.get(
    "/",
    response_description="Get All incontext examples",
    response_model=list[IncontextExampleModel]
)
def getAllIncontextExamples():
    incontext_examples = incontext_example_collection.find()
    return incontext_examples

@router.get(
    "/{incontext_example_id}",
    response_description="Get a single incontext example",
    response_model=IncontextExampleModel
)
def getIncontextExample(incontext_example_id: str):
    incontext_example = incontext_example_collection.find_one({"_id": ObjectId(incontext_example_id) })

    if not incontext_example:
        raise HTTPException(status_code=404, detail="incontext example not found")
    
    return incontext_example

@router.post(
    "/",
    response_description="Creats a single incontext example",
    response_model=IncontextExampleModel
)
def createIncontextExample(example: IncontextExampleAdd):
    
    incontext_example_dict = {
        "name": example.name,
        "shortDescription": example.shortDescription,
        "description": example.description,
        "isEnabled": example.isEnabled,
        "type": example.type
    }

    result = incontext_example_collection.insert_one(incontext_example_dict)
    incontext_example = incontext_example_collection.find_one({"_id": result.inserted_id })

    return incontext_example


@router.put(
        "/{incontext_example_id}",
        response_description="Update a single incontext example",
        response_model=IncontextExampleModel
) 
def updateIncontextExample(incontext_example_id: str, incontext_example: IncontextExampleUpdate):
 
    update_data = {}

    if incontext_example.name is not None:
        update_data["name"] = incontext_example.name

    if incontext_example.shortDescription is not None:
        update_data["shortDescription"] = incontext_example.shortDescription

    if incontext_example.description is not None:
        update_data["description"] = incontext_example.description

    if incontext_example.isEnabled is not None:
        update_data["isEnabled"] = incontext_example.isEnabled
    
    if incontext_example.type is not None:
        update_data["type"] = incontext_example.type

    try:
        updated_result = incontext_example_collection.update_one({"_id": ObjectId(incontext_example_id)}, {"$set": update_data})
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid incontext example ID")

    if updated_result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Incontext example not found")
    
    updated_incontext_example = incontext_example_collection.find_one({"_id": ObjectId(incontext_example_id)})
    return updated_incontext_example

@router.delete(
    "/{incontext_example_id}",
    response_description="Delete a single incontext_example"
)
def deleteIncontextExample(incontext_example_id: str):
    try:
        result = incontext_example_collection.delete_one({"_id": ObjectId(incontext_example_id)})
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid incontext example id")

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Incontext example not found")

    return {"message": "Item deleted"}