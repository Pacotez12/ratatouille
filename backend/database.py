import os
from sqlalchemy import Column, Integer, String, Float, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# El URL se construirá dinámicamente desde variables de entorno para Docker
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/ratatouille_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# 1. TABLA DE USUARIOS
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String)

# 2. TABLA DE CONTACTO / LEADS
class Contact(Base):
    __tablename__ = "contacts"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String, nullable=True)
    message = Column(Text)
    status = Column(String, default="pendiente")

# 3. TABLA DE PRODUCTOS
class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(Text)
    price = Column(Float)
    category = Column(String)
    image_path = Column(String)

# 4. TABLA DE RESERVAS
class Reservation(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String, nullable=True)
    people = Column(Integer)
    date = Column(String)
    time = Column(String)
    notes = Column(Text, nullable=True)
    status = Column(String, default="confirmada")

# 5. TABLA DE VISITAS (Analítica)
class Visit(Base):
    __tablename__ = "visits"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(String)
    user_agent = Column(String, nullable=True)

def init_db():
    Base.metadata.create_all(bind=engine)
