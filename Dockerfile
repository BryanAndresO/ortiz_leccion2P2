# Build stage
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copiar pom.xml y descargar dependencias
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiar código fuente
COPY src ./src

# Compilar y empaquetar
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar JAR del build anterior
COPY --from=builder /app/target/ortiz_leccion2-*.jar app.jar

# Variables de entorno
ENV SPRING_PROFILES_ACTIVE=docker \
    JAVA_OPTS="-Xmx256m -Xms128m"

# Exponer puerto (el puerto interno es 8080 para todos los servicios)
EXPOSE 8080

# Comando para ejecutar la aplicacion
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
