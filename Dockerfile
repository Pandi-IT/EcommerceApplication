# Multi-stage Docker build for Render deployment
FROM maven:3.9-eclipse-temurin-21 AS build

# Set working directory
WORKDIR /app

# Copy Maven files for dependency caching
COPY EcommerceApplication/pom.xml ./
COPY EcommerceApplication/.mvn/ .mvn/
COPY EcommerceApplication/mvnw ./

# Download dependencies (cached if pom.xml unchanged)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY EcommerceApplication/src ./src/

# Build the application
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

# Set working directory
WORKDIR /app

# Copy the JAR file from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port (Render will set PORT environment variable)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/products || exit 1

# Start the application
CMD ["java", "-Dserver.port=8080", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
