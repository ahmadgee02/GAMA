from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import JSONResponse
from ..models.agent import AgentModel
from ..database import incontext_example_collection, prompt_collection, agent_collection
from ..logger import logging
from ..session_store import session_manager
import json
from bson import ObjectId, json_util
from bson.errors import InvalidId
from ..config import settings
from ..utils.jwt_handler import decode_access_token

from magif.agent.agent import Agent
from magif.utils.utils import Mode, read_file, normalize_path
from magif.utils.data_object import DataObject
import os
from ..utils import agent_log_snake_to_camel, agent_log_camel_to_snake

router = APIRouter(prefix="/agents", tags=["agents"])
logger = logging.getLogger(__name__)

@router.get(
    "/",
    response_description="Get All agents",
    response_model=list[AgentModel]
)
def getAllAgents():
    agents = agent_collection.find()
    
    return agents

@router.get(
    "/export",
    response_description="Export all agents as JSON"
)
def export_agents():
    agents = list(agent_collection.find({"agentData.status": "correct"}))
    
    for agent in agents:
        if "_id" in agent:
            agent["_id"] = str(agent["_id"])
            
    return JSONResponse(content=agents)

@router.get(
    "/{agent_id}",
    response_description="Get a single agent",
    response_model=AgentModel
)
def getAgent(agent_id: str):
    try:
        agent = agent_collection.find_one({"_id": ObjectId(agent_id) })

        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid agent ID format")
    
    return agent

@router.delete(
    "/{agent_id}",
    response_description="Delete a single agent"
)
def deleteAgent(agent_id: str):
    try:
        result = agent_collection.delete_one({"_id": ObjectId(agent_id)})
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid agent id")

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Agent not found")

    return {"message": "Item deleted"}



