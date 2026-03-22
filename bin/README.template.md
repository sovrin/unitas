# unitas — composing parsers into a unified whole

<img src="doc/logo.png" width="60" height="64" align="right" alt="Unitas logo">

[![npm version](https://img.shields.io/npm/v/unitas)](https://www.npmjs.com/package/unitas)
[![Coverage](https://coveralls.io/repos/github/sovrin/unitas/badge.svg?branch=master)](https://coveralls.io/github/sovrin/unitas?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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

## Quick Start

**CSV parser** — parsing comma-separated values with quoted fields

```typescript
import { grammar, run } from 'unitas';
import { choice, inner, separatedBy } from 'unitas/combinators';
import { char, letters, regex } from 'unitas/terminals';

const csv = grammar({
    row: (p) => separatedBy(p.value, char(',')),
    value: (p) => choice(p.quoted, p.unquoted),
    quoted: () => inner(char('"'), regex(/^[^"]*/), char('"')),
    unquoted: () => letters,
});

run(csv.row, 'a,b,c');         // ['a', 'b', 'c']
run(csv.row, '"a,b",c');       // ['a,b', 'c']
```

**JSON value parser** — parsing simple json values

```typescript
import { grammar, run } from 'unitas';
import { choice, map, quoted } from 'unitas/combinators';
import { bool, digits, letters, literal } from 'unitas/terminals';

const json = grammar({
    value: (p) => choice(p.string, p.number, p.bool, p.null),
    string: () => quoted(letters),
    number: () => digits,
    bool: () => bool,
    null: () => map(literal('null'), () => null),
});

run(json.value, '"hello"');     // 'hello'
run(json.value, '42');          // 42
run(json.value, 'true');        // true
run(json.value, 'null');        // null
```

**Query string parser** — parsing URL query parameters

```typescript
import { grammar, run } from 'unitas';
import { map, outer, separatedBy } from 'unitas/combinators';
import { char, letters } from 'unitas/terminals';

type Query = {
    params: Record<string, string>;
    param: [string, string];
    key: string;
    value: string;
};

const query = grammar<Query>({
    params: (p) =>
        map(separatedBy(p.param, char('&')), (pairs) =>
            Object.fromEntries(pairs),
        ),
    param: (p) => outer(p.key, char('='), p.value),
    key: () => letters,
    value: () => letters,
});

run(query.params, 'foo=bar&baz=qux');   // { foo: 'bar', baz: 'qux' }
```

**INI file section** — parsing section headers and key-value pairs

```typescript
import { grammar, run } from 'unitas';
import { map, outer, sequence } from 'unitas/combinators';
import { char, letters, nl, regex } from 'unitas/terminals';
import { pick } from 'unitas/utils';

const ini = grammar({
    section: (p) =>
        map(
            sequence(char('['), p.name, char(']'), nl, p.entry),
            pick(1, 4),
            ([name, entry]) => ({ name, entry }),
        ),
    name: () => letters,
    entry: (p) => outer(p.key, char('='), p.value),
    key: () => letters,
    value: () => regex(/^[^\n]+/),
});

run(ini.section, '[database]\nhost=localhost');     // { name: 'database', entry: ['host', 'localhost'] }
```

## Table of Contents

<$toc>

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

## Core (`unitas`)
**Core** provides the fundamental types and functions for building parsers.

<$core>

## Terminals (`unitas/terminals`)
**Terminals** are the basic building blocks that match specific parts of the input. They don't combine other parsers — they directly inspect the input string.

<$terminals>

## Combinators (`unitas/combinators`)
**Combinators** are functions that take one or more parsers and return a new parser. They are the "glue" that lets you compose complex parsers from simple ones.

<$combinators>

## Utils (`unitas/utils`)
**Utils** are utility functions for working with parser results, arrays, and function composition.

<$utils>

## License

MIT
