# 🐭 Ratatouille Bistró

**Ratatouille Bistró** es una plataforma web moderna para un restaurante de cocina francesa auténtica ubicado en Asunción, Paraguay. El proyecto cuenta con un sistema de gestión de productos, reservas, contactos y una interfaz administrativa.

## 📋 Descripción del Proyecto

Ratatouille Bistró es una aplicación web fullstack que permite:

- **Visualizar menú**: Catálogo de platos con imágenes, descripciones y precios
- **Hacer reservaciones**: Sistema de reservas con fecha, hora y cantidad de personas
- **Contactar**: Formulario de contacto para consultas generales
- **Panel administrativo**: Gestión de usuarios, productos, reservas y contactos
- **Autenticación**: Sistema de login con roles (superadmin, admin, staff)

## 🏗️ Arquitectura

El proyecto está estructurado con:

```
├── backend/          # API FastAPI + Base de datos
├── frontend/         # Interfaz web HTML/CSS/JS
├── docker-compose.yml # Orquestación de servicios
```

### Tecnologías principales

**Backend:**
- FastAPI (framework web moderno)
- PostgreSQL (base de datos)
- SQLAlchemy (ORM)
- Python 3.9+

**Frontend:**
- HTML5 semántico
- CSS3 moderno
- JavaScript vanilla
- Responsive design

**Deployment:**
- Docker & Docker Compose
- Nginx (servidor web frontend)

## 🚀 Inicio Rápido

### Requisitos previos

- Docker y Docker Compose instalados
- Git

### Instalación y ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone <repositorio-url>
   cd ratatouille
   ```

2. **Levantar los servicios con Docker Compose:**
   ```bash
   docker-compose up --build
   ```

   Esto levantará:
   - 🗄️ **PostgreSQL** en `localhost:5432`
   - 🔌 **Backend (FastAPI)** en `localhost:8000`
   - 🌐 **Frontend (Nginx)** en `localhost:8080`

3. **Acceder a la aplicación:**
   - Frontend: http://localhost:8080
   - API Docs: http://localhost:8000/docs

4. **Datos iniciales:**
   La base de datos se inicializa automáticamente. Para cargar datos de prueba:
   ```bash
   docker-compose exec backend python seed_db.py
   ```

   Credenciales por defecto:
   - Usuario: `admin`
   - Contraseña: `admin123`

## 📁 Estructura del Proyecto

```
ratatouille/
├── backend/
│   ├── main.py              # Aplicación principal FastAPI
│   ├── database.py          # Modelos y configuración BD
│   ├── requirements.txt     # Dependencias Python
│   ├── Dockerfile           # Imagen Docker del backend
│   ├── seed_db.py           # Script de datos iniciales
│   └── static/
│       └── uploads/
│           └── products/    # Imágenes de productos
├── frontend/
│   ├── index.html           # Página principal
│   ├── admin.html           # Panel administrativo
│   ├── app.js               # Lógica principal JavaScript
│   ├── ratatouille.css      # Estilos
│   └── Dockerfile           # Imagen Docker del frontend
├── docker-compose.yml       # Orquestación de servicios
└── README.md                # Este archivo
```

## 🗄️ Base de Datos

El proyecto utiliza PostgreSQL con las siguientes tablas:

| Tabla | Propósito |
|-------|-----------|
| `users` | Usuarios del sistema (admin, staff) |
| `products` | Catálogo de platos/bebidas |
| `reservations` | Reservas de mesas |
| `contacts` | Consultas de contacto |
| `visits` | Analítica de visitas |

## 🔌 API Endpoints principales

La API está disponible en `http://localhost:8000` con documentación interactiva en `/docs`.

**Autenticación:**
- `POST /api/login` - Iniciar sesión

**Productos:**
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/{id}` - Actualizar producto (admin)
- `DELETE /api/products/{id}` - Eliminar producto (admin)

**Reservas:**
- `GET /api/reservations` - Listar reservas (admin)
- `POST /api/reservations` - Crear reserva
- `GET /api/reservations/{id}` - Obtener reserva
- `PUT /api/reservations/{id}` - Actualizar reserva (admin)

**Usuarios:**
- `GET /api/users` - Listar usuarios (admin)
- `POST /api/users` - Crear usuario (admin)
- `PUT /api/users/{id}` - Actualizar usuario (admin)
- `DELETE /api/users/{id}` - Eliminar usuario (admin)

**Contactos:**
- `GET /api/contacts` - Listar contactos (admin)
- `POST /api/contacts` - Enviar contacto (público)

Para más detalles, consulta [API.md](./API.md).

## 🛠️ Desarrollo Local

Para desarrollar sin Docker, consulta [SETUP.md](./SETUP.md).

## 👥 Contribuir

1. Crear una rama para tu feature: `git checkout -b feature/tu-feature`
2. Hacer commit: `git commit -m "Descripción clara del cambio"`
3. Push a la rama: `git push origin feature/tu-feature`
4. Crear un Pull Request

## 📝 Convenciones de código

- **Backend**: PEP 8 (Python)
- **Frontend**: Seguir el estilo existente en `app.js`
- **Commits**: Usar idioma español o inglés de forma consistente
- **Ramas**: Nombrar con prefijo: `feature/`, `fix/`, `docs/`, `chore/`

## 🐛 Problemas Comunes

### El backend no se conecta a la BD
```bash
# Reiniciar los servicios
docker-compose down
docker-compose up --build
```

### Puertos en conflicto
Cambiar los puertos en `docker-compose.yml` si 8000, 8080 o 5432 están ocupados.

### Permiso denegado en Linux
```bash
sudo usermod -aG docker $USER
# Luego reiniciar sesión
```

## 📧 Soporte

Para reportar issues o preguntas, contactar a través del formulario de contacto en la web.

## 📄 Licencia

Proyecto de grupo académico - UNINORTE

---

**¡Bienvenido a Ratatouille Bistró!** 🍽️
