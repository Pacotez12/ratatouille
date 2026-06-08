# 🔌 Documentación de API - Ratatouille Bistró

## 📍 Base URL

```
http://localhost:8000/api
```

En producción: `https://ratatouille-bistro.com.py/api`

## 🔐 Autenticación

Actualmente, la API utiliza autenticación básica mediante sesión. Se envía username y password al endpoint `/api/login`.

⚠️ **Nota**: En producción, se recomienda implementar JWT tokens.

---

## 📌 Endpoints

### 🔑 Autenticación

#### POST `/api/login`

Iniciar sesión en el sistema.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "username": "admin",
  "role": "superadmin",
  "name": "Administrador"
}
```

**Error (401):**
```json
{
  "detail": "Credenciales inválidas"
}
```

---

### 🍽️ Productos

#### GET `/api/products`

Obtener lista de todos los productos.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Coq au Vin",
    "description": "Pollo guisado en vino tinto con champiñones",
    "price": 45000,
    "category": "Platos Principales",
    "image_path": "/static/uploads/products/coq-au-vin.jpg"
  },
  {
    "id": 2,
    "name": "Ratatouille",
    "description": "Cazuela de verduras de temporada",
    "price": 32000,
    "category": "Platos Principales",
    "image_path": "/static/uploads/products/ratatouille.jpg"
  }
]
```

#### POST `/api/products`

Crear un nuevo producto. **(Requiere autenticación admin)**

**Request:**
```json
{
  "name": "Bouillabaisse",
  "description": "Sopa de pescado tradicional provenzal",
  "price": 50000,
  "category": "Sopas",
  "image_path": "/static/uploads/products/bouillabaisse.jpg"
}
```

**Response (200 OK):**
```json
{
  "id": 3,
  "name": "Bouillabaisse",
  "description": "Sopa de pescado tradicional provenzal",
  "price": 50000,
  "category": "Sopas",
  "image_path": "/static/uploads/products/bouillabaisse.jpg"
}
```

#### PUT `/api/products/{product_id}`

Actualizar un producto. **(Requiere autenticación admin)**

**Request:**
```json
{
  "name": "Coq au Vin Bourguignon",
  "description": "Pollo guisado en vino tinto con champiñones y perlas de cebolla",
  "price": 48000,
  "category": "Platos Principales",
  "image_path": "/static/uploads/products/coq-au-vin.jpg"
}
```

**Response (200 OK):** Objeto producto actualizado

#### DELETE `/api/products/{product_id}`

Eliminar un producto. **(Requiere autenticación admin)**

**Response (200 OK):**
```json
{
  "message": "Producto eliminado correctamente"
}
```

---

### 📅 Reservaciones

#### GET `/api/reservations`

Obtener lista de todas las reservas. **(Requiere autenticación admin)**

**Query Parameters (opcional):**
- `status`: Filtrar por estado (confirmada, pendiente, cancelada)

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Juan García",
    "email": "juan@example.com",
    "phone": "+595971234567",
    "people": 4,
    "date": "2024-06-15",
    "time": "19:30",
    "notes": "Mesa cerca de la ventana",
    "status": "confirmada"
  }
]
```

#### POST `/api/reservations`

Crear una nueva reserva. **(Público)**

**Request:**
```json
{
  "name": "María López",
  "email": "maria@example.com",
  "phone": "+595987654321",
  "people": 2,
  "date": "2024-06-20",
  "time": "20:00",
  "notes": "Cumpleaños, sorpresa!"
}
```

**Response (200 OK):**
```json
{
  "id": 2,
  "name": "María López",
  "email": "maria@example.com",
  "phone": "+595987654321",
  "people": 2,
  "date": "2024-06-20",
  "time": "20:00",
  "notes": "Cumpleaños, sorpresa!",
  "status": "confirmada"
}
```

#### GET `/api/reservations/{reservation_id}`

Obtener detalles de una reserva específica.

**Response (200 OK):** Objeto reserva completo

#### PUT `/api/reservations/{reservation_id}`

Actualizar una reserva. **(Requiere autenticación admin)**

**Request:** Mismo formato que POST

**Response (200 OK):** Objeto reserva actualizado

#### DELETE `/api/reservations/{reservation_id}`

Cancelar una reserva. **(Requiere autenticación admin)**

**Response (200 OK):**
```json
{
  "message": "Reserva cancelada correctamente"
}
```

---

### 👥 Usuarios

#### GET `/api/users`

Obtener lista de usuarios del sistema. **(Requiere autenticación admin)**

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@ratatouille.com",
    "role": "superadmin",
    "name": "Administrador"
  },
  {
    "id": 2,
    "username": "staff1",
    "email": "staff@ratatouille.com",
    "role": "staff",
    "name": "Personal del Restaurante"
  }
]
```

