# Sistema de Gestión de Órdenes de Compra

Sistema completo de gestión de órdenes de compra desarrollado con arquitectura de microservicios, utilizando Spring Boot para el backend y React para el frontend.

## 🏗️ Arquitectura

El proyecto está compuesto por tres servicios principales:

1. **Backend API** (Spring Boot 3.4.0 + Java 17)
2. **Base de Datos** (MySQL 8.0)
3. **Frontend** (React 18 + Vite + Material-UI)

Todos los servicios están dockerizados y se comunican a través de una red compartida de Docker.

## 📋 Requisitos Previos

- Docker Desktop 20.10 o superior
- Docker Compose 2.0 o superior
- (Opcional) Node.js 18+ y Java 17+ para desarrollo local

## 🚀 Inicio Rápido con Docker

### 1. Clonar el repositorio

```bash
git clone https://github.com/BryanAndresO/ortiz_leccion2P2.git
cd ortiz_leccion2P2
```

### 2. Levantar todos los servicios

```bash
docker-compose up --build -d
```

### 3. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **API Backend**: http://localhost:8083/api/v1/purchase-orders
- **Base de Datos MySQL**: localhost:3307

### 4. Detener los servicios

```bash
docker-compose down
```

Para eliminar también los volúmenes de datos:

```bash
docker-compose down -v
```

## � Imágenes en Docker Hub

Las imágenes del proyecto están disponibles públicamente en Docker Hub:

### Backend API
- **Repositorio**: `jaco224/purchaseorder-service:latest`
- **URL**: https://hub.docker.com/r/jaco224/purchaseorder-service
- **Tamaño**: ~360 MB

### Frontend React
- **Repositorio**: `jaco224/purchaseorder-frontend:latest`
- **URL**: https://hub.docker.com/r/jaco224/purchaseorder-frontend
- **Tamaño**: ~82 MB

### Descargar y ejecutar desde Docker Hub

```bash
# Descargar imágenes
docker pull jaco224/purchaseorder-service:latest
docker pull jaco224/purchaseorder-frontend:latest

# O simplemente ejecutar docker-compose (descarga automáticamente)
docker-compose up -d
```

## �📁 Estructura del Proyecto

```
ortiz_leccion2/
├── src/                          # Backend Spring Boot
│   └── main/
│       ├── java/
│       │   └── ec/edu/espe/ortiz_leccion2/
│       │       ├── config/       # Configuraciones (CORS, etc.)
│       │       ├── controllers/  # Controladores REST
│       │       ├── services/     # Lógica de negocio
│       │       ├── repositories/ # Acceso a datos (JPA)
│       │       ├── models/       # Entidades y DTOs
│       │       ├── specifications/ # Filtros dinámicos
│       │       └── exceptions/   # Manejo de errores
│       └── resources/
│           ├── application.properties
│           ├── application-local.properties
│           └── application-docker.properties
├── frontend/                     # Frontend React
│   ├── src/
│   │   ├── components/          # Componentes reutilizables
│   │   ├── pages/               # Páginas de la aplicación
│   │   ├── services/            # Servicios API
│   │   ├── theme/               # Tema Material-UI
│   │   ├── App.jsx              # Configuración de rutas
│   │   └── main.jsx             # Punto de entrada
│   ├── Dockerfile               # Docker para frontend
│   ├── nginx.conf               # Configuración Nginx
│   └── package.json
├── docker-compose.yml           # Orquestación de servicios
├── Dockerfile                   # Docker para backend
├── .env                         # Variables de entorno
└── README.md
```

## 🔧 Configuración

### Variables de Entorno (.env)

```env
# Base de datos MySQL
DB_ROOT_PASSWORD=root
DB_NAME=purchaseorderdb
DB_USER=appuser
DB_PASSWORD=root
DB_PORT=3307

# Puerto del servicio backend
SERVICE_PORT=8083

# Puerto del frontend
FRONTEND_PORT=3000
```

### Credenciales de Base de Datos

**Para MySQL Workbench:**
- Host: `localhost`
- Port: `3307`
- Username: `appuser` (o `root`)
- Password: `root`
- Database: `purchaseorderdb`

## 🎯 Funcionalidades

### Backend API

