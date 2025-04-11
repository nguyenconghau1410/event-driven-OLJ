# ======= STAGE 1: Build Application =======
FROM maven:3.9.4-eclipse-temurin-17-alpine AS builder
WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -Dmaven.repo.local=/tmp/.m2

COPY src src
RUN mvn clean package -DskipTests --no-transfer-progress -Dmaven.repo.local=/tmp/.m2

# ======= STAGE 2: Runtime =======
FROM eclipse-temurin:17-jdk-alpine AS runtime
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
