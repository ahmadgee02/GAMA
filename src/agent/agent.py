import json
from lms.gpt4 import GPT4
import os.path
from src.game.game_history import GameHistory
from src.game.game import Game
from src.agent.agent_mind import AgentMind
from src.autoformalizer.autoformalizer import Autoformalizer
from src.solver.solver import Solver
from src.utils.setup_logger import logger
from src.utils.data_object import DataObject
from src.utils.base_lm import BaseLM
from src.utils.utils import AgentStatus, Mode, generate_agent_name, read_file, parse_axioms, process_trace, set_default
from typing import Optional


class Agent:
	"""
	Represents an agent participating in a tournament.

	Attributes:
		name (str): Agent's name.
	    game_history (GameHistory): Tracks the history of moves made by the agent.
	    game (Game): Represents the current game state.
	    solver (Solver): Solver initialized with the game-independent logic.
	    status (AgentStatus): Current status of the agent (e.g., INITIALIZING, CORRECT, etc.).
	    autoformalization_on (bool): Indicates if autoformalization is enabled for the agent.
	    max_attempts (int): Maximum number of attempts allowed for certain operations.
	    autoformalizer (Optional[Autoformalizer]): Handles autoformalization logic; None if disabled.
	    mind (AgentMind): Handles the agent's interaction with the environment and decision-making.
	    strategy_name (str): Name of the strategy used by the agent (default: "unnamed_strategy").
	    moves (list): List of moves made by the agent during the game.
	    payoffs (list): List of payoffs received by the agent in different rounds.
	"""

	def __init__(self,
				 game_data: Optional[DataObject] = None,
				 strategy_data: Optional[DataObject] = None,
				 llm: Optional[BaseLM] = GPT4,
				 max_attempts: Optional[int] = 1,
				 agent_json: Optional[str] = None,
				 autoformalization_on: Optional[bool] = True):
		"""
		Initializes an Agent instance with game and strategy data or a JSON configuration.

		Args:
		    game_data (Optional[DataObject]): The game data for initialization.
		    strategy_data (Optional[DataObject]): The strategy data for initialization.
		    llm (Optional[BaseLM]): The language model used for autoformalization (default is GPT4).
		    max_attempts (Optional[int]): Maximum number of attempts for autoformalization attempts (default is 1).
		    agent_json (Optional[str]): Path to a JSON file for initialization.
		    autoformalization_on (Optional[bool]): Flag to enable autoformalization functionality (default is True).

		Raises:
		    ValueError: If neither the required data nor the JSON configuration is provided.
		"""
		# Initialize game history and game objects to manage state.
		self.game_history = GameHistory()
		self.game = Game()

		# Load the solver logic and initialize the solver.
		solver_string = read_file("../src/solver/solver.pl")
		self.solver = Solver(solver_string)

		# Set status
		self.status = AgentStatus.INITIALIZING

		# Set the agent's status and initialize autoformalizer if enabled.
		self.autoformalization_on = autoformalization_on
		self.max_attempts = max_attempts
		self.autoformalizer = Autoformalizer(llm, max_attempts=max_attempts) if self.autoformalization_on else None

		# Initialize the agent's mind for decision-making and set default strategy name.
		self.mind = AgentMind(self.solver, autoformalizer=self.autoformalizer)
		self.strategy_name = "unnamed_strategy"

		# Initialize the agent either from a JSON file or provided data.
		if agent_json is not None:
			self._init_from_json(agent_json)
		elif game_data is not None and strategy_data is not None:
			self._init_from_data(game_data, strategy_data)
		else:
			raise ValueError("Invalid arguments provided. Either provide game_data and strategy_data, or agent_json.")

		# Track moves and payoffs during the game.
		self.moves = [] #TODO change to GameHistory/memory
		self.payoffs = []

	@classmethod
	def from_data(cls, game_data: DataObject, strategy_data: DataObject):
		"""
		Creates an Agent instance using game and strategy data.

		Args:
		    game_data (DataObject): The game data to initialize the agent.
		    strategy_data (DataObject): The strategy data to initialize the agent.

		Returns:
		    Agent: An initialized Agent instance.
		"""
		return cls(game_data=game_data, strategy_data=strategy_data)

	@classmethod
	def from_json(cls, agent_json: str):
		"""
		Creates an Agent instance using a JSON configuration file.

		Args:
		    agent_json (str): Path to the JSON file containing initialization data.

		Returns:
		    Agent: An initialized Agent instance.
		"""
		return cls(agent_json=agent_json)

	def _init_from_data(self, game_data: DataObject, strategy_data: DataObject):
		"""
		Initializes the agent using game and strategy data.

		Args:
		    game_data (DataObject): Game-related data for the agent.
		    strategy_data (DataObject): Strategy-related data for the agent.
		"""
		self.name = generate_agent_name(3)
		self._init_game_and_strategy(game_data, strategy_data)

	def _init_from_json(self, agent_json: str):
		"""
		Initializes the agent using a JSON configuration file.

		Args:
		    agent_json (str): Path to the JSON file containing initialization data.
		"""
		game_data, strategy_data = self.load(agent_json)
		self._init_game_and_strategy(game_data, strategy_data)

	def _init_game_and_strategy(self, game_data, strategy_data):
		"""
		Sets up the game and strategy data for the agent.

		Args:
		    game_data (DataObject): Game data object for the agent.
		    strategy_data (DataObject): Strategy data object for the agent.
		"""
		logger.debug(f"Agent {self.name} is {self.status}.")
		self.set_game(game_data, reload_solver=False)

		if self.status == AgentStatus.CORRECT:
			self.set_strategy(strategy_data, reload_solver=False)
			if self.status == AgentStatus.CORRECT:
				logger.debug(
					f"Agent {self.name} with players {self.game.game_players} and moves {self.game.game_moves} is "
					f"correctly initialized.")
		else:
			logger.debug(f"Agent's {self.name} initialization failed with status {self.status.value}.")

	def set_game(self, game_object: DataObject, reload_solver=True):
		"""
		Sets up the game rules and initializes the game environment for the agent.

		Args:
		    game_object (DataObject): The game data object containing game rules and metadata.
		    reload_solver (bool): Flag indicating whether to reload the solver during setup. This is necessary
		    if game_string was already loaded into the solver.

		Returns:
		    tuple: A tuple containing a boolean indicating success (True if the game is set correctly)
		           and the current status of the agent.
		"""
		# Clear the current game string in the solver.
		self.solver.game_string = None

		# Process the game data object to extract rules and update status.
		self.game.game_rules, self.status = self._process_data_object(game_object, reload_solver)
		self.solver.game_string = self.game.game_rules

		# If not in autoformalization mode, load the rules into the solver.
		if game_object.mode != Mode.AUTOFORMALIZATION:
			self._load_rules(self.game.game_rules, reload_solver)

		# If the game rules are correct, extract game variables and default moves.
		if self.status == AgentStatus.CORRECT:
			valid_variables = self._extract_game_variables()
			valid_move = self._extract_default_move()
			if not valid_variables or not valid_move:
				self.status = AgentStatus.MISSING_PREDICATES

		# Return whether the game setup was successful and the current status.
		return self.status == AgentStatus.CORRECT, self.status

	def set_strategy(self, strategy_object: DataObject, reload_solver=True):
		"""
		Sets up the strategy rules for the agent.

		Args:
		    strategy_object (DataObject): The strategy data object containing strategy rules and metadata.
		    reload_solver (bool): Flag indicating whether to reload the solver during setup. This is necessary
		    if game_string was already loaded into the solver.

		Returns:
		    tuple: A tuple containing a boolean indicating success (True if the strategy is set correctly)
		           and the current status of the agent.
		"""
		# Clear the current strategy string in the solver.
		self.solver.strategy_string = None

		# Process the strategy data object to extract rules and update status.
		self.game.strategy_rules, self.status = self._process_data_object(strategy_object, reload_solver)
		self.solver.strategy_string = self.game.strategy_rules

		# If not in autoformalization mode, load the rules into the solver.
		if strategy_object.mode != Mode.AUTOFORMALIZATION:
			self._load_rules(self.game.strategy_rules, reload_solver)

		if self.status == AgentStatus.CORRECT:
			# If the strategy rules are correct, extract the strategy name if available.
			if strategy_object.rules_path is not None:
				# Extract the strategy name from the file path.
				self.strategy_name = strategy_object.rules_path.split(os.path.sep)[-1][:-2]

		# Return whether the strategy setup was successful and the current status.
		return self.status == AgentStatus.CORRECT, self.status

	def _process_data_object(self, data_object: DataObject, reload_solver=True):
		"""
		Processes a data object to extract rules based on its mode.

		Args:
		    data_object (DataObject): The data object to process.
		    reload_solver (bool): Flag indicating whether to reload the solver after processing. This is necessary
		    if game_string was already loaded into the solver.

		Returns:
		    tuple: A tuple containing the extracted rules (str) and the agent's status (AgentStatus).

		Raises:
		    RuntimeError: If the data object's mode is unsupported or autoformalization is disabled.
		"""
		if data_object.mode == Mode.RULES_STRING:
			return data_object.rules_string, AgentStatus.CORRECT
		elif data_object.mode == Mode.RULES_PATH:
			return read_file(data_object.rules_path), AgentStatus.CORRECT
		elif data_object.mode == Mode.AUTOFORMALIZATION:
			if not self.autoformalization_on:
				raise RuntimeError(
					"Autoformalization disabled!")

			# Set the autoformalization prompts.
			self.autoformalizer.set_instruction_prompt(data_object.prompt)
			self.autoformalizer.set_feedback_prompt(data_object.feedback_prompt)

			# Reload the solver if required.
			if reload_solver:
				self.solver = Solver(*self.solver.get_params())

			# Perform autoformalization and return the results.
			return self.mind.autoformalize(self.solver, parse_axioms, process_trace)
		else:
			raise RuntimeError(f"Unknown mode {data_object.mode}")

	def _load_rules(self, rules, reload_solver):
		"""
		Loads rules into the solver and validates them.

		Args:
		    rules (str): The Prolog rules to be loaded into the solver.
		    reload_solver (bool): Flag indicating whether to reload the solver.

		Updates:
		    self.status: Set to CORRECT if the rules are valid, otherwise SYNTACTIC_ERROR.
		"""
		if reload_solver:
			# Reload the solver and validate it.
			self.solver = Solver(*self.solver.get_params())
			valid = self.solver.valid
			trace = self.solver.trace
		else:
			# Validate the rules with the current solver.
			valid, trace = self.solver.validate(rules)
		if not valid:
			logger.debug(f"Trying to load invalid Prolog code, trace: {trace}")

		# Update the agent's status based on the validation result.
		self.status = AgentStatus.CORRECT if valid else AgentStatus.SYNTACTIC_ERROR

	def _extract_game_variables(self) -> bool:
		"""
		Extract the possible moves and player names from the solver.

		Returns:
			bool: True if both possible moves and player names are successfully extracted, False otherwise.
		"""
		try:
			possible_moves = self.solver.get_variable_values("possible(move(_,X), s0).") #TODO move all Prolog to solver
			player_names = self.solver.get_variable_values("holds(player(N), s0).")

			if possible_moves and player_names:
				self.game.set_players(player_names)
				self.game.set_possible_moves(list(set(possible_moves)))
				return True
		except Exception as e:
			logger.debug(f"Error extracting game variables: {e}")
		return False

	def _extract_default_move(self) -> bool:
		"""
		Extract the default move for the agent from the solver.

		Returns:
			bool: True if a default move is successfully extracted, False otherwise.
		"""
		try:
			default_move = self.solver.get_variable_values(
				f"initially(default_move({self.game.game_players[0]}, X), s0).", 1
			)
			if default_move:
				self.game.default_move = default_move[0]
				return True
		except Exception as e:
			logger.debug(f"Error extracting default move: {e}")
		return False

	def get_total_payoff(self) -> float:
		"""
		Get the total payoff accumulated by the agent.

		Returns:
			float: The total sum of payoffs.
		"""
		total = sum(self.payoffs)
		logger.debug(f"Total payoff for agent {self.name}: {total}")
		return total

	def save(self, save_dir):
		"""
		Saves the agent's state to a JSON file.

		The method serializes the agent's current state, including game rules, strategy, moves,
		payoffs, and other relevant attributes, into a JSON file for future restoration.

		Args:
		    save_dir (str): The directory where the JSON file will be saved.

		Raises:
		    OSError: If the file cannot be written to the specified directory.
		"""
		# Reference the current game object for convenience.
		game = self.game

		# Create a dictionary capturing the agent's state.
		agent_log = {
			"name": self.name,
			"strategy_name": self.strategy_name,
			"strategy_rules": game.strategy_rules,
			"status": self.status,
			"game_rules": game.game_rules,
			"game_moves": game.game_moves,
			"game_players": game.game_players,
			"default_move": game.default_move,
			"moves": self.moves,
			"payoffs": self.payoffs,
			"total_payoff": self.get_total_payoff(),
			"trace_messages": self.autoformalizer.trace_messages,
			"attempts": self.autoformalizer.attempts
		}

		# Construct the file path and save the JSON file.
		with open(os.path.join(save_dir, f"agent_{self.name}.json"), "w") as f:
			json.dump(agent_log, f, indent=2, default=set_default)

	def load(self, agent_json_path):
		"""
		Loads the agent's state from a JSON file.

		This method restores the agent's state, including game rules, strategy, and other
		attributes, from a previously saved JSON file.

		Args:
		    agent_json_path (str): The path to the JSON file containing the saved agent's state.

		Returns:
		    tuple: A tuple containing the game data (DataObject) and strategy data (DataObject).

		Raises:
		    FileNotFoundError: If the specified JSON file does not exist.
		    JSONDecodeError: If the file is not a valid JSON file.
		"""
		if not os.path.exists(agent_json_path):
			raise FileNotFoundError(f"No saved agent file found at {agent_json_path}")

		# Load the JSON file and parse the agent state.
		with open(agent_json_path, "r") as f:
			agent_log = json.load(f)

		# Restore agent attributes from the loaded JSON data.
		self.name = agent_log["name"]
		self.strategy_name = agent_log["strategy_name"]
		self.status = agent_log["status"]
		self.game.game_moves = agent_log["game_moves"]
		self.game.game_players = agent_log["game_players"]
		self.game.default_move = agent_log["default_move"]

		# Recreate game and strategy data objects from the loaded rules.
		game_data = DataObject(rules_string=agent_log["game_rules"], mode=Mode.RULES_STRING)
		strategy_data = DataObject(rules_string=agent_log["strategy_rules"], mode=Mode.RULES_STRING)

		return game_data, strategy_data
