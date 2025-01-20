from src.utils.setup_logger import logger
from swiplserver import PrologMQI
import io
import logging
import tempfile
from typing import List, Optional, Tuple, Union
import os


class Solver:
	"""
	Manages interactions with a Prolog solver.

	This class handles:
	- Loading and validating domain-independent Prolog solver code.
	- Loading game rules and strategies into the Prolog environment.
	- Validating the logic using the Prolog solver.

	Attributes:
	    valid (bool): Indicates whether the loaded Prolog code is valid.
	    trace (Optional[str]): Stores error traces from the Prolog solver during validation.
	    solver_string (str): The domain-independent Prolog solver code.
	    game_string (Optional[str]): The Prolog rules describing the game.
	    strategy_string (Optional[str]): The Prolog rules describing the strategy.
	    prolog_thread: The Prolog engine/thread used for validation.
	"""

	def __init__(self, solver_string: str, game_string: str = None, strategy_string: str = None):
		"""
		Initializes the Solver with the given Prolog components.

		Args:
		    solver_string (str): The domain-independent Prolog solver code.
		    game_string (Optional[str]): The Prolog rules describing the game (default: None).
		    strategy_string (Optional[str]): The Prolog rules describing the strategy (default: None).
		"""
		# Initialize validity and trace attributes.
		self.valid: bool = False
		self.trace: Optional[str] = None

		# Store Prolog solver, game, and strategy strings.
		self.solver_string = solver_string
		self.game_string = game_string
		self.strategy_string = strategy_string

		# Initialize the Prolog solver engine/thread.
		self.prolog_thread = self._initialize_prolog_thread()

		# Validate the domain-independent solver, game rules, and strategy rules.
		if self.prolog_thread:
			all_valid = True

			# Validate the domain-independent solver.
			self.validate(self.solver_string)

			# Validate the game and strategy rules, if provided.
			for rules in [self.game_string, self.strategy_string]:
				if rules:
					self.validate(rules)
					all_valid = all_valid and self.valid

			# Update the overall validity of the solver.
			self.valid = all_valid

	########################################### game-independent methods ###############################################

	def validate(
			self,
			solver_string: str,
			predicates: Tuple[str, ...] = ()
	) -> Tuple[bool, str]:
		"""
		Validates the domain-independent Prolog solver and required predicates.

		This method:
		- Consults the Prolog solver with the provided solver code.
		- Checks if the required predicates are present and valid.
		- Captures error traces if validation fails.

		Args:
		    solver_string (str): The Prolog code for the domain-independent solver.
		    predicates (Tuple[str]): A tuple of required predicate names to validate.

		Returns:
		    Tuple[bool, str]: A tuple where the first value indicates whether the solver is valid,
		                      and the second value contains an error trace if validation fails.

		Updates:
		    self.valid (bool): Set to True if validation succeeds, otherwise False.
		    self.trace (Optional[str]): Contains error trace details if validation fails.
		"""
		# Step 1: Set up logging to capture output from the Prolog solver.
		log_capture_string, log_handler = self._setup_logging()
		self.valid = True

		# Step 2: Write the Prolog solver code to a temporary file for consultation.
		temp_files = self._write_prolog_files([
			("solver", solver_string)
		])

		try:
			# Step 3: Load and consult the Prolog files.
			for temp_file_path, (label, _) in zip(temp_files, [("solver", solver_string)]):
				if not self.consult_prolog_file(temp_file_path):
					logger.error(f"Failed to consult {label} from file {temp_file_path}")
					self.valid = False
					break

			# Step 4: Validate the required predicates if the solver is valid.
			if self.valid:
				self._validate_predicates(predicates)

		except Exception as e:
			self.valid = False
			self.trace = str(e)
			logger.error(f"Prolog error: {self.trace}")

		# Step 5: Check the logs for additional error messages if validation is still valid.
		if self.valid:
			self._check_logs_for_errors(log_capture_string)

		# Step 6: Clean up temporary files and logging handlers.
		self._cleanup_temp_files(temp_files)
		self._cleanup_logging(log_handler)

		return self.valid, self.trace

	def apply_predicate(self, predicate: str) -> Optional[bool]:
		"""
		Applies a given Prolog predicate to update the solver's internal state.

		Args:
			predicate (str): The Prolog predicate to evaluate and apply.

		Returns:
			Optional[bool]: True if the predicate was successfully applied, False if it failed.
							Returns None if an exception occurs.

		Raises:
			ValueError: If the predicate evaluation or execution fails.
		"""
		try:
			logger.debug(f"Applying predicate: {predicate}")

			# Step 1: Execute the predicate in the Prolog thread
			result = self._execute_predicate(predicate)

			# Step 2: Log and return the result
			if result:
				logger.debug(f"Predicate '{predicate}' applied successfully: {result}")
				return True
			else:
				logger.debug(f"Predicate '{predicate}' failed.")
				return False

		except Exception as e:
			logger.error(f"Failed to apply predicate '{predicate}': {e}")
			return None

	def get_params(self):
		"""
		Retrieves non-None parameters from the solver, game, and strategy strings.

		Returns:
			List[str]: A list containing the non-None values of `solver_string`, `game_string`, and `strategy_string`.
		"""
		# Filter out `None` values and return the remaining strings.
		return [item for item in [self.solver_string, self.game_string, self.strategy_string] if item is not None]

	def get_variable_values(self, predicate: str, count: Optional[int] = None) -> Optional[List[Union[str, bool]]]:
		"""
		Retrieves values from the solver based on a given predicate.

		Args:
			predicate (str): The Prolog predicate to evaluate.
			count (Optional[int]): The number of values to return. If None, returns all values.

		Returns:
			Optional[List[Union[str, bool]]]: A list of evaluated variable values, or None if no values are found.

		Raises:
			ValueError: If the predicate evaluation fails.
		"""
		try:
			logger.debug(f"Querying predicate: {predicate}")
			# Step 1: Execute the query asynchronously
			self.prolog_thread.query_async(predicate, find_all=False)

			# Step 2: Retrieve results from the Prolog thread
			final_result = self._collect_query_results()

			# Step 3: Extract and return values from the results
			return self._extract_values(final_result, count)

		except Exception as e:
			logger.error(f"Error querying predicate '{predicate}': {e}")
			return None

	def consult_prolog_file(self, file_path: str) -> bool:
		"""
		Consult a Prolog file in the solver.

		Args:
			file_path (str): Path to the Prolog file.

		Returns:
			bool: True if the file was successfully consulted, False otherwise.
		"""
		try:
			file_path = file_path.replace(os.sep, '/')
			result = self.prolog_thread.query(f'consult("{file_path}").')
			logger.debug(f"Consulted file {file_path}: {result}")
			return bool(result)
		except Exception as e:
			logger.error(f"Error consulting file {file_path}: {e}")
			return False

	def release_prolog_thread(self):
		"""
		Release the Prolog thread to free resources.
		"""
		if self.prolog_thread:
			try:
				self.prolog_thread.stop()  # Close the thread (adjust if the library uses a different method)
				logger.debug("Prolog thread released.")
			except Exception as e:
				logger.debug(f"Failed to release Prolog thread: {e}")
			finally:
				self.prolog_thread = None

	def _initialize_prolog_thread(self) -> Optional[object]:
		"""
		Initialize a Prolog thread for querying the solver.

		Returns:
			Optional[object]: The Prolog thread object if created successfully, otherwise None.
		"""
		try:
			return PrologMQI().create_thread()
		except Exception as e:
			logger.error(f"Failed to initialize Prolog thread: {e}")
			return None

	def _setup_logging(self) -> Tuple[io.StringIO, logging.StreamHandler]:
		"""
		Setup logging to capture critical errors from the Prolog server.

		Returns:
			Tuple[io.StringIO, logging.StreamHandler]: The log capture string and handler.
		"""
		log_capture_string = io.StringIO()
		log_handler = logging.StreamHandler(log_capture_string)
		log_handler.setLevel(logging.CRITICAL)
		logging.getLogger('swiplserver').addHandler(log_handler)
		return log_capture_string, log_handler

	def _write_prolog_files(self, prolog_data: List[Tuple[str, str]]) -> List[str]:
		"""
		Write Prolog data to temporary files.

		Args:
			prolog_data (List[Tuple[str, str]]): List of tuples containing labels and data to write.

		Returns:
			List[str]: List of paths to the temporary files created.
		"""
		temp_files = []
		temp_dir = os.path.join(os.getcwd(), "DATA", "TEMP")
		os.makedirs(temp_dir, exist_ok=True)

		for _, data in prolog_data:
			with tempfile.NamedTemporaryFile(delete=False, dir=temp_dir, suffix=".pl") as temp_file:
				temp_file.write(data.encode())
				temp_files.append(temp_file.name)
		return temp_files

	def _validate_predicates(self, predicates: Tuple[str, ...]) -> bool:
		"""
		Validate that all required predicates are defined in the solver.

		Args:
			predicates (Tuple[str, ...]): A tuple of predicates to check.

		Returns:
			bool: True if all predicates are found, False otherwise.
		"""
		for predicate in predicates:
			result = self.prolog_thread.query(f"current_predicate({predicate}).")
			if not result:
				self.valid = False
				logger.debug(f"Missing predicate: {predicate}")
				return False
		return True

	def _check_logs_for_errors(self, log_capture_string: io.StringIO) -> None:
		"""
		Check captured logs for any critical errors.

		Args:
			log_capture_string (io.StringIO): The log capture object.
		"""
		log_contents = log_capture_string.getvalue()
		if log_contents:
			if len(log_contents) > 0:
				correct = False
				self.valid = False
				self.trace = log_contents.strip()
				logger.error(f"Prolog error from logs: {self.trace}")

	def _cleanup_temp_files(self, temp_files: List[str]) -> None:
		"""
		Delete temporary files created during validation.

		Args:
			temp_files (List[str]): List of file paths to delete.
		"""
		for file_path in temp_files:
			if os.path.exists(file_path):
				os.remove(file_path)

	def _cleanup_logging(self, log_handler: logging.StreamHandler) -> None:
		"""
		Clean up logging by removing the custom log handler.

		Args:
			log_handler (logging.StreamHandler): The log handler to remove.
		"""
		logging.getLogger('swiplserver').removeHandler(log_handler)

	def _collect_query_results(self) -> List[dict]:
		"""
		Collects results from the asynchronous Prolog query.

		Returns:
			List[dict]: A list of query results.
		"""
		final_result = []
		while True:
			result = self.prolog_thread.query_async_result()
			if result is None:
				break
			elif result is False:
				logger.debug("Query returned False.")
				return []
			else:
				logger.debug(f"Result: {result}")
				final_result.append(result)
		return final_result

	def _extract_values(self, results: List[dict], count: Optional[int]) -> Optional[List[Union[str, bool]]]:
		"""
		Extracts variable values from the query results.

		Args:
			results (List[dict]): The list of query results.
			count (Optional[int]): The number of values to return.

		Returns:
			Optional[List[Union[str, bool]]]: A list of extracted values, or None if no values are found.
		"""
		if not results:
			return None

		# Extract the first value from each result dictionary
		values = [list(result[0].values())[0] for result in results if result]
		logger.debug(f"Extracted values: {values}")

		return values[:count] if count is not None else values

	def _execute_predicate(self, predicate: str) -> Optional[bool]:
		"""
		Executes a Prolog query for a given predicate.

		Args:
			predicate (str): The Prolog predicate to execute.

		Returns:
			Optional[bool]: The result of the query, or None if an error occurs.
		"""
		try:
			return self.prolog_thread.query(predicate)
		except Exception as e:
			logger.error(f"Error executing predicate '{predicate}': {e}")
			return None

	######################################## game-specific methods #########################################################

	def get_possible_moves(self):
		try:
			possible_moves = self.get_variable_values("possible(move(_,X), s0).")
		except Exception as e:
			logger.debug(f"Error extracting game variables: {e}")
			return None
		return possible_moves

	def get_default_move(self, player_name):
		try:
			default_move = self.get_variable_values(
				f"initially(default_move({player_name}, X), s0).", 1
			)
		except Exception as e:
			logger.debug(f"Error extracting default move: {e}")
			return None
		return default_move

	def update_default_move(self, move: str) -> bool:
		"""
		Apply the default move update in the solver.

		Args:
			move (str): The move to set as default.

		Returns:
			bool: True if the update was successful, False otherwise.
		"""
		query = f"initialise(default_move(_, '{move}'), s0)."
		success = self.apply_predicate(query)
		logger.debug(f"Updated default move to '{move}' with status: {success}")
		return success

	def get_player_names(self):
		try:
			player_names = self.get_variable_values("holds(player(N), s0).")
		except Exception as e:
			logger.debug(f"Error extracting player names: {e}")
			return None
		return player_names

	def select_move(self, agent_name) -> Optional[str]:
		"""
		Use the solver to select the agent's move.

		Returns:
			Optional[str]: The move selected by the solver, or None if no move is found.
		"""
		try:
			move = self.get_variable_values(f"select({agent_name}, _, s0, M).", 1)
			return move[0] if move else None
		except Exception as e:
			logger.debug(f"Error selecting a move: {e}")
			return None

	def calculate_payoff(self, player_name: str, opponent_name: str, player_move: str, opponent_move: str) -> Optional[
		float]:
		"""
		Calculate the agent's payoff based on the last move using the solver.

		Args:
			player_name (str): The name of the player.
			opponent_name (str): The name of the opponent.
			player_move (str): The move made by the player.
			opponent_move (str): The move made by the opponent.

		Returns:
			Optional[float]: The calculated payoff if successful, otherwise None.

		Raises:
			Exception: If an unexpected error occurs during the calculation process.
		"""
		try:
			query = (
				f"finally(goal({player_name}, U), "
				f"do(move({player_name}, '{player_move}'), "
				f"do(move({opponent_name}, '{opponent_move}'), s0)))."
			)
			payoff = self.get_variable_values(query, 1)
			return float(payoff[0]) if payoff else None
		except Exception as e:
			logger.debug(f"Could not calculate payoff: {e}")
			return None

	def update_opponent_last_move(self, opponent_name: str, opponent_move: str) -> bool:
		"""
		Update the solver state with the opponent's last move.

		Args:
			opponent_name (str): The name of the opponent.
			opponent_move (str): The move made by the opponent.

		Returns:
			bool: True if the solver state was successfully updated, otherwise False.
		"""
		query = f"initialise(last_move({opponent_name}, '{opponent_move}'), s0)."
		return self.apply_predicate(query)
