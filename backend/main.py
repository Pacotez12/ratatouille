from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import database as db
import time

# Intentar inicializar la DB con reintentos (importante para Docker Compose)
def init_db_with_retry():
    max_retries = 5
    for i in range(max_retries):
        try:
            db.init_db()
            print("Base de datos conectada con éxito.")
            break
        except Exception as e:
            print(f"Error conectando a la DB (intento {i+1}/{max_retries}): {e}")
            time.sleep(2)

app = FastAPI(title="Ratatouille Bistró API", version="1.0.0")

# Inicialización al arrancar
@app.on_event("startup")
def startup_event():
    init_db_with_retry()

# CORS (Lineamiento 5)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Esquemas Pydantic
class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image_path: str

class Product(ProductBase):
    id: int
    class Config:
        from_attributes = True

class ContactCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str

class Contact(ContactCreate):
    id: int
    status: str
    class Config:
        from_attributes = True

class ReservationCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    people: int
    date: str
    time: str
    notes: Optional[str] = None

class Reservation(ReservationCreate):
    id: int
    status: str
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

# Dependencia para la sesión de DB
def get_db():
    database = db.SessionLocal()
    try:
        yield database
    finally:
        database.close()

# ENDPOINTS

@app.post("/api/login")
def login(req: LoginRequest, db_session: Session = Depends(get_db)):
    print(f"Intento de login para usuario: {req.username}")
    user = db_session.query(db.User).filter(db.User.username == req.username.strip()).first()
    if not user:
        print("Usuario no encontrado")
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    if user.password_hash != req.password:
        print(f"Contraseña incorrecta para {req.username}")
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    print(f"Login exitoso para {req.username}")
    return {"username": user.username, "role": user.role}

@app.get("/api/products", response_model=List[Product])
def get_products(db_session: Session = Depends(get_db)):
    return db_session.query(db.Product).all()

@app.post("/api/contact")
def create_contact(contact: ContactCreate, db_session: Session = Depends(get_db)):
    new_contact = db.Contact(**contact.dict())
    db_session.add(new_contact)
    db_session.commit()
    db_session.refresh(new_contact)
    return {"message": "Mensaje enviado", "id": new_contact.id}

@app.get("/api/contacts", response_model=List[Contact])
def get_contacts(db_session: Session = Depends(get_db)):
    return db_session.query(db.Contact).all()

@app.post("/api/reservations")
def create_reservation(res: ReservationCreate, db_session: Session = Depends(get_db)):
    new_res = db.Reservation(**res.dict())
    db_session.add(new_res)
    db_session.commit()
    db_session.refresh(new_res)
    return {"message": "Reserva confirmada", "id": new_res.id}

@app.get("/api/reservations", response_model=List[Reservation])
def get_reservations(db_session: Session = Depends(get_db)):
    return db_session.query(db.Reservation).all()

@app.get("/api/stats")
def get_stats(db_session: Session = Depends(get_db)):
    stats = {
        "categorias": ["Entradas", "Principales", "Postres", "Bebidas"],
        "cantidades": [
            db_session.query(db.Product).filter(db.Product.category == "entrada").count(),
            db_session.query(db.Product).filter(db.Product.category == "principal").count(),
            db_session.query(db.Product).filter(db.Product.category == "postre").count(),
            db_session.query(db.Product).filter(db.Product.category == "bebida").count(),
        ]
    }
    return stats

@app.post("/api/track")
def track_visit():
    return {"status": "success"}

@app.get("/")
def read_root():
    return {"message": "Ratatouille API"}
