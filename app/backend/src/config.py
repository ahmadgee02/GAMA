import os
from enum import Enum

from pydantic import SecretStr
from pydantic_settings import BaseSettings
from starlette.config import Config

current_file_dir = os.path.dirname(os.path.realpath(__file__))
env_path = os.path.join(current_file_dir, "..", ".env")

config = Config(env_path)

class CryptSettings(BaseSettings):
    SECRET_KEY: SecretStr = config("SECRET_KEY", cast=SecretStr)
    ALGORITHM: str = config("ALGORITHM", default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = config("ACCESS_TOKEN_EXPIRE_MINUTES", default=30)

class OpenAISettings(BaseSettings):
    OPENAI_API_KEY: str = config("OPENAI_API_KEY", default="")


class DatabaseSettings(BaseSettings):
    DATABASE_URL: str = config("DATABASE_URL", default="")

class EnvironmentOption(Enum):
    LOCAL = "local"
    STAGING = "staging"
    PRODUCTION = "production"
    
class EnvironmentSettings(BaseSettings):
    ENVIRONMENT: EnvironmentOption = config("ENVIRONMENT", default=EnvironmentOption.LOCAL)


class Settings(
    DatabaseSettings,
    CryptSettings,
    EnvironmentSettings,
    OpenAISettings
):
    pass


settings = Settings()