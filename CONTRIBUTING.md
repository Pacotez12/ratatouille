# 🤝 Guía de Contribución - Ratatouille Bistró

¡Gracias por tu interés en contribuir a este proyecto! Esta guía te ayudará a colaborar de manera efectiva.

## 📋 Antes de Empezar

- Lee el [README.md](./README.md) para entender el proyecto
- Familiarízate con la [estructura del proyecto](./README.md#-estructura-del-proyecto)
- Verifica la [documentación de la API](./API.md)

## 🔄 Flujo de Trabajo

### 1. Crear una rama

Siempre crear una rama nueva para tu trabajo:

```bash
git checkout main
git pull origin main
git checkout -b tipo/descripcion-corta
```

**Tipos de rama:**
- `feature/` - Nueva funcionalidad
- `fix/` - Corrección de bug
- `docs/` - Documentación
- `refactor/` - Mejora de código
- `chore/` - Tareas mantenimiento
- `test/` - Nuevas pruebas

**Ejemplos:**
```bash
git checkout -b feature/agregar-carrito-compras
git checkout -b fix/error-login-usuarios
git checkout -b docs/tutorial-usuarios
```

### 2. Hacer cambios

Desarrolla tu funcionalidad en la rama. Asegúrate de:

- Seguir las convenciones de código del proyecto
- Escribir código limpio y comentado
- No dejar archivos temporales o de debug

### 3. Hacer commits significativos

```bash
git add .
git commit -m "tipo: Descripción clara del cambio"
```

**Formato de commit:**
```
tipo: descripción breve (máx 50 caracteres)

Descripción más detallada si es necesario.
Explicar el QUÉ y el POR QUÉ, no el CÓMO.

- Punto adicional si aplica
- Otro punto
```

**Ejemplos:**
```bash
git commit -m "feat: Agregar validación de email en formulario de contacto"
git commit -m "fix: Corregir error de CORS en peticiones del frontend"
git commit -m "docs: Agregar sección de desarrollo local en README"
```

### 4. Push a tu rama

```bash
git push origin tipo/descripcion-corta
```

### 5. Crear Pull Request

En GitHub:
1. Ve a la pestaña "Pull Requests"
2. Click en "New Pull Request"
3. Selecciona tu rama como "compare"
4. Completa la descripción del PR

**Plantilla de PR:**
```markdown
## 📝 Descripción
Explicación clara de qué cambios hiciste y por qué.

## 🔗 Relacionado con
- Cierra #123 (si arregla un issue)
- Depende de #456 (si es un prerequisito)

## ✅ Checklist
- [ ] Mi código sigue las convenciones del proyecto
- [ ] He probado los cambios localmente
- [ ] Agregué comentarios donde fue necesario
- [ ] La documentación está actualizada si aplica

## 🧪 Cómo probar
Pasos para que otros prueben tu cambio:
1. ...
2. ...
```

---

## 💻 Convenciones de Código

### Backend (Python)

- Seguir **PEP 8**
- Usar type hints donde sea posible
- Máximo 100 caracteres por línea
- Documentar funciones con docstrings

```python
def crear_producto(nombre: str, precio: float) -> Product:
    """
    Crea un nuevo producto en la base de datos.
    
    Args:
        nombre: Nombre del producto
        precio: Precio en guaraní
        
    Returns:
        Objeto Product creado
    """
    pass
```

### Frontend (JavaScript)

- Usar camelCase para variables y funciones
- Usar UPPER_SNAKE_CASE para constantes
- Comentar lógica compleja
- Evitar variables globales innecesarias

```javascript
const API_BASE_URL = "http://localhost:8000/api";

function formatearPrecio(monto) {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG"
  }).format(monto);
}
```

### CSS

- Usar BEM (Block Element Modifier)
- Clases descriptivas
- Comentar secciones principales

```css
/* Componente de tarjeta */
.card {
  background: white;
  border-radius: 8px;
}

.card__title {
  font-size: 1.5rem;
  font-weight: bold;
}

.card__title--highlight {
  color: #d32f2f;
}
```

---

## 🧪 Testing

### Backend

Si agregas funcionalidad al backend, crea pruebas:

```bash
pytest backend/tests/
```

### Frontend

Prueba manualmente tu código en diferentes navegadores:
- Chrome/Edge (Chromium)
- Firefox
- Safari (si tienes Mac)

---

## 📚 Estructura de Archivos

Cuando agregues nuevos archivos:

```
backend/
├── main.py              ✅ Archivo principal
├── database.py          ✅ Modelos de BD
├── utils/
│   ├── __init__.py
│   └── helpers.py       ✅ Funciones auxiliares
└── routes/              ✅ Endpoints por módulo
    ├── __init__.py
    ├── productos.py
    └── reservas.py

frontend/
├── index.html
├── admin.html
├── js/
│   ├── main.js          ✅ Lógica principal
│   ├── api.js           ✅ Llamadas a API
│   └── utils.js         ✅ Funciones auxiliares
└── css/
    └── styles.css
```

---

## 🐛 Reportar Issues

Si encuentras un bug:

1. Verifica que no esté ya reportado
2. Crea un issue con título claro
3. Incluye:
   - Descripción del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Sistema operativo y navegador

**Ejemplo:**
```markdown
## Bug: El login no funciona con caracteres especiales

### Pasos para reproducir
1. Ir a la página de login
2. Ingresar usuario "admin@123"
3. Ingresar contraseña

### Comportamiento esperado
Debería iniciar sesión exitosamente

### Comportamiento actual
Error: "Credenciales inválidas"

### Sistema
- OS: Windows 11
- Navegador: Chrome 124
- Rama: main
```

---

## 📖 Mejorando la Documentación

La documentación es tan importante como el código:

1. Lee los archivos existentes
2. Mantén consistency en formato y tono
3. Usa ejemplos claros
4. Actualiza índices si cambias la estructura

---

## ✨ Buenas Prácticas

### ✅ Haz
- Commits pequeños y enfocados
- Prueba tu código antes de hacer push
- Actualiza documentación con tus cambios
- Comunica con el equipo en el PR
- Solicita help si lo necesitas

### ❌ No hagas
- Commits gigantes con muchos cambios
- Push a main directamente
- Incluir archivos innecesarios (node_modules, venv, .env)
- Cambios sin documentar
- Código sin probar

---

## 🚀 Proceso de Review

Un mantenedor del proyecto:

1. Revisará tu código
2. Pedirá cambios si es necesario
3. Aprobará cuando todo esté bien
4. Mergeará tu PR a main

**Durante el review:**
- Sé abierto a feedback
- Pregunta si algo no está claro
- Sugiere alternativas si crees que hay mejor manera

---

## 📞 Ayuda y Comunicación

- **Questions**: Abre un discussion
- **Ideas**: Crea un issue con label "enhancement"
- **Bugs**: Reporta en la sección de Issues
- **Chat**: Contacta por el formulario web

---

## 🎓 Recursos

- [Git Branching Model](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## 💪 Gracias por contribuir!

Tu aporte es valioso. Sin importar qué sea (código, docs, testing), ayudas a mejorar Ratatouille Bistró. 🍽️

---

¡Bienvenido al equipo! 🚀
