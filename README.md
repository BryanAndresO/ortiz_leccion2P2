# Microservicio Purchase Order - ortiz_leccion2

## Resumen del Proyecto

Microservicio RESTful para la gestión de órdenes de compra (Purchase Orders) desarrollado con **Spring Boot 3.4.0** y **Java 17**. Implementa operaciones CRUD completas con **filtros dinámicos avanzados**, validaciones robustas, manejo de excepciones personalizado y arquitectura dockerizada con **MySQL 8.0**.

### Características Principales

- API REST completa con endpoints GET, POST, PUT, DELETE
- Sistema de filtros dinámicos (búsqueda de texto, status, currency, rangos de montos y fechas)
- Validaciones exhaustivas con mensajes de error descriptivos
- Completamente dockerizado con MySQL y Docker Compose
- Publicado en Docker Hub - Listo para desplegar
- Arquitectura en capas (Controller, Service, Repository)
- Especificaciones JPA para consultas dinámicas
- Red compartida de microservicios para comunicación inter-servicios

---

## PASOS PARA EJECUTAR

### Opción 1: Ejecutar con Docker (RECOMENDADO)

Esta es la forma más rápida y no requiere tener Java ni Maven instalados.

#### Requisitos:
- Docker Desktop instalado y corriendo

#### Pasos:

**1. Clonar o descargar el repositorio**
```bash
git clone https://github.com/BryanAndresO/ortiz_leccion2P2.git
cd ortiz_leccion2P2
```

**2. Levantar los servicios con Docker Compose**
```bash
docker-compose up -d
```

**3. Verificar que los contenedores estén corriendo**
```bash
docker-compose ps
```

Deberías ver:
- `mysql-purchaseorder` - Healthy
- `purchaseorder-service` - Running

**4. Probar el servicio**
```bash
# Listar órdenes (debería devolver array vacío inicialmente)
curl http://localhost:8083/api/v1/purchase-orders

# Crear una orden de prueba
curl -X POST http://localhost:8083/api/v1/purchase-orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderNumber": "PO-2025-000001",
    "supplierName": "ACME Tools",
    "status": "DRAFT",
    "totalAmount": 1500.50,
    "currency": "USD",
    "expectedDeliveryDate": "2025-02-15"
  }'
```

**5. Ver logs (opcional)**
```bash
docker-compose logs -f purchaseorder-service
```

**6. Detener los servicios**
```bash
docker-compose down
```

---

### Opción 2: Usar imagen de Docker Hub (MÁS RÁPIDO)

Si solo quieres probar el servicio sin clonar el repositorio:

**1. Descargar y ejecutar directamente desde Docker Hub**
```bash
# Crear red de microservicios
docker network create microservices-network

# Levantar MySQL
docker run -d \
  --name mysql-purchaseorder \
  --network microservices-network \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=purchaseorderdb \
  -e MYSQL_USER=appuser \
  -e MYSQL_PASSWORD=root \
  -p 3307:3306 \
  mysql:8.0

# Esperar 20 segundos para que MySQL inicie
timeout 20

# Levantar el microservicio
docker run -d \
  --name purchaseorder-service \
  --network microservices-network \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql-purchaseorder:3306/purchaseorderdb?allowPublicKeyRetrieval=true&useSSL=false \
  -e SPRING_DATASOURCE_USERNAME=appuser \
  -e SPRING_DATASOURCE_PASSWORD=root \
  -p 8083:8080 \
  jaco224/purchaseorder-service:latest
```

**2. Probar el servicio**
```bash
curl http://localhost:8083/api/v1/purchase-orders
```

**3. Detener y limpiar**
```bash
docker stop purchaseorder-service mysql-purchaseorder
docker rm purchaseorder-service mysql-purchaseorder
```

---

### Opción 3: Ejecutar localmente (Desarrollo)

#### Requisitos:
- Java 17 o superior
- Maven 3.6+

#### Pasos:

**1. Clonar el repositorio**
```bash
git clone https://github.com/BryanAndresO/ortiz_leccion2P2.git
cd ortiz_leccion2P2
```

**2. Ejecutar con Maven (usa H2 en memoria)**
```bash
./mvnw spring-boot:run
```

**3. Acceder a la aplicación**
- API: `http://localhost:8083/api/v1/purchase-orders`
- Consola H2: `http://localhost:8083/h2-console`
  - JDBC URL: `jdbc:h2:mem:purchaseorderdb`
  - Username: `sa`
  - Password: (vacío)

---

## Endpoints Disponibles

