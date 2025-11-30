---
glossary: true
title: Docker
definition: "Platform for containerizing applications"
aliases:
  - docker
  - Docker Container
  - containers
  - container
publish: true
tags:
  - glossary
  - devops
  - containers
---

# Docker

**Docker** is a platform for developing, shipping, and running applications in containers.

## Core Concepts

- **Image** — template for creating containers
- **Container** — isolated environment for running an application
- **Dockerfile** — instructions for building an image
- **Docker Compose** — tool for running multi-container applications

## Benefits

1. Dependency isolation
2. Portability across environments
3. Fast startup and shutdown
4. Efficient resource utilization

## Приклад Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Корисні команди

```bash
# Запустити контейнер
docker run -d -p 3000:3000 my-app

# Переглянути контейнери
docker ps

# Зупинити контейнер
docker stop container_id

# Видалити образ
docker rmi image_name
```
