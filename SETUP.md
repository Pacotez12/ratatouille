# 🔧 Guía de Configuración para Desarrollo Local

Esta guía te ayudará a configurar el entorno de desarrollo local sin Docker.

## 📋 Requisitos

- **Python 3.9+**
- **PostgreSQL 12+** instalado localmente
- **Node.js** (opcional, para servir el frontend con live reload)
- **Git**

## 🗄️ Paso 1: Configurar PostgreSQL

### En Windows

1. Instalar PostgreSQL desde [postgresql.org](https://www.postgresql.org/download/windows/)
2. Recordar la contraseña del usuario `postgres`
3. Abrir pgAdmin o usar psql:
   ```cmd
   psql -U postgres
   ```

4. Crear la base de datos:
   ```sql
   CREATE DATABASE ratatouille_db;
   CREATE USER "user" WITH PASSWORD 'password';
   ALTER ROLE "user" SET client_encoding TO 'utf8';
   ALTER ROLE "user" SET default_transaction_isolation TO 'read committed';
   ALTER ROLE "user" SET default_transaction_deferrable TO on;
   GRANT ALL PRIVILEGES ON DATABASE ratatouille_db TO "user";
   \q
   ```

### En Linux/Mac

```bash
# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib  # Ubuntu/Debian
brew install postgresql                         # Mac

# Iniciar servicio
sudo service postgresql start                   # Linux
brew services start postgresql                  # Mac

# Crear base de datos
sudo -u postgres psql

# En la terminal psql:
CREATE DATABASE ratatouille_db;
CREATE USER "user" WITH PASSWORD 'password';
ALTER ROLE "user" SET client_encoding TO 'utf8';
ALTER ROLE "user" SET default_transaction_isolation TO 'read committed';
ALTER ROLE "user" SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE ratatouille_db TO "user";
\q
```

## 🐍 Paso 2: Configurar Backend

### Crear entorno virtual

```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### Instalar dependencias

```bash
pip install -r requirements.txt
```

### Configurar variables de entorno

Crear archivo `.env` en la carpeta `backend/`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/ratatouille_db
```

### Inicializar base de datos

```bash
python -c "import database as db; db.init_db(); print('✅ DB inicializada')"
```

### (Opcional) Cargar datos de prueba

```bash
python seed_db.py
```

### Ejecutar servidor FastAPI

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend activo en http://localhost:8000
📚 API docs en http://localhost:8000/docs

## 🌐 Paso 3: Servir Frontend

### Opción A: Servidor local simple (Python)

```bash
cd ../frontend
python -m http.server 8080
```

Acceder a http://localhost:8080

### Opción B: Live reload con Node.js (recomendado para desarrollo)

```bash
cd ../frontend

# Si no tienes http-server instalado globalmente
npm install -g http-server

# Ejecutar con watch
http-server . -p 8080 -c-1
```

### Opción C: VS Code Live Server

1. Instalar extensión "Live Server" en VS Code
2. Click derecho en `index.html` → "Open with Live Server"

## ✅ Verificar la instalación

1. Abrir http://localhost:8080 en el navegador
2. El frontend debería cargar correctamente
3. Intentar hacer login con:
   - Usuario: `admin`
   - Contraseña: `admin123`
4. Ver http://localhost:8000/docs para probar endpoints

## 🔄 Flujo de desarrollo típico

### Terminal 1: Backend

```bash
cd backend
source venv/bin/activate          # Windows: venv\Scripts\activate
uvicorn main:app --reload
```

### Terminal 2: Frontend

```bash
cd frontend
python -m http.server 8080        # O tu método preferido
```

### Terminal 3: Base de datos (si es necesario)

```bash
# Conectarse a la BD para debugging
psql -U user -d ratatouille_db -h localhost
```

## 🐛 Solución de problemas

### Error: "No module named 'fastapi'"

```bash
# Asegúrate de estar en el venv
pip install -r requirements.txt
```

### Error: "psycopg2: connection refused"

- Verificar que PostgreSQL esté corriendo
- Verificar las credenciales en DATABASE_URL
- En Windows: Abrir PostgreSQL desde Services (servicios)

### Error: "Cannot find module 'sqlalchemy'"

```bash
pip install sqlalchemy psycopg2-binary
```

### Puerto 8000/8080 ya está en uso

```bash
# Encontrar proceso usando puerto
lsof -i :8000           # Linux/Mac
netstat -ano | find "8000"  # Windows (PowerShell)

# O usar diferente puerto
uvicorn main:app --port 8001
```

### CORS issues

Verificar que en `main.py` esté configurado:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📚 Recursos útiles

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Python Virtual Environments](https://docs.python.org/3/tutorial/venv.html)

## 🎯 Próximos pasos

Una vez que tengas todo funcionando:

1. Familiarizarte con la estructura en [README.md](./README.md)
2. Leer la documentación de API en [API.md](./API.md)
3. Empezar a contribuir en tu rama feature
4. Crear un Pull Request cuando termines

---

¡Listo para desarrollar! 🚀
