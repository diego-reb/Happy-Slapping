import os
from dotenv import load_dotenv

load_dotenv()  # Carga el .env

DATABASE_URL = os.getenv("DATABASE_URL")