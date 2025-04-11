# ======= STAGE 1: Build Application =======
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml .
COPY src src
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# ======= STAGE 2: Runtime Container (with Isolate Installed) =======
FROM ubuntu:latest AS runtime
WORKDIR /app

# Install required dependencies including Isolate
RUN apt-get update && apt-get install -y \
    git \
    make \
    g++ \
    gcc \
    libcap-dev \
    build-essential \
    pkg-config \
    libsystemd-dev \
    asciidoc \
    cgroup-tools \
    php-cli \
    python3 \
    openjdk-17-jdk \
    && rm -rf /var/lib/apt/lists/*  # Cleanup to reduce image size

# Install Isolate from source
RUN git clone https://github.com/ioi/isolate.git /tmp/isolate && \
    cd /tmp/isolate && \
    make && make install && \
    rm -rf /tmp/isolate  # Cleanup

COPY --from=builder /app/target/judge-0.0.1-SNAPSHOT.jar ./judge-0.0.1-SNAPSHOT.jar
COPY ./judge.sh ./judge.sh
RUN chmod +x judge.sh
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "judge-0.0.1-SNAPSHOT.jar"]
