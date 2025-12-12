# Microservicio Purchase Order - ortiz_leccion2

## Descripción del Sistema

Microservicio RESTful desarrollado con Spring Boot 3.4.0 y Java 17 para la gestión integral de órdenes de compra (Purchase Orders). El sistema implementa operaciones CRUD completas con capacidades avanzadas de filtrado dinámico, validaciones robustas y manejo de excepciones personalizado. La arquitectura está completamente dockerizada utilizando MySQL 8.0 como motor de base de datos.

### Características Principales

- API REST completa con endpoints GET, POST, PUT, DELETE
- Sistema de filtros dinámicos: búsqueda de texto, status, currency, rangos de montos y fechas
- Validaciones exhaustivas con mensajes de error descriptivos
- Arquitectura dockerizada con MySQL y Docker Compose
- Imagen publicada en Docker Hub lista para despliegue
- Arquitectura en capas: Controller, Service, Repository
- Especificaciones JPA para consultas dinámicas
- Red compartida de microservicios para comunicación inter-servicios
- Manejo global de excepciones

---

## Requisitos del Entorno

### Para Ejecución con Docker (Recomendado)
- Docker Desktop 20.10 o superior
- Docker Compose 2.0 o superior
- Sistema operativo: Windows 10/11, macOS, o Linux
- Memoria RAM: Mínimo 4GB disponible
- Espacio en disco: Mínimo 2GB disponible

### Para Ejecución Local (Desarrollo)
- Java Development Kit (JDK) 17 o superior
- Apache Maven 3.6 o superior
- Variable de entorno JAVA_HOME configurada
- Sistema operativo: Windows 10/11, macOS, o Linux

### Puertos Requeridos
- Puerto 8083: Aplicación Spring Boot (externo)
- Puerto 3307: Base de datos MySQL (externo)

---

## Instrucciones para Construir la Imagen Docker

### Construcción Manual

1. Clonar el repositorio:
```bash
git clone https://github.com/BryanAndresO/ortiz_leccion2P2.git
cd ortiz_leccion2P2
```

2. Construir la imagen Docker:
```bash
docker build -t purchaseorder-service:latest .
```

3. Verificar la imagen creada:
```bash
docker images | grep purchaseorder-service
```

### Construcción con Docker Compose

Construir todos los servicios definidos en docker-compose.yml:
```bash
docker-compose build
```

Construir y levantar los servicios simultáneamente:
```bash
docker-compose up --build -d
```

### Proceso de Construcción Multi-etapa

El Dockerfile utiliza una construcción multi-etapa para optimizar el tamaño de la imagen:

**Etapa 1 - Build Stage:**
- Imagen base: maven:3.9-eclipse-temurin-17
- Descarga de dependencias Maven
- Compilación del código fuente
- Generación del archivo JAR ejecutable

**Etapa 2 - Runtime Stage:**
- Imagen base: eclipse-temurin:17-jre-alpine
- Copia del JAR desde la etapa de construcción
- Configuración de variables de entorno
- Exposición del puerto 8080 (interno)

---

## Comando para Ejecutar el Contenedor

### Opción 1: Ejecución con Docker Compose (Recomendado)

Iniciar todos los servicios:
```bash
docker-compose up -d
```

Verificar el estado de los contenedores:
```bash
docker-compose ps
```

Visualizar logs en tiempo real:
```bash
docker-compose logs -f purchaseorder-service
```

Detener los servicios:
```bash
docker-compose down
```

Detener y eliminar volúmenes de datos:
```bash
docker-compose down -v
```

### Opción 2: Ejecución Manual con Docker

Crear la red de microservicios:
```bash
docker network create microservices-network
```

Ejecutar el contenedor MySQL:
```bash
docker run -d \
  --name mysql-purchaseorder \
  --network microservices-network \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=purchaseorderdb \
  -e MYSQL_USER=appuser \
  -e MYSQL_PASSWORD=root \
  -p 3307:3306 \
  mysql:8.0
```

Ejecutar el contenedor del microservicio:
```bash
docker run -d \
  --name purchaseorder-service \
  --network microservices-network \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql-purchaseorder:3306/purchaseorderdb?allowPublicKeyRetrieval=true&useSSL=false \
  -e SPRING_DATASOURCE_USERNAME=appuser \
  -e SPRING_DATASOURCE_PASSWORD=root \
  -p 8083:8080 \
  purchaseorder-service:latest
```

### Opción 3: Ejecución desde Docker Hub

Descargar la imagen:
```bash
docker pull jaco224/purchaseorder-service:latest
```

