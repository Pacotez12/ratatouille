from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import database as db
import time
import shutil
import os
import uuid
from datetime import datetime

# Asegurar directorios de carga
UPLOAD_DIR = "static/uploads/products"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Intentar inicializar la DB con reintentos (importante para Docker Compose)
def init_db_with_retry():
    max_retries = 10
    for i in range(max_retries):
        try:
            db.init_db()
            print("Base de datos conectada con éxito.")
            break
        except Exception as e:
            print(f"Error conectando a la DB (intento {i+1}/{max_retries}): {e}")
            time.sleep(2)

app = FastAPI(title="Ratatouille Bistró API", version="1.1.0")

# Montar archivos estáticos para servir las imágenes de los platos
app.mount("/static", StaticFiles(directory="static"), name="static")

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

class LoginRequest(BaseModel):
    username: str
    password: str

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

# CRUD PRODUCTOS
@app.get("/api/products", response_model=List[Product])
def get_products(db_session: Session = Depends(get_db)):
    return db_session.query(db.Product).all()

@app.post("/api/products", response_model=Product)
def create_product(product: ProductBase, db_session: Session = Depends(get_db)):
    new_product = db.Product(**product.dict())
    db_session.add(new_product)
    db_session.commit()
    db_session.refresh(new_product)
    return new_product

@app.delete("/api/products/{product_id}")
def delete_product(product_id: int, db_session: Session = Depends(get_db)):
    product = db_session.query(db.Product).filter(db.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db_session.delete(product)
    db_session.commit()
    return {"message": "Producto eliminado correctamente"}

# CARGA DE IMÁGENES
@app.post("/api/upload-image")
async def upload_image(file: UploadFile = File(...)):
    # Generar nombre único
    extension = os.path.splitext(file.filename)[1]
    if not extension:
        extension = ".jpg" # fallback
    filename = f"{uuid.uuid4()}{extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Retornar la URL pública para guardar en la DB
    # Nota: Usamos la IP de localhost:8000 para que el frontend la vea
    return {"image_path": f"http://localhost:8000/static/uploads/products/{filename}"}

# RESTO DE ENDPOINTS
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
def track_visit(db_session: Session = Depends(get_db)):
    new_visit = db.Visit(timestamp=datetime.now().isoformat())
    db_session.add(new_visit)
    db_session.commit()
    return {"status": "success"}

@app.get("/")
def read_root():
    return {"message": "Ratatouille API 1.1.0"}
