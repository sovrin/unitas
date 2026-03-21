# unitas — composing parsers into a unified whole

<img src="doc/logo.png" width="60" height="64" align="right" alt="Unitas logo">

A lightweight, TypeScript-first parser combinator library for building expressive and composable parsers.

## Features

- **Parser Combinators**: Compose small parsers into complex ones using combinators like `many`, `choice`, `sequence`, and more
- **Terminals**: Ready-to-use parsers for common patterns (`char`, `string`, `regex`, `digit`, `letter`, etc.)
- **TypeScript**: Full TypeScript support with generic types and inference
- **Tree-shakeable**: ESM-only with separate exports for `combinators`, `terminals`, and `utils`
- **No dependencies**: Zero external runtime dependencies

## Installation

```bash
npm install unitas
```

## Core Concepts

### The Parser Type

A `Parser<T>` is a function that takes an input string and returns a `Result<T>`. The generic `T` represents the type of value the parser produces.

```typescript
type Parser<T> = (input: string) => Result<T>;
```

### The Result Type

Every parser returns a `Result<T>` which is either:

- **Success** — The parser matched and produced a value
- **Failure** — The parser did not match

```typescript
type Success<T> = { ok: true; value: T; remaining: string };
type Failure = { ok: false; error?: string };
type Result<T> = Success<T> | Failure;
```

The `remaining` string is crucial — it represents what input is left after the parser has done its work. This is how we "consume" input and chain parsers together.

### Creating a Parser

Use `create` to wrap a parsing function:

```typescript
import { create, success, failure } from 'unitas';

const parser = create<string>((input) => {
    if (input.startsWith('hello')) {
        return success('hello', input.slice(5));
    }
    return failure('expected "hello"');
});
```

### Understanding the Monadic Nature

Parsers are monadic, which means they follow certain laws that make them composable:

1. **Left identity**: `create(success(a, input))` behaves like `a`
2. **Right identity**: `parser` composed with `success` returns equivalent result
3. **Associativity**: Composition order doesn't affect final result

The practical implication is that you can chain and combine parsers predictably.

### Success Results

When a parser successfully matches, it returns:

```typescript
{ ok: true, value: 'hello', remaining: ' world' }
       │           │                   │
       │           │                   └── What's left to parse
       │           └── The parsed value
       └── Always true for success
```

### Failure Results

When a parser fails, it returns:

```typescript
{ ok: false }                      // Generic failure
{ ok: false, error: 'expected a' } // Failure with message
```

The `error` field is optional — you can always add meaningful error messages later using `label`.

## Utils (`unitas/utils`)

Utility functions and helpers.

## Terminals (`unitas/terminals`)

Low-level, atomic parsers that consume input. Available terminals include `char`, `string`, `regex`, `digit`, `letter`, `whitespace`, and more.

## Combinators (`unitas/combinators`)

Functions that combine or transform parsers. Available combinators include `many`, `choice`, `sequence`, `chainLeft`, `surrounded`, `separatedBy`, and more.

## License

MIT