- ✅ CRUD completo de órdenes de compra
- ✅ Filtros dinámicos (búsqueda, estado, moneda, rangos de fecha y monto)
- ✅ Validaciones robustas
- ✅ Manejo global de excepciones
- ✅ Configuración CORS para frontend
- ✅ Especificaciones JPA para consultas complejas

### Frontend

- ✅ Dashboard con estadísticas en tiempo real
- ✅ Lista de órdenes con tabla responsive
- ✅ Formularios de creación y edición con validación
- ✅ Panel de filtros dinámicos (7 tipos de filtros)
- ✅ **Interfaz completamente en español**
- ✅ Diseño moderno con Material-UI
- ✅ Notificaciones y mensajes de error
- ✅ Navegación con React Router
- ✅ Estados traducidos (Borrador, Enviada, Aprobada, Rechazada, Cancelada)
- ✅ Responsive design (móvil, tablet, desktop)

## 📡 Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/purchase-orders` | Listar órdenes (con filtros opcionales) |
| GET | `/api/v1/purchase-orders/{id}` | Obtener orden por ID |
| POST | `/api/v1/purchase-orders` | Crear nueva orden |
| PUT | `/api/v1/purchase-orders/{id}` | Actualizar orden |
| DELETE | `/api/v1/purchase-orders/{id}` | Eliminar orden |

### Filtros Disponibles

- `q`: Búsqueda de texto (número de orden o proveedor)
- `status`: Estado (DRAFT, SUBMITTED, APPROVED, REJECTED, CANCELLED)
- `currency`: Moneda (USD, EUR)
- `minTotal` / `maxTotal`: Rango de montos
- `from` / `to`: Rango de fechas

**Ejemplo:**
```
GET /api/v1/purchase-orders?status=APPROVED&currency=USD&minTotal=100
```

## 🛠️ Desarrollo Local

### Backend

```bash
# Compilar
mvn clean package

# Ejecutar con perfil local (H2)
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🐳 Docker

### Construir imágenes individuales

```bash
# Backend
docker build -t purchaseorder-service .

# Frontend
cd frontend
docker build -t purchaseorder-frontend .
```

### Ver logs

```bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f purchaseorder-service
docker-compose logs -f purchaseorder-frontend
docker-compose logs -f mysql-purchaseorder
```

### Estado de los servicios

```bash
docker-compose ps
```

## 🧪 Pruebas

### Crear una orden de compra (cURL)

```bash
curl -X POST http://localhost:8083/api/v1/purchase-orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderNumber": "OC-2025-001",
    "supplierName": "Proveedor Test",
    "status": "DRAFT",
    "totalAmount": 1500.50,
    "currency": "USD",
    "expectedDeliveryDate": "2025-12-31"
  }'
```

### Listar todas las órdenes

```bash
curl http://localhost:8083/api/v1/purchase-orders
```

## 🔍 Resolución de Problemas

### Error CORS

Si encuentras errores de CORS, verifica que el backend tenga la configuración en `CorsConfig.java` y que esté corriendo en el puerto correcto.

### Puerto en uso

Si algún puerto está en uso, modifica el archivo `.env`:

```env
SERVICE_PORT=8084
FRONTEND_PORT=3001
DB_PORT=3308
```

### Reiniciar completamente

```bash
docker-compose down -v
docker system prune -a
docker-compose up --build -d
```

## 📝 Tecnologías Utilizadas

### Backend
- Spring Boot 3.4.0
- Java 17
- Spring Data JPA
- MySQL 8.0
- Maven

### Frontend
- React 18
- Vite
- Material-UI (MUI)
- React Router
- Axios

### DevOps
- Docker
- Docker Compose
- Nginx

## 👨‍💻 Autor

**Bryan Andres Ortiz Tomalo**  
Universidad de las Fuerzas Armadas ESPE  
Aplicaciones Distribuidas - 2025


## 🔗 Enlaces

- [Repositorio GitHub](https://github.com/BryanAndresO/ortiz_leccion2P2)
- [Backend en Docker Hub](https://hub.docker.com/r/jaco224/purchaseorder-service)
- [Frontend en Docker Hub](https://hub.docker.com/r/jaco224/purchaseorder-frontend)

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos.

