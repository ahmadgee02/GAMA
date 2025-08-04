from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException

from ..models.agent import AgentModel, AgentDataModel
from ..database import incontext_example_collection, prompt_collection, agent_collection
from ..logger import logging
from ..session_store import session_manager
import json
from bson import ObjectId
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
                # "6871d304894618c4ce7d5259"

            elif action == "DESCRIPTION":
                logger.info(f"saved_info I am working ===> { saved_info }")

                game_description: str = payload
                stratergy: str = saved_info["prompt"]["description"]
                stratergy_name: str = saved_info["prompt"]["name"]
                example_description: str = saved_info["example"]["description"]


                prompt_template_path = normalize_path("DATA/PROMPTS/game_prompt_template.txt")
                prompt_template = read_file(prompt_template_path)

                feedback_template_path = normalize_path("DATA/PROMPTS/feedback_prompt_template.txt")
                feedback_prompt = read_file(feedback_template_path)

                prompt = prompt_template.format(game_description=game_description, game_example=example_description)

                game_data = DataObject(nl_description=game_description, instruction_prompt=prompt,
                               feedback_prompt=feedback_prompt, mode=Mode.AUTOFORMALIZATION)
                
                # tit_for_tat_path = stratergy
                strategy_data = DataObject(name=stratergy_name, rules_string=stratergy, mode=Mode.RULES_STRING)

                logger.info(f"game_data => {game_data}")

                # agent = Agent(game_data, strategy_data, max_attempts=5, websocket=websocket)
                agent_json = normalize_path("tutorial/DATA/AGENT/agent_Sonina.json")
                # logger.info(f"agent_json => { agent_json }")
                agent = Agent(agent_json=agent_json, autoformalization_on=False, websocket=websocket)

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
                logger.info(f"Iteration result: {status}, trace: {trace}")
                
                message = {
                    "type": "info",
                    "data": json.dumps({
                        "status": str(status),
                        "trace": str(trace),
                    })
                }
                
                await websocket.send_text(json.dumps(message))
            # await websocket.send_text(f"Message text was: {data}")
            
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
         
                await websocket.send_text(json.dumps(message))
                
            elif action == "SAVE_AGENT":
                agent: Agent = saved_info["agent"]
                history = payload
                
                agent_data = await agent.agent_log()

                agent_collection.insert_one({ 
                    "agentData": agent_log_snake_to_camel(agent_data),
                    "history": history
                })
                
                message = {
                    "type": "info",
                    "data": json.dumps({
                        "status": "Agent Saved",
                    })
                }
                
                await websocket.send_text(json.dumps(message))
                
                
            elif action == "LOAD_AGENT":
                agent_id: str = payload
                
                agent_data = agent_collection.find_one({ "_id": ObjectId(agent_id) })

                agent_json = agent_log_camel_to_snake(agent_data["agentData"])
                
                agent = Agent(agent_json=agent_json, autoformalization_on=False, websocket=websocket)
                
                await agent.send_message()
                
                message = {
                    "type": "info",
                    "data": json.dumps({
                        "status": "Agent Saved",
                    })
                }
                
                session_manager.set_session(websocket, "agent", agent)

                await websocket.send_text(json.dumps(message))
                
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
        # session_manager.remove_session(websocket)
        # await websocket.close()
    except Exception as e:
        print("Unexpected error:", e)

