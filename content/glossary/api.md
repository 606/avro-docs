---
glossary: true
title: API
definition: "Application Programming Interface - a set of rules for software interaction"
aliases:
  - api
  - APIs
  - REST API
publish: true
tags:
  - glossary
  - api
  - development
---

# API

**API** (Application Programming Interface) is a set of rules and protocols that allow different programs to interact with each other.

## Types of APIs

### REST API
Architectural style for building web services based on HTTP methods.

### GraphQL
Query language for APIs that allows clients to request only the data they need.

### gRPC
High-performance RPC framework from Google.

## HTTP Methods

| Method | Description |
|--------|-------------|
| GET | Retrieve data |
| POST | Create resource |
| PUT | Update resource completely |
| PATCH | Partial update |
| DELETE | Remove resource |

## Приклад REST API

```typescript
// GET /users/:id
app.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// POST /users
app.post('/users', async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});
```
