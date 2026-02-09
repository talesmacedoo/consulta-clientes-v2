from peewee import Model, CharField, DateTimeField
from app.database import db
import datetime

class Cliente(Model):
    nome = CharField()
    cpf = CharField()
    celular1 = CharField()
    celular2 = CharField()
    celular3 = CharField()
    celular4 = CharField()
    email = CharField()
    data_nascimento = CharField()
    data_obito = CharField()
    data_consulta = CharField()

    class Meta:
        database = db
