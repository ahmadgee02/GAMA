from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import Dict
from src.agent.agent import Agent
import configparser
import logging
from src.utils.utils import AgentStatus, Mode, read_file, normalize_path, generate_agent_name

logging.debug('Tutorial')
config = configparser.ConfigParser()
config.read(normalize_path("tutorial/CONFIG/tutorial_config.ini"))


app = FastAPI()

# In-memory session store
agent_sessions: Dict[str, Agent] = {}

# Request schema
class ChatRequest(BaseModel):
    user_id: str
    message: str

@app.post("/load-agent")
def chat(req: ChatRequest):
    print("PAth", config.get("Paths", "AGENT_JSON"))

    agent_json = normalize_path(config.get("Paths", "AGENT_JSON")) # get the path to the agent from a json file

    # Load or create agent for user
    if req.user_id not in agent_sessions:
        agent_sessions[req.user_id] = Agent(agent_json=agent_json, autoformalization_on=False) # create an agent by providing a path to a json file

    if req.user_id not in agent_sessions:
        return {
            "replay": "agent not loaded"
        }
    
    agent = agent_sessions[req.user_id] 

    print("describe", agent.describe())
    print("print_game", agent.strategy())

    return {
        "reply": "Agent loaded",
    }


@app.post("/describe")
def describe(req: ChatRequest):
    print("agent_sessions", agent_sessions)

    if req.user_id not in agent_sessions:
        return {
            "replay": "agent not loaded"
        }
    
    agent = agent_sessions[req.user_id] 

    print("describe", agent.describe())

    return {
        "replay": agent.describe()
    }
    
@app.post("/print-game")
def print_game(req: ChatRequest):
    print("agent_sessions", agent_sessions)

    if req.user_id not in agent_sessions:
        return {
            "replay": "agent not loaded"
        }
    
    agent = agent_sessions[req.user_id] 

    print("print_game", agent.print_game())

    return {
        "replay": agent.print_game()
    }

@app.post("/strategy")
def strategy_name(req: ChatRequest):
    print("agent_sessions", agent_sessions)

    if req.user_id not in agent_sessions:
        return {
            "replay": "agent not loaded"
        }
    
    agent = agent_sessions[req.user_id] 

    print("print_game", agent.strategy())

    return {
        "replay": agent.strategy()
    }
    