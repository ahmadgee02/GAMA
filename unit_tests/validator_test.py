import unittest
from src.utils.validator import Validator


class ValidatorTournament(unittest.TestCase):
	def setUp(self):
		"""
		Set up the testing environment by preparing agent JSON data and initializing required variables.
		"""
		# Path to test configuration or JSON files
		agents_directory = "./TEST_RESULTS"
		matrices_filepath = "./DATA/MISC/matrices.json"
		payoffs_filepath = "./DATA/MISC/payoff_sums_adjusted.csv"
		validators_dir = "../DATA/EVAL"
		self.validator = Validator(agents_directory, matrices_filepath, payoffs_filepath, validators_dir)

	def test_validator(self):
		"""
		Test that a tournament runs correctly with agents loaded from JSON files.
		"""
		df = self.validator.validate_all()
		print(df)
		self.assertIsNotNone(df)


if __name__ == "__main__":
	unittest.main()
