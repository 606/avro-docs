---
glossary: true
title: .NET
definition: "Cross-platform framework from Microsoft for building applications"
aliases:
  - .NET
  - dotnet
  - .net
  - DotNet
publish: true
tags:
  - glossary
  - programming
  - microsoft
---

# .NET

**.NET** is a free, cross-platform framework from Microsoft for building various types of applications.

## Versions

- **.NET Framework** — Windows only (legacy)
- **.NET Core** — cross-platform (1.0 - 3.1)
- **.NET 5+** — unified platform

## Application Types

- **ASP.NET Core** — web applications and APIs
- **Blazor** — SPA with C#
- **MAUI** — mobile and desktop
- **Console** — CLI tools
- **Worker Services** — background services

## Приклад ASP.NET Core API

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.MapControllers();

app.Run();
```

## Minimal API

```csharp
var app = WebApplication.Create();

app.MapGet("/", () => "Hello World!");

app.MapGet("/users/{id}", (int id) => 
    new User { Id = id, Name = "John" });

app.MapPost("/users", (User user) => 
    Results.Created($"/users/{user.Id}", user));

app.Run();
```

## CLI команди

```bash
# Новий проект
dotnet new webapi -n MyApi

# Запуск
dotnet run

# Білд
dotnet build

# Публікація
dotnet publish -c Release
```
