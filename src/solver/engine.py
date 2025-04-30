from dataclasses import dataclass
from src.utils.setup_logger import logger
from typing import Any, Optional

@dataclass
class QueryResult:
	"""
    Represents the result of a Prolog query.

    Attributes:
        success (bool): Indicates if the query was successful.
        data (Optional[Any]): The result data from the Prolog query.
        error (Optional[str]): Any error message if the query failed.
    """
	success: bool
	data: Optional[Any] = None
	error: Optional[str] = None


class PrologEngine:
	"""
    Handles the lifecycle and query interface for a SWI-Prolog engine.
    """

	def __init__(self, thread_creator):
		"""
        Initialize the Prolog engine using a factory that creates a thread.

        Args:
            thread_creator: A callable that returns a new Prolog thread.
        """
		self.thread = thread_creator()

	def consult(self, file_path: str) -> QueryResult:
		"""
        Load a Prolog source file into the engine.

        Args:
            file_path (str): The path to the Prolog source file.

        Returns:
            QueryResult: Contains success status and optional error message.
        """
		try:
			prologized_path = file_path.replace("\\", "/")
			result = self.thread.query(f'consult("{prologized_path}")')
			return QueryResult(bool(result), None)
		except Exception as e:
			logger.error(f"Error consulting file {file_path}: {e}")
			return QueryResult(False, error=str(e))

	def query(self, predicate: str, count: Optional[int] = None) -> QueryResult:
		"""
		Execute a synchronous Prolog query.

		Args:
			predicate (str): The predicate to query.
			count (Optional[int]): The number of values to return. If None, returns all values.

		Returns:
			QueryResult: Contains success status, data, and optional error message.
		"""
		try:
			raw_result = self.thread.query(predicate)
			values = []

			if raw_result:
				if isinstance(raw_result, list):
					extracted = (list(entry.values())[0] for entry in raw_result if entry)
					values = list(extracted)
					if count is not None:
						values = values[:count]
				else:
					values = raw_result

			return QueryResult(success=True, data=values)

		except Exception as e:
			logger.error(f"Error querying predicate: {predicate}", exc_info=True)
			return QueryResult(success=False, error=str(e))

	def stop(self):
		"""
        Stop and clean up the Prolog engine.
        """
		try:
			self.thread.stop()
		except Exception as e:
			logger.error(f"Couldn't stop Prolog thread: {e}")
		finally:
			self.thread = None
