import configparser
from src.agent.agent import Agent
from src.environment.environment import Environment
from src.environment.agent_pool import AgentPool
from src.utils.utils import read_file, Mode, generate_agent_name
from src.utils.data_object import DataObject
from lms.gpt4 import GPT4
from lms.claude import Claude
import logging
import os

'''
In this experiment, a dataset of 55 natural-language game-theoretic scenarios with non-numerical payoffs is autoformalized 
into formal logic specifications. To ensure syntactic correctness, a Prolog solver is employed for validation. For 
semantic validation,  a tournament is conducted in which each agent using a tit-for-tat strategy competes against its 
clone using an anti-tit-for-tat strategy. 
'''


def main():
	logging.debug('Experiment 5')
	config = configparser.ConfigParser()

	# Step 1: Read configuration
	config.read(os.path.normpath("../DATA/CONFIG/experiment_5.ini"))

	# Step 2: Extract input and output paths
	GAME_DIR = os.path.normpath(config.get("Paths", "GAME_DIR"))
	OUT_DIR = config.get("Paths", "OUT_DIR")
	if not os.path.exists(OUT_DIR):
		os.makedirs(OUT_DIR)

	# Step 3: Extract file paths
	template_path = os.path.normpath(config.get("Paths", "TEMPLATE_PATH"))
	feedback_template_path = os.path.normpath(config.get("Paths", "FEEDBACK_TEMPLATE_PATH"))
	strategy_path = os.path.normpath(config.get("Paths", "STRATEGY"))

	# Step 4: Extract experiment parameters
	max_attempts = config.getint("Params", "max_attempts")
	num_agents = 1

	# Step 5: Load game descriptions
	games_descriptions = [(game_file[:-4], read_file(os.path.join(GAME_DIR,game_file))) for game_file in os.listdir(GAME_DIR)]

	# Step 6: Run the tournament for each LLM and each game description
	for llm_name, llm in zip(["gpt4", "claude35"],[GPT4, Claude]):
		experiment_name = "experiment_5_"+llm_name
		for game_name, game_desc in games_descriptions:
			agent_pool = AgentPool()
			for i in range(num_agents):
				prompt = read_file(template_path).format(game_description=game_desc)
				game_data = DataObject(nl_description=game_desc, instruction_prompt=prompt,
									   feedback_prompt=read_file(feedback_template_path),
									   mode=Mode.AUTOFORMALIZATION)
				strategy_data = DataObject(rules_path=strategy_path, mode=Mode.RULES_PATH)
				agent = Agent(game_data, strategy_data, llm=llm, max_attempts=max_attempts)
				agent_pool.add_agent(agent)

			for i in range(len(agent_pool.valid_agents)):
				agent = agent_pool.valid_agents[i]
				agent.save(os.path.join(OUT_DIR, experiment_name))

			for i in range(len(agent_pool.invalid_agents)):
				agent = agent_pool.invalid_agents[i]
				save_path = os.path.join(OUT_DIR, experiment_name)
				os.makedirs(save_path, exist_ok=True)
				agent.save(save_path)

			agent_pool.clean_agents()


if __name__ == "__main__":
	main()