Ejecutar el contenedor:
```bash
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

---

## URL Base de la API

### Endpoint Principal
```
http://localhost:8083/api/v1/purchase-orders
```

### Endpoints Disponibles

| Método HTTP | Ruta | Descripción |
|-------------|------|-------------|
| POST | `/api/v1/purchase-orders` | Crear una nueva orden de compra |
| GET | `/api/v1/purchase-orders` | Listar todas las órdenes con filtros opcionales |
| GET | `/api/v1/purchase-orders/{id}` | Obtener una orden específica por ID |
| PUT | `/api/v1/purchase-orders/{id}` | Actualizar una orden existente |
| DELETE | `/api/v1/purchase-orders/{id}` | Eliminar una orden de compra |

### Verificación del Servicio

Verificar que el servicio está activo:
```bash
curl http://localhost:8083/api/v1/purchase-orders
```

Respuesta esperada (lista vacía inicialmente):
```json
[]
```

---

## Modelo de Datos

### Entidad PurchaseOrder

```json
{
  "id": 1,
  "orderNumber": "PO-2025-000123",
  "supplierName": "ACME Corporation",
  "status": "APPROVED",
  "totalAmount": 1500.50,
  "currency": "USD",
  "createdAt": "2025-12-12T17:30:00",
  "expectedDeliveryDate": "2025-12-20"
}
```

### Validaciones de Campos

- **orderNumber**: Obligatorio, único, no puede estar vacío
- **supplierName**: Obligatorio, no puede estar vacío
- **status**: Obligatorio (valores permitidos: DRAFT, SUBMITTED, APPROVED, REJECTED, CANCELLED)
- **totalAmount**: Obligatorio, debe ser mayor a 0
- **currency**: Obligatorio (valores permitidos: USD, EUR)
- **createdAt**: Generado automáticamente por el sistema
- **expectedDeliveryDate**: Obligatorio, formato ISO 8601

---

## Filtros Disponibles

### Parámetros de Consulta

Todos los filtros son opcionales y pueden combinarse:

**1. Búsqueda de texto (q)**
```
GET /api/v1/purchase-orders?q=acme
```
Busca en los campos orderNumber y supplierName (case-insensitive)

**2. Filtro por estado (status)**
```
GET /api/v1/purchase-orders?status=APPROVED
```
Valores permitidos: DRAFT, SUBMITTED, APPROVED, REJECTED, CANCELLED

**3. Filtro por moneda (currency)**
```
GET /api/v1/purchase-orders?currency=USD
```
Valores permitidos: USD, EUR

**4. Filtro por rango de montos**
```
GET /api/v1/purchase-orders?minTotal=500&maxTotal=2000
```

**5. Filtro por rango de fechas**
```
GET /api/v1/purchase-orders?from=2025-01-01T00:00:00&to=2025-06-30T23:59:59
```
Formato: yyyy-MM-ddTHH:mm:ss

**6. Filtros combinados**
```
GET /api/v1/purchase-orders?q=acme&status=APPROVED&currency=USD&minTotal=100&maxTotal=5000&from=2025-01-01T00:00:00&to=2025-06-30T23:59:59
```

### Validaciones de Filtros

El sistema valida automáticamente:
- Status inválido: Retorna 400 Bad Request
- Currency inválido: Retorna 400 Bad Request
- from > to: Retorna 400 Bad Request
- minTotal > maxTotal: Retorna 400 Bad Request
- minTotal < 0: Retorna 400 Bad Request
- maxTotal < 0: Retorna 400 Bad Request

---

## Ejemplos de Uso

### Crear una Orden de Compra

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

### Listar Todas las Órdenes

```bash
curl http://localhost:8083/api/v1/purchase-orders
```

### Buscar Órdenes Específicas

```bash
curl "http://localhost:8083/api/v1/purchase-orders?q=acme&status=APPROVED&currency=USD"
```

### Obtener Orden por ID

```bash
curl http://localhost:8083/api/v1/purchase-orders/1
```

### Actualizar una Orden

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

### Eliminar una Orden

```bash
curl -X DELETE http://localhost:8083/api/v1/purchase-orders/1
```

---

## Arquitectura del Sistema

### Estructura del Proyecto

```
ortiz_leccion2/
├── src/main/java/ec/edu/espe/ortiz_leccion2/
│   ├── controllers/
│   │   └── PurchaseOrderController.java       # Capa de presentación - Endpoints REST
│   ├── services/
│   │   ├── PurchaseOrderService.java          # Interface de servicios
│   │   └── PurchaseOrderServiceImpl.java      # Implementación de lógica de negocio
│   ├── repositories/
│   │   └── PurchaseOrderRepository.java       # Capa de acceso a datos (JPA)
│   ├── models/
│   │   ├── entities/
│   │   │   └── PurchaseOrder.java             # Entidad JPA
│   │   ├── enums/
│   │   │   ├── OrderStatus.java               # Enumeración de estados
│   │   │   └── Currency.java                  # Enumeración de monedas
│   │   └── dto/
│   │       └── PurchaseOrderFilterDTO.java    # Data Transfer Object para filtros
│   ├── specifications/
│   │   └── PurchaseOrderSpecification.java    # Especificaciones JPA para consultas dinámicas
│   ├── exceptions/
│   │   ├── GlobalExceptionHandler.java        # Manejo global de excepciones
│   │   ├── InvalidFilterException.java        # Excepción para filtros inválidos
│   │   └── ResourceNotFoundException.java     # Excepción para recursos no encontrados
│   └── OrtizLeccion2Application.java          # Clase principal de la aplicación
├── src/main/resources/
│   ├── application.properties                 # Configuración base
│   ├── application-local.properties           # Perfil local (H2)
│   └── application-docker.properties          # Perfil Docker (MySQL)
├── Dockerfile                                 # Definición de imagen Docker
├── docker-compose.yml                         # Orquestación de servicios
├── pom.xml                                    # Configuración de dependencias Maven
└── README.md                                  # Documentación del proyecto
```

### Tecnologías y Dependencias

- **Spring Boot 3.4.0**: Framework principal para desarrollo de aplicaciones Java
- **Spring Data JPA**: Capa de persistencia y especificaciones dinámicas
- **Spring Web**: Desarrollo de API REST
- **Spring Validation**: Validaciones de datos
- **MySQL 8.0**: Sistema de gestión de base de datos relacional (producción)
- **H2 Database**: Base de datos en memoria (desarrollo y pruebas)
- **Maven**: Gestión de dependencias y construcción del proyecto
- **Docker**: Containerización de la aplicación
- **Docker Compose**: Orquestación de múltiples contenedores
- **Java 17**: Lenguaje de programación

---

## Configuración de Perfiles

### Perfil Local (local)
- Base de datos: H2 en memoria
- Puerto: 8083
- Consola H2: http://localhost:8083/h2-console
- JDBC URL: jdbc:h2:mem:purchaseorderdb
- Usuario: sa
- Contraseña: (vacía)

### Perfil Docker (docker)
- Base de datos: MySQL 8.0
- Host: mysql-purchaseorder
- Puerto interno: 3306
- Puerto externo: 3307
- Base de datos: purchaseorderdb
- Usuario: appuser
- Contraseña: root

---

## Información de Docker

### Servicios Docker Compose

| Servicio | Imagen | Puerto | Descripción |
|----------|--------|--------|-------------|
| purchaseorder-service | purchaseorder-service:latest | 8083:8080 | Microservicio Spring Boot |
| mysql-purchaseorder | mysql:8.0 | 3307:3306 | Base de datos MySQL |

### Volúmenes

- **mysql_purchaseorder_data**: Almacenamiento persistente de datos MySQL

### Redes

- **microservices-network**: Red bridge para comunicación entre microservicios

### Imagen en Docker Hub

Repositorio: `jaco224/purchaseorder-service`

Tags disponibles:
- `latest`: Última versión estable
- `v1.0.0`: Versión 1.0.0

Descargar imagen:
```bash
docker pull jaco224/purchaseorder-service:latest
```

---

## Resolución de Problemas

### El servicio no inicia

Verificar logs del servicio:
```bash
docker-compose logs -f purchaseorder-service
```

Verificar logs de MySQL:
```bash
docker-compose logs -f mysql-purchaseorder
```

### Reiniciar completamente el sistema

```bash
docker-compose down -v
docker-compose up --build -d
```

### Puerto 8083 en uso

Modificar el archivo .env:
```
SERVICE_PORT=8084
```

O detener el proceso que utiliza el puerto (Windows):
```bash
netstat -ano | findstr :8083
taskkill /PID <PID> /F
```

### Error de conexión a MySQL

Verificar estado de salud de MySQL:
```bash
docker-compose ps
```

Revisar logs de MySQL:
```bash
docker-compose logs mysql-purchaseorder
```

Reiniciar servicio MySQL:
```bash
docker-compose restart mysql-purchaseorder
```

### Limpiar contenedores y volúmenes

```bash
docker-compose down -v
docker system prune -a --volumes
```

---

## Notas Técnicas

1. **Healthcheck**: El servicio implementa un healthcheck que verifica la disponibilidad de MySQL antes de iniciar la aplicación.

2. **Persistencia de Datos**: Los datos de MySQL se almacenan en un volumen Docker nombrado, garantizando la persistencia entre reinicios.

3. **Variables de Entorno**: Todas las configuraciones sensibles se gestionan mediante variables de entorno definidas en docker-compose.yml.

4. **Optimización de Memoria**: La JVM está configurada con límites de memoria (Xmx256m, Xms128m) para optimizar el uso de recursos.

5. **Red de Microservicios**: Utiliza una red bridge compartida que permite la comunicación entre múltiples microservicios.

---

## Autor

**Bryan Ortiz**  
Universidad de las Fuerzas Armadas ESPE  
Aplicaciones Distribuidas - 2025

---

## Referencias y Recursos

- Repositorio GitHub: https://github.com/BryanAndresO/ortiz_leccion2P2
- Docker Hub: https://hub.docker.com/r/jaco224/purchaseorder-service
- Documentación Spring Boot: https://spring.io/projects/spring-boot
- Documentación Docker: https://docs.docker.com
- Documentación MySQL: https://dev.mysql.com/doc