### Base URL: `http://localhost:8083/api/v1/purchase-orders`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| **POST** | `/api/v1/purchase-orders` | Crear una nueva orden de compra |
| **GET** | `/api/v1/purchase-orders` | Listar todas las órdenes (con filtros opcionales) |
| **GET** | `/api/v1/purchase-orders/{id}` | Obtener una orden por ID |
| **PUT** | `/api/v1/purchase-orders/{id}` | Actualizar una orden existente |
| **DELETE** | `/api/v1/purchase-orders/{id}` | Eliminar una orden de compra |

---

## Filtros Disponibles (GET)

Todos los filtros son **opcionales** y se pueden combinar:

### 1. Búsqueda de texto (q)
Busca en `orderNumber` y `supplierName` (case-insensitive)
```
GET /api/v1/purchase-orders?q=acme
```

### 2. Filtro por status
Valores: `DRAFT`, `SUBMITTED`, `APPROVED`, `REJECTED`, `CANCELLED`
```
GET /api/v1/purchase-orders?status=APPROVED
```

### 3. Filtro por currency
Valores: `USD`, `EUR`
```
GET /api/v1/purchase-orders?currency=USD
```

### 4. Filtro por rango de montos
```
GET /api/v1/purchase-orders?minTotal=500&maxTotal=2000
```

### 5. Filtro por rango de fechas
Formato: `yyyy-MM-ddTHH:mm:ss`
```
GET /api/v1/purchase-orders?from=2025-01-01T00:00:00&to=2025-06-30T23:59:59
```

### 6. Filtros combinados
```
GET /api/v1/purchase-orders?q=acme&status=APPROVED&currency=USD&minTotal=100&maxTotal=5000&from=2025-01-01T00:00:00&to=2025-06-30T23:59:59
```

---

## Reglas de Validación de Filtros

### Validaciones automáticas:
- **status inválido**: Retorna 400 Bad Request con mensaje de error
- **currency inválido**: Retorna 400 Bad Request con mensaje de error
- **from > to**: Retorna 400 Bad Request - "La fecha 'from' no puede ser posterior a la fecha 'to'"
- **minTotal > maxTotal**: Retorna 400 Bad Request - "El monto mínimo no puede ser mayor que el monto máximo"
- **minTotal < 0**: Retorna 400 Bad Request - "El monto mínimo debe ser mayor o igual a 0"
- **maxTotal < 0**: Retorna 400 Bad Request - "El monto máximo debe ser mayor o igual a 0"

### Comportamiento cuando no se envían filtros:
- Si un filtro no se envía o viene vacío, no se aplica ese filtro
- Si no se envía ningún filtro, retorna todas las órdenes

---

## Modelo de Datos: PurchaseOrder

```json
{
  "id": 1,
  "orderNumber": "PO-2025-000123",
  "supplierName": "ACME Tools",
  "status": "APPROVED",
  "totalAmount": 1500.50,
  "currency": "USD",
  "createdAt": "2025-12-12T17:30:00",
  "expectedDeliveryDate": "2025-12-20"
}
```

### Validaciones de campos:
- `orderNumber`: Obligatorio, único, no puede estar vacío
- `supplierName`: Obligatorio, no puede estar vacío
- `status`: Obligatorio (DRAFT | SUBMITTED | APPROVED | REJECTED | CANCELLED)
- `totalAmount`: Obligatorio, debe ser mayor a 0
- `currency`: Obligatorio (USD | EUR)
- `createdAt`: Auto-generado (fecha y hora del sistema)
- `expectedDeliveryDate`: Obligatorio

---

## Ejemplos de Pruebas con cURL

### Crear una orden
```bash
curl -X POST http://localhost:8083/api/v1/purchase-orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderNumber": "PO-2025-000001",
    "supplierName": "ACME Tools",
    "status": "DRAFT",
    "totalAmount": 1500.50,
    "currency": "USD",
    "expectedDeliveryDate": "2025-02-15"
  }'
```

### Listar todas las órdenes
```bash
curl http://localhost:8083/api/v1/purchase-orders
```

### Buscar órdenes de ACME aprobadas en USD
```bash
curl "http://localhost:8083/api/v1/purchase-orders?q=acme&status=APPROVED&currency=USD"
```

### Obtener orden por ID
```bash
curl http://localhost:8083/api/v1/purchase-orders/1
```

### Actualizar una orden
```bash
curl -X PUT http://localhost:8083/api/v1/purchase-orders/1 \
  -H "Content-Type: application/json" \
  -d '{
    "orderNumber": "PO-2025-000001-UPDATED",
    "supplierName": "ACME Tools Updated",
    "status": "APPROVED",
    "totalAmount": 1800.00,
    "currency": "USD",
    "expectedDeliveryDate": "2025-02-20"
  }'
```

### Eliminar una orden
```bash
curl -X DELETE http://localhost:8083/api/v1/purchase-orders/1
```

