# Microservicio Purchase Order - ortiz_leccion2

## 📋 Descripción
Microservicio RESTful para la gestión de órdenes de compra (Purchase Orders) desarrollado con Spring Boot 3.4.0 y Java 17.

## 🏗️ Arquitectura del Proyecto

```
ortiz_leccion2/
├── src/
│   ├── main/
│   │   ├── java/ec/edu/espe/ortiz_leccion2/
│   │   │   ├── controllers/
│   │   │   │   └── PurchaseOrderController.java
│   │   │   ├── exceptions/
│   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   └── ValidationExceptionHandler.java
│   │   │   ├── models/entities/
│   │   │   │   └── PurchaseOrder.java
│   │   │   ├── repositories/
│   │   │   │   └── PurchaseOrderRepository.java
│   │   │   ├── services/
│   │   │   │   ├── PurchaseOrderService.java
│   │   │   │   └── PurchaseOrderServiceImpl.java
│   │   │   └── OrtizLeccion2Application.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-local.properties
│   │       ├── application-docker.properties
│   │       └── application-test.properties
│   └── test/
├── pom.xml
└── .env
```

## 🚀 Endpoints Disponibles

### Base URL: `http://localhost:8083/api/v1/purchase-orders`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET    | `/api/v1/purchase-orders` | Listar todas las órdenes de compra |
| GET    | `/api/v1/purchase-orders/{id}` | Obtener una orden por ID |
| POST   | `/api/v1/purchase-orders` | Crear una nueva orden de compra |
| PUT    | `/api/v1/purchase-orders/{id}` | Actualizar una orden existente |
| DELETE | `/api/v1/purchase-orders/{id}` | Eliminar una orden de compra |

## 📦 Entidad PurchaseOrder

```json
{
  "id": 1,
  "orderNumber": "PO-2025-000123",
  "supplierName": "ACME Tools",
  "status": "DRAFT",
  "totalAmount": 1500.50,
  "currency": "USD",
  "createdAt": "2025-12-12T17:30:00",
  "expectedDeliveryDate": "2025-12-20"
}
```

### Campos:
- **id**: Long (PK, auto-generado)
- **orderNumber**: String (único, obligatorio) - Ej: PO-2025-000123
- **supplierName**: String (obligatorio) - Nombre del proveedor
- **status**: String (obligatorio) - DRAFT | SUBMITTED | APPROVED | REJECTED | CANCELLED
- **totalAmount**: BigDecimal (obligatorio, positivo)
- **currency**: String (obligatorio) - USD | EUR
- **createdAt**: LocalDateTime (auto-generado)
- **expectedDeliveryDate**: LocalDate (obligatorio)

## 🔧 Tecnologías Utilizadas

- **Spring Boot 3.4.0**
- **Spring Data JPA** - Persistencia de datos
- **Spring Web** - API REST
- **Spring Validation** - Validación de datos
- **H2 Database** - Base de datos en memoria (desarrollo local)
- **MySQL** - Base de datos (producción/Docker)
- **Maven** - Gestión de dependencias

## ⚙️ Configuración y Ejecución

### Perfil Local (H2)
```bash
# En IntelliJ IDEA, simplemente ejecuta la clase OrtizLeccion2Application.java
# O desde terminal:
mvn spring-boot:run
```

La aplicación se ejecutará en: `http://localhost:8083`
Consola H2: `http://localhost:8083/h2-console`

### Perfil Docker (MySQL)
```bash
# Cambiar el perfil activo en application.properties a 'docker'
spring.profiles.active=docker

# Luego ejecutar con Docker Compose (cuando esté configurado)
docker-compose up
```

## 📝 Ejemplos de Uso

### Crear una orden de compra (POST)
```bash
curl -X POST http://localhost:8083/api/v1/purchase-orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderNumber": "PO-2025-000001",
    "supplierName": "ACME Tools",
    "status": "DRAFT",
    "totalAmount": 1500.50,
    "currency": "USD",
    "expectedDeliveryDate": "2025-12-20"
  }'
```

### Listar todas las órdenes (GET)
```bash
curl http://localhost:8083/api/v1/purchase-orders
```

### Obtener una orden por ID (GET)
```bash
curl http://localhost:8083/api/v1/purchase-orders/1
```

## ✅ Validaciones Implementadas

- **orderNumber**: No puede estar vacío
- **supplierName**: No puede estar vacío
- **status**: No puede estar vacío
- **totalAmount**: Obligatorio y debe ser positivo
- **currency**: No puede estar vacía
- **expectedDeliveryDate**: Obligatoria

## 🛠️ Próximos Pasos

1. Dockerizar el microservicio
2. Crear docker-compose.yml
3. Agregar más endpoints personalizados
4. Implementar DTOs para separar la capa de presentación
5. Agregar pruebas unitarias e integración
6. Documentar con Swagger/OpenAPI

## 👨‍💻 Autor
Bryan Ortiz - ESPE
