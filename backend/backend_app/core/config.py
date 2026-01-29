from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # --- Auth / JWT ---
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # --- Database ---
    db_user: str
    db_password: str
    db_host: str
    db_port: int
    db_name: str

    @property
    def database_url(self) -> str:
        return (
            "postgresql+psycopg://"
            f"{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "forbid"


settings = Settings()
