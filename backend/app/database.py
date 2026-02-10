import os
from peewee import SqliteDatabase
from dotenv import load_dotenv

load_dotenv()

# Caminho padrão para o banco local
database_path = os.getenv('SQLITE_DB_PATH', 'database/local_database.db')
db = SqliteDatabase(database_path)