#### POST `/api/users`

Crear un nuevo usuario. **(Requiere autenticación superadmin)**

**Request:**
```json
{
  "username": "mesero1",
  "email": "mesero1@ratatouille.com",
  "password_hash": "hashed_password_here",
  "role": "staff",
  "name": "Carlos Rodríguez"
}
```

**Response (200 OK):** Objeto usuario creado

**Error (400):**
```json
{
  "detail": "Username ya registrado"
}
```

#### PUT `/api/users/{user_id}`

Actualizar datos de usuario. **(Requiere autenticación superadmin)**

**Request:**
```json
{
  "username": "mesero1_updated",
  "email": "mesero1_new@ratatouille.com",
  "role": "admin",
  "name": "Carlos Rodríguez González",
  "password_hash": "new_hashed_password"
}
```

**Response (200 OK):** Objeto usuario actualizado

#### DELETE `/api/users/{user_id}`

Eliminar un usuario. **(Requiere autenticación superadmin)**

**Restricción:** No se puede eliminar al superadmin

**Response (200 OK):**
```json
{
  "message": "Usuario eliminado correctamente"
}
```

---

### 💬 Contactos

#### GET `/api/contacts`

Obtener lista de consultas de contacto. **(Requiere autenticación admin)**

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Roberto Fernández",
    "email": "roberto@example.com",
    "phone": "+595991234567",
    "message": "¿Ofrecen comidas privadas?",
    "status": "pendiente"
  }
]
```

#### POST `/api/contacts`

Enviar un mensaje de contacto. **(Público)**

**Request:**
```json
{
  "name": "Sofía Martínez",
  "email": "sofia@example.com",
  "phone": "+595981234567",
  "message": "Interesada en catering para evento"
}
```

**Response (200 OK):**
```json
{
  "id": 2,
  "name": "Sofía Martínez",
  "email": "sofia@example.com",
  "phone": "+595981234567",
  "message": "Interesada en catering para evento",
  "status": "pendiente"
}
```

#### PUT `/api/contacts/{contact_id}`

Actualizar estado de contacto. **(Requiere autenticación admin)**

**Request:**
```json
{
  "name": "Sofía Martínez",
  "email": "sofia@example.com",
  "phone": "+595981234567",
  "message": "Interesada en catering para evento",
  "status": "respondida"
}
```

**Response (200 OK):** Objeto contacto actualizado

---

## 🔄 Estados de Datos

### Estados de Reserva
- `confirmada` - Reserva aceptada
- `pendiente` - En espera de confirmación
- `cancelada` - Reserva cancelada

### Roles de Usuario
- `superadmin` - Acceso total del sistema
- `admin` - Gestión de operaciones
- `staff` - Personal del restaurante

### Estados de Contacto
- `pendiente` - Nuevo mensaje
- `respondida` - Ya fue contactado
- `spam` - Marcado como spam

---

## 📤 Carga de Imágenes

### POST `/api/products/upload`

Cargar imagen de producto. **(Requiere autenticación admin)**

**Request:** Form Data
- `file`: Archivo de imagen (JPEG, PNG, WebP)
- `product_id`: ID del producto

**Response (200 OK):**
```json
{
  "image_path": "/static/uploads/products/uuid_filename.jpg",
  "message": "Imagen cargada exitosamente"
}
```

---

## ⚠️ Códigos de Error HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Autenticación requerida |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## 🧪 Testing con cURL

### Ejemplo: Login

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Ejemplo: Listar Productos

```bash
curl http://localhost:8000/api/products
```

### Ejemplo: Crear Producto

```bash
curl -X POST http://localhost:8000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Crème Brûlée",
    "description": "Postre cremoso con azúcar quemada",
    "price": 15000,
    "category": "Postres",
    "image_path": "/static/uploads/products/creme-brulee.jpg"
  }'
```

---

## 📚 Documentación Interactiva

Para explorar la API interactivamente:

1. Asegúrate que el backend esté corriendo
2. Abre http://localhost:8000/docs en tu navegador
3. ¡Prueba los endpoints desde la interfaz Swagger!

Alternativa (ReDoc):
- http://localhost:8000/redoc

---

## 🔐 Notas de Seguridad

⚠️ **IMPORTANTE:**

- Las contraseñas se almacenan en texto plano (❌ NO RECOMENDADO para producción)
- Implementar hash de contraseñas (bcrypt, argon2)
- Usar HTTPS en producción
- Implementar rate limiting
- Usar JWT o session tokens seguros
- Validar y sanitizar todas las entradas
- Implementar CSRF protection

---

## 📝 Versionado de API

Actualmente: **v1.1.0**

Cambios futuros se documentarán en versiones posteriores.

---

¡Listo para integrar la API! 🚀