---

## Información de Docker

### Imagen en Docker Hub
```bash
docker pull jaco224/purchaseorder-service:latest
```

### Tags disponibles:
- `latest` - Última versión
- `v1.0.0` - Versión 1.0.0

### Servicios Docker Compose:

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| `purchaseorder-service` | 8083:8080 | Microservicio Spring Boot |
| `mysql-purchaseorder` | 3307:3306 | Base de datos MySQL 8.0 |

### Acceso a MySQL:
```
Host: localhost
Port: 3307
Database: purchaseorderdb
Username: appuser
Password: root
```

---

## Arquitectura del Proyecto

```
ortiz_leccion2/
├── src/main/java/ec/edu/espe/ortiz_leccion2/
│   ├── controllers/
│   │   └── PurchaseOrderController.java       # Endpoints REST
│   ├── services/
│   │   ├── PurchaseOrderService.java          # Interface del servicio
│   │   └── PurchaseOrderServiceImpl.java      # Lógica de negocio
│   ├── repositories/
│   │   └── PurchaseOrderRepository.java       # Acceso a datos (JPA)
│   ├── models/
│   │   ├── entities/
│   │   │   └── PurchaseOrder.java             # Entidad JPA
│   │   ├── enums/
│   │   │   ├── OrderStatus.java               # Enum de estados
│   │   │   └── Currency.java                  # Enum de monedas
│   │   └── dto/
│   │       └── PurchaseOrderFilterDTO.java    # DTO para filtros
│   ├── specifications/
│   │   └── PurchaseOrderSpecification.java    # Consultas dinámicas
│   ├── exceptions/
│   │   ├── ValidationExceptionHandler.java    # Manejo de errores
│   │   ├── InvalidFilterException.java
│   │   └── ResourceNotFoundException.java
│   └── OrtizLeccion2Application.java          # Clase principal
├── src/main/resources/
│   ├── application.properties                 # Configuración base
│   ├── application-local.properties           # Perfil local (H2)
│   └── application-docker.properties          # Perfil Docker (MySQL)
├── Dockerfile                                 # Construcción de imagen
├── docker-compose.yml                         # Orquestación de servicios
├── pom.xml                                    # Dependencias Maven
└── README.md                                  # Este archivo
```

---

## Tecnologías Utilizadas

- **Spring Boot 3.4.0** - Framework principal
- **Spring Data JPA** - Persistencia y especificaciones
- **Spring Web** - API REST
- **Spring Validation** - Validaciones
- **MySQL 8.0** - Base de datos (Docker)
- **H2 Database** - Base de datos en memoria (local)
- **Maven** - Gestión de dependencias
- **Docker & Docker Compose** - Containerización
- **Java 17** - Lenguaje de programación

---

## Notas Importantes

1. **Perfiles de Spring:**
   - `local`: Usa H2 en memoria (desarrollo)
   - `docker`: Usa MySQL (producción)

2. **Puertos:**
   - Aplicación: `8083` (externo) → `8080` (interno)
   - MySQL: `3307` (externo) → `3306` (interno)

3. **Persistencia:**
   - Los datos de MySQL se guardan en un volumen Docker
   - Para eliminar datos: `docker-compose down -v`

4. **Healthcheck:**
   - El servicio espera a que MySQL esté listo antes de iniciar

5. **Red de microservicios:**
   - Usa la red `microservices-network` para comunicación entre servicios

---

## Troubleshooting

### El servicio no inicia
```bash
# Ver logs
docker-compose logs -f purchaseorder-service

# Verificar MySQL
docker-compose logs -f mysql-purchaseorder
```

### Reiniciar desde cero
```bash
docker-compose down -v
docker-compose up --build -d
```

### Puerto 8083 ya en uso
```bash
# Cambiar puerto en .env
SERVICE_PORT=8084

# O detener el proceso que usa el puerto (Windows)
netstat -ano | findstr :8083
taskkill /PID <PID> /F
```

### Error de conexión a MySQL
```bash
# Verificar que MySQL esté healthy
docker-compose ps

# Si no está healthy, revisar logs
docker-compose logs mysql-purchaseorder

# Reiniciar solo MySQL
docker-compose restart mysql-purchaseorder
```

---

## Autor

**Bryan Ortiz**  
Universidad de las Fuerzas Armadas ESPE  
Aplicaciones Distribuidas - 2025

---

## Recursos Adicionales

- **Repositorio GitHub:** https://github.com/BryanAndresO/ortiz_leccion2P2
- **Docker Hub:** https://hub.docker.com/r/jaco224/purchaseorder-service
- **Documentación Spring Boot:** https://spring.io/projects/spring-boot
- **Documentación Docker:** https://docs.docker.com/
