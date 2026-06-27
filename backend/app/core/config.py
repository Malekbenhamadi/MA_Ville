from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "MaVille API"
    api_prefix: str = "/api"
    secret_key: str = "change_me"
    access_token_expire_minutes: int = 60
    admin_create_secret: str = "change_me"
    report_upload_dir: str = "uploads"
    report_max_upload_bytes: int = 5 * 1024 * 1024
    report_allowed_mime_types: str = "image/jpeg,image/png,image/webp"
    database_url: str = (
        "postgresql+psycopg2://maville:maville@localhost:5432/maville"
    )

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
