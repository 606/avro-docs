---
glossary: true
title: Microservices
definition: "Architectural style where an application consists of small independent services"
aliases:
  - microservices
  - microservice
  - micro-services
publish: true
tags:
  - glossary
  - architecture
  - distributed
---

# Microservices

**Microservices** is an architectural style where an application is built as a set of small, independent services, each performing a single business function.

## Characteristics

- **Independence** — each service can be deployed separately
- **Decentralization** — each service has its own database
- **Technology diversity** — different services can use different technologies
- **Fault tolerance** — failure of one service doesn't stop the entire system

## Communication Patterns

### Synchronous
- REST API
- gRPC

### Asynchronous
- Message Queue (RabbitMQ, Kafka)
- Event-driven architecture

## Benefits

1. Scalability of individual components
2. Faster development cycle
3. Fault isolation
4. Technology flexibility

## Drawbacks

1. Distributed system complexity
2. Network latency
3. More complex monitoring
4. Eventual consistency
