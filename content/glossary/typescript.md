---
glossary: true
title: TypeScript
definition: "Typed superset of JavaScript from Microsoft"
aliases:
  - typescript
  - TS
  - ts
publish: true
tags:
  - glossary
  - programming
  - javascript
---

# TypeScript

**TypeScript** is a strongly typed programming language that compiles to JavaScript.

## Benefits

- Static typing
- IDE autocompletion
- Early error detection
- Better code documentation

## Basic Types

```typescript
// Примітиви
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;

// Масиви
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["a", "b"];

// Об'єкти
interface User {
  id: number;
  name: string;
  email?: string; // optional
}

// Функції
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Generics
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

## Type vs Interface

```typescript
// Interface - для об'єктів
interface Person {
  name: string;
  age: number;
}

// Type - для всього
type ID = string | number;
type Status = "pending" | "active" | "done";
```

## Utility Types

```typescript
// Partial - всі поля optional
type PartialUser = Partial<User>;

// Required - всі поля required
type RequiredUser = Required<User>;

// Pick - вибрати поля
type UserName = Pick<User, "name">;

// Omit - виключити поля
type UserWithoutId = Omit<User, "id">;
```