@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket
):
    await websocket.accept()
    session_manager.create_session(websocket)

    os.environ["OPENAI_API_KEY"] = settings.OPENAI_API_KEY

    try:
        while True:
            message = await websocket.receive_text()
            data = json.loads(message)

            action: str = data.get("action")
            payload: str = data.get("payload")

            logger.info(f"Received action: {action}, payload: {payload}")
            saved_info = session_manager.get_session(websocket)
            
            if action == "AUTH_TOKEN":
                user = decode_access_token(payload)

                if not user:
                    await websocket.send_text({
                        "type": "info",
                        "data": "Invalid token."
                    })
                    return
                
                session_manager.set_session(websocket, "user", user)
                message = {
                    "type": "info",
                    "data": f"Authenticated as {user['name']}"
                }

                await websocket.send_text(json.dumps(message))

            elif action == "INCONTEXT_EXAMPLE":
                example_id: str = payload
                example = incontext_example_collection.find_one({ "_id": ObjectId(example_id) })

                if not example:
                    await websocket.send_text({
                        "type": "info",
                        "data": f"Incontext example not found: { example_id }"
                    })
                    return
                
                session_manager.set_session(websocket, "example", example)
                message = {
                    "type": "info",
                    "data": f"Incontext example set: { example["name"] }"
                }

                await websocket.send_text(json.dumps(message))

            elif action == "PROMPT":
                prompt_id: str = payload
                prompt = prompt_collection.find_one({ "_id": ObjectId(prompt_id) })

                if not prompt:
                    await websocket.send_text({
                        "type": "info",
                        "data":f"Prompt not found: { prompt_id }"
                    })
                    return
                
                session_manager.set_session(websocket, "prompt", prompt)
                message = {
                    "type": "info",
                    "data": f"Prompt set: { prompt["name"] }"
                }

                await websocket.send_text(json.dumps(message))
                
            elif action == "SET_MODE":
                mode: str = payload
                
                session_manager.set_session(websocket, "mode", mode)
                                
                message = {
                    "type": "info",
                    "data": f"Mode set to {mode}"
                }

                await websocket.send_text(json.dumps(message))
            elif action == "DESCRIPTION":
                description: str = payload
                prompt_description: str = saved_info["prompt"]["description"]
                prompt_name: str = saved_info["prompt"]["name"]
                example_description: str = saved_info["example"]["description"]

                feedback_template_path = normalize_path("DATA/PROMPTS/feedback_prompt_template.txt")
                feedback_prompt = read_file(feedback_template_path)

                if mode == "Game": 
                    prompt_template_path = normalize_path("DATA/PROMPTS/game_prompt_template.txt")
                    prompt = read_file(prompt_template_path).format(game_description=description, game_example=example_description)

                    game_data = DataObject(nl_description=description, instruction_prompt=prompt,
                                feedback_prompt=feedback_prompt, mode=Mode.AUTOFORMALIZATION)
                    
                    strategy_data = DataObject(name=prompt_name, rules_string=prompt_description, mode=Mode.RULES_STRING)

                else:
                    prompt_template_path = normalize_path("DATA/PROMPTS/strategy_prompt_template.txt")
                    prompt = read_file(prompt_template_path).format(strategy_description=description, strategy_example=example_description)
                    
                    strategy_data = DataObject(nl_description=description, instruction_prompt=prompt,
                                    feedback_prompt=feedback_prompt, mode=Mode.AUTOFORMALIZATION)
                
                    game_data = DataObject(name=prompt_name, rules_string=prompt_description, mode=Mode.RULES_STRING)
  
  
                agent = Agent(game_data, strategy_data, max_attempts=5, websocket=websocket)
                # agent_json = normalize_path("tutorial/DATA/AGENT/agent_Sonina.json")
                # logger.info(f"agent_json => { agent_json }")
                # agent = Agent(agent_json_path=agent_json, autoformalization_on=False, websocket=websocket)

                await agent.send_message()

                session_manager.set_session(websocket, "agent", agent)

            elif action == "EDIT_CODE":
                agent: Agent = saved_info["agent"]
                prolog_code: str = payload

                if not agent:
                    await websocket.send_text({
                        "type": "info",
                        "data":"Agent not found."
                    })
                    
                    return
                
                status, trace = agent.iterate_rules(prolog_code)
                
                message = {
                    "type": "data",
                    "data": json.dumps({
                        "Status": f"{status}" + (f", {trace}" if trace else "")
                    })
                }
                
                await websocket.send_text(json.dumps(message))
                            
            elif action == "USER_INTERACTION":
                agent: Agent = saved_info["agent"]
                user_move: str = payload
                
                if not agent:
                    await websocket.send_text({
                        "type": "info",
                        "data": "Agent not found."
                    })
                    return
                
                await agent.user_interaction(user_move)

            elif action == "SAVE_AGENT_NAME":
                agent: Agent = saved_info["agent"]
                agent_name: str = payload
                
                if not agent:
                    await websocket.send_text({
                        "type": "info",
                        "data": "Agent not found."
                    })
                    return
                
                agent.name = agent_name
                
                message = {
                    "type": "info",
                    "data": f"Agent Name updated to {agent_name}"
                }

                await websocket.send_text(json.dumps(message))
                
            elif action == "SAVE_AGENT":
                agent: Agent = saved_info["agent"]
                history = payload
                
                if not agent:
                    await websocket.send_text({
                        "type": "info",
                        "data": "Agent not found."
                    })
                    return
                
                agent_data = await agent.agent_log()

                if "agent_id" in saved_info:
                    agent_id = saved_info["agent_id"]
                    
                    agent_collection.update_one(
                        {"_id": ObjectId(agent_id)}, 
                        {
                            "$set": { 
                                "agentData": agent_log_snake_to_camel(agent_data),
                                "history": history
                            }
                        }
                    )
                else:
                    result = agent_collection.insert_one({ 
                        "agentData": agent_log_snake_to_camel(agent_data),
                        "history": history
                    })
                    

                    session_manager.set_session(websocket, "agent_id", str(result.inserted_id))
                    
                    new_agent = agent_collection.find_one({"_id": result.inserted_id })
                    
                    logger.info(f" new_agent {new_agent}")
                    
                    message = {
                        "type": "new_agent",
                        "data": json_util.dumps(new_agent)
                    }
                
                    await websocket.send_text(json.dumps(message))
                
                message = {
                    "type": "info",
                    "data": f"Agent {agent_data["name"]} Saved"
                }
                
                await websocket.send_text(json.dumps(message))
            elif action == "LOAD_AGENT":
                agent_id: str = payload
                
                agent_data = agent_collection.find_one({ "_id": ObjectId(agent_id) })

                if not agent_data:
                    await websocket.send_text({
                        "type": "info",
                        "data": "Agent not found."
                    })
                    
                    return

                agent_json = agent_log_camel_to_snake(agent_data["agentData"])
                
                agent = Agent(agent_json=agent_json, autoformalization_on=False, websocket=websocket)

                message = {
                    "type": "info",
                    "data": json.dumps({
                        "status": f"Agent {agent_json["name"]} Loaded",
                    })
                }
                
                session_manager.set_session(websocket, "agent_id", agent_id)
                session_manager.set_session(websocket, "agent", agent)

                await websocket.send_text(json.dumps(message))
                
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
        session_manager.remove_session(websocket)
        await websocket.close()
    except Exception as e:
        print("Unexpected error:", e)