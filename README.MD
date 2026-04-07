# unitas — composing parsers into a unified whole

<img src="doc/logo.png" style="margin-left: 16px" height="64" align="right" alt="Unitas logo">

[![npm version](https://img.shields.io/npm/v/unitas)](https://www.npmjs.com/package/unitas)
[![Coverage](https://coveralls.io/repos/github/sovrin/unitas/badge.svg?branch=master)](https://coveralls.io/github/sovrin/unitas?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, TypeScript-first parser combinator library for building expressive and composable parsers.

## Features

- **Parser Combinators**: Compose small parsers into complex ones using combinators like `many`, `choice`, `sequence`, and more
- **Terminals**: Factory functions for common patterns (`char`, `string`, `regex`, etc.)
- **Primitives**: Pre-built parser instances ready to use (`digit`, `letter`, `whitespace`, etc.)
- **TypeScript**: Full TypeScript support with generic types and inference
- **Tree-shakeable**: ESM-only with separate exports for `combinators`, `terminals`, `primitives`, and `utils`
- **No dependencies**: Zero external runtime dependencies

> **Note:** This library is in active development. The API may change before v1.0.0.

## Installation

```bash
npm install unitas
```

## Quick Start

**CSV parser** — parsing comma-separated values with quoted fields

```typescript
import { grammar, run } from 'unitas';
import { choice, inner, separatedBy } from 'unitas/combinators';
import { char, regex } from 'unitas/terminals';
import { letters } from 'unitas/primitives';

const csv = grammar({
    row: (p) => separatedBy(p.value, char(',')),
    value: (p) => choice(p.quoted, p.unquoted),
    quoted: () => inner(char('"'), regex(/^[^"]*/), char('"')),
    unquoted: () => letters,
});

run(csv.row, 'a,b,c'); // ['a', 'b', 'c']
run(csv.row, '"a,b",c'); // ['a,b', 'c']
```

**JSON value parser** — parsing simple json values

```typescript
import { grammar, run } from 'unitas';
import { choice, map, quoted } from 'unitas/combinators';
import { string } from 'unitas/terminals';
import { bool, digits, letters } from 'unitas/primitives';

const json = grammar({
    value: (p) => choice(p.string, p.number, p.bool, p.null),
    string: () => quoted(letters),
    number: () => digits,
    bool: () => bool,
    null: () => map(string('null'), () => null),
});

run(json.value, '"hello"'); // 'hello'
run(json.value, '42'); // 42
run(json.value, 'true'); // true
run(json.value, 'null'); // null
```

**Query string parser** — parsing URL query parameters

```typescript
import { grammar, run } from 'unitas';
import { map, outer, separatedBy } from 'unitas/combinators';
import { char } from 'unitas/terminals';
import { letters } from 'unitas/primitives';

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

run(query.params, 'foo=bar&baz=qux'); // { foo: 'bar', baz: 'qux' }
```

**INI file section** — parsing section headers and key-value pairs

```typescript
import { grammar, run } from 'unitas';
import { map, outer, sequence } from 'unitas/combinators';
import { char, regex } from 'unitas/terminals';
import { letters, nl } from 'unitas/primitives';
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

run(ini.section, '[database]\nhost=localhost'); // { name: 'database', entry: ['host', 'localhost'] }
```

## Table of Contents

- [Core](#core)
    - [`failure`](#failure)
    - [`grammar`](#grammar)
    - [`label`](#label)
    - [`lazy`](#lazy)
    - [`match`](#match)
    - [`memoize`](#memoize)
    - [`parser`](#parser)
    - [`run`](#run)
    - [`success`](#success)
- [Terminals](#terminals)
    - [`char`](#char)
    - [`charOf`](#charOf)
    - [`noneOf`](#noneOf)
    - [`oneOf`](#oneOf)
    - [`regex`](#regex)
    - [`satisfy`](#satisfy)
    - [`string`](#string)
    - [`stringOf`](#stringOf)
    - [`take`](#take)
    - [`takeWhile`](#takeWhile)
    - [`token`](#token)
    - [`word`](#word)
- [Primitives](#primitives)
    - [`alphaNum`](#alphaNum)
    - [`alphaNums`](#alphaNums)
    - [`anyChar`](#anyChar)
    - [`bool`](#bool)
    - [`crlf`](#crlf)
    - [`digit`](#digit)
    - [`digits`](#digits)
    - [`eof`](#eof)
    - [`eol`](#eol)
    - [`float`](#float)
    - [`hexDigit`](#hexDigit)
    - [`hexDigits`](#hexDigits)
    - [`identifier`](#identifier)
    - [`letter`](#letter)
    - [`letters`](#letters)
    - [`line`](#line)
    - [`lowercase`](#lowercase)
    - [`lowercases`](#lowercases)
    - [`nl`](#nl)
    - [`octDigit`](#octDigit)
    - [`octDigits`](#octDigits)
    - [`position`](#position)
    - [`rest`](#rest)
    - [`tab`](#tab)
    - [`uppercase`](#uppercase)
    - [`uppercases`](#uppercases)
    - [`whitespace`](#whitespace)
    - [`whitespaces`](#whitespaces)
- [Combinators](#combinators)
    - [`attempt`](#attempt)
    - [`bind`](#bind)
    - [`braced`](#braced)
    - [`bracketed`](#bracketed)
    - [`chainLeft`](#chainLeft)
    - [`chainLeft1`](#chainLeft1)
    - [`chainRight`](#chainRight)
    - [`chainRight1`](#chainRight1)
    - [`choice`](#choice)
    - [`consume`](#consume)
    - [`endBy`](#endBy)
    - [`endBy1`](#endBy1)
    - [`exactly`](#exactly)
    - [`first`](#first)
    - [`fold`](#fold)
    - [`fold1`](#fold1)
    - [`foldRight`](#foldRight)
    - [`foldRight1`](#foldRight1)
    - [`fuse`](#fuse)
    - [`guard`](#guard)
    - [`inner`](#inner)
    - [`interleaved`](#interleaved)
    - [`last`](#last)
    - [`left`](#left)
    - [`lexeme`](#lexeme)
    - [`many`](#many)
    - [`many1`](#many1)
    - [`manyAtLeast`](#manyAtLeast)
    - [`manyAtMost`](#manyAtMost)
    - [`manyBetween`](#manyBetween)
    - [`manyTill`](#manyTill)
    - [`map`](#map)
    - [`not`](#not)
    - [`nth`](#nth)
    - [`optional`](#optional)
    - [`optionalConsume`](#optionalConsume)
    - [`optionalSeparatedBy`](#optionalSeparatedBy)
    - [`outer`](#outer)
    - [`padded`](#padded)
    - [`parenthesized`](#parenthesized)
    - [`peek`](#peek)
    - [`postfix`](#postfix)
    - [`prefix`](#prefix)
    - [`quoted`](#quoted)
    - [`recover`](#recover)
    - [`right`](#right)
    - [`separatedBy`](#separatedBy)
    - [`separatedBy1`](#separatedBy1)
    - [`separatedEndBy`](#separatedEndBy)
    - [`separatedEndBy1`](#separatedEndBy1)
    - [`separatedUntil`](#separatedUntil)
    - [`sequence`](#sequence)
    - [`skip`](#skip)
    - [`skipMany`](#skipMany)
    - [`skipMany1`](#skipMany1)
    - [`surrounded`](#surrounded)
    - [`unless`](#unless)
    - [`until`](#until)
    - [`validate`](#validate)
- [Utils](#utils)
    - [`filter`](#filter)
    - [`flatten`](#flatten)
    - [`join`](#join)
    - [`pick`](#pick)
    - [`pipe`](#pipe)
    - [`pop`](#pop)
    - [`shift`](#shift)
    - [`spread`](#spread)

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

<details id="failure">
<summary><code>failure</code> — Creates a failed result with an optional error message.</summary>

```typescript
failure('unexpected input'); // { ok: false, error: 'unexpected input' }
```

</details>
<details id="grammar">
<summary><code>grammar</code> — Creates a recursive grammar where rules can reference each other.</summary>

```typescript
type Math = {
    expr: number;
    term: number;
    value: number;
};
const g = grammar<Math>({
    expr: (p) =>
        chainLeft1(
            p.term,
            map(char('+'), () => (l, r) => l + r),
        ),
    term: (p) =>
        choice(
            p.value,
            map(sequence(char('('), p.expr, char(')')), ([, v]) => v),
        ),
    value: () => digits,
});
run(g.expr, '1+2'); // 3
run(g.expr, '1+2+3'); // 6
run(g.expr, '(1+2)'); // 3
```

</details>
<details id="label">
<summary><code>label</code> — Labels a parser with a custom error message on failure.</summary>

```typescript
label(char('x'), 'letter x')(''); // { ok: false, error: 'expected letter x' }
```

</details>
<details id="lazy">
<summary><code>lazy</code> — Defers parser creation, useful for recursive grammars.</summary>

```typescript
lazy(() => char('a'))('abc'); // { ok: true, value: 'a', remaining: 'bc' }
```

</details>
<details id="match">
<summary><code>match</code> — Pattern matching on a Result to handle success and failure cases.</summary>

```typescript
match(success('hello', ''), { success: (v) => v, failure: () => 'failed' }); // 'hello'
```

</details>
<details id="memoize">
<summary><code>memoize</code> — Memoizes a parser to cache results by input string. Useful for expensive parsers and recursive grammars to avoid exponential backtracking.</summary>

```typescript
const memoDigits = memoize(digits);
memoDigits('123'); // { ok: true, value: 123, remaining: '' }
```

</details>
<details id="parser">
<summary><code>parser</code> — Creates a parser from a parser function.</summary>

```typescript
create((input) => success('parsed', input.slice(6)))('hello world'); // { ok: true, value: 'parsed', remaining: 'world' }
```

</details>
<details id="run">
<summary><code>run</code> — Runs a parser and returns the value, throws on failure or unconsumed input.</summary>

```typescript
run(string('hello'), 'hello'); // 'hello'
```

</details>
<details id="success">
<summary><code>success</code> — Creates a successful result with a value and remaining input.</summary>

```typescript
success('hello', ' world'); // { ok: true, value: 'hello', remaining: ' world' }
```

</details>

## Terminals (`unitas/terminals`)

**Terminals** are the basic building blocks that match specific parts of the input. They don't combine other parsers — they directly inspect the input string.

<details id="char">
<summary><code>char</code> — Parse a specific character.</summary>

```typescript
char('A')('ABC'); // { ok: true, value: 'A', remaining: 'BC' }
```

</details>
<details id="charOf">
<summary><code>charOf</code> — Parse any character from a set.</summary>

```typescript
charOf(['a', 'b', 'c'])('abc'); // { ok: true, value: 'a', remaining: 'bc' }
```

</details>
<details id="noneOf">
<summary><code>noneOf</code> — Parse any character not in the set.</summary>

```typescript
noneOf(['a', 'b', 'c'])('xyz'); // { ok: true, value: 'x', remaining: 'yz' }
```

</details>
<details id="oneOf">
<summary><code>oneOf</code> — Parse one string from a set of strings (longest match wins).</summary>

```typescript
oneOf(['hello', 'hell', 'help'])('helpful'); // { ok: true, value: 'help', remaining: 'ful' }
```

</details>
<details id="regex">
<summary><code>regex</code> — Parse with a regular expression.</summary>

```typescript
regex(/^\w+/)('hello world'); // { ok: true, value: 'hello', remaining: ' world' }
```

</details>
<details id="satisfy">
<summary><code>satisfy</code> — Parse a character satisfying a predicate.</summary>

```typescript
satisfy((c) => c === 'a')('abc'); // { ok: true, value: 'a', remaining: 'bc' }
```

</details>
<details id="string">
<summary><code>string</code> — Parse a specific string.</summary>

```typescript
string('hello')('hello world'); // { ok: true, value: 'hello', remaining: ' world' }
```

</details>
<details id="stringOf">
<summary><code>stringOf</code> — Parse first character that exists in string (like charOf but for a string).</summary>

```typescript
stringOf('abc')('abcdef'); // { ok: true, value: 'a', remaining: 'bcdef' }
```

</details>
<details id="take">
<summary><code>take</code> — Take n characters.</summary>

```typescript
take(3)('abcdef'); // { ok: true, value: 'abc', remaining: 'def' }
```

</details>
<details id="takeWhile">
<summary><code>takeWhile</code> — Takes characters while the predicate returns true.</summary>

```typescript
takeWhile((c) => c !== 'x')('abcx'); // { ok: true, value: 'abc', remaining: 'x' }
```

</details>
<details id="token">
<summary><code>token</code> — Parses a string as a token, skipping trailing whitespace. Unlike word, it does not enforce word boundaries - useful for parsing strings that might be followed by any character.</summary>

```typescript
token('let')('let x'); // { ok: true, value: 'let', remaining: 'x' }
token('let')('let1'); // { ok: true, value: 'let', remaining: '1' }
token('let')('let  x'); // { ok: true, value: 'let', remaining: 'x' }
```

</details>
<details id="word">
<summary><code>word</code> — Parses a specific word and ensures it is not followed by word characters. Use this when parsing keywords that should not be part of a longer identifier.</summary>

```typescript
word('let')('let x'); // { ok: true, value: 'let', remaining: 'x' }
word('let')('let1'); // { ok: false }
word('if')('if (x)'); // { ok: true, value: 'if', remaining: '(x)' }
```

</details>

## Primitives (`unitas/primitives`)

**Primitives** are pre-built parser instances ready to use. Unlike terminals which are factory functions (like `char('x')`), primitives are constants you can pass directly to combinators.

<details id="alphaNum">
<summary><code>alphaNum</code> — Parse a single alphanumeric character.</summary>

```typescript
alphaNum('a1'); // { ok: true, value: 'a', remaining: '1' }
alphaNum('1a'); // { ok: true, value: '1', remaining: 'a' }
```

</details>
<details id="alphaNums">
<summary><code>alphaNums</code> — Parse one or more alphanumeric characters.</summary>

```typescript
alphaNums('abc123'); // { ok: true, value: 'abc123', remaining: '' }
```

</details>
<details id="anyChar">
<summary><code>anyChar</code> — Parse any single character.</summary>

```typescript
anyChar('abc'); // { ok: true, value: 'a', remaining: 'bc' }
```

</details>
<details id="bool">
<summary><code>bool</code> — Parse a boolean literal.</summary>

```typescript
bool('true'); // { ok: true, value: true, remaining: '' }
bool('false'); // { ok: true, value: false, remaining: '' }
bool('trueABC'); // { ok: true, value: true, remaining: 'ABC' }
```

</details>
<details id="crlf">
<summary><code>crlf</code> — Parse CRLF line ending.</summary>

```typescript
crlf('\r\nabc'); // { ok: true, value: '\r\n', remaining: 'abc' }
```

</details>
<details id="digit">
<summary><code>digit</code> — Parse a single digit and return as number.</summary>

```typescript
digit('5abc'); // { ok: true, value: 5, remaining: 'abc' }
```

</details>
<details id="digits">
<summary><code>digits</code> — Parse one or more digits and return as number.</summary>

```typescript
digits('123abc'); // { ok: true, value: 123, remaining: 'abc' }
```

</details>
<details id="eof">
<summary><code>eof</code> — Parse end of file (succeeds only on empty input).</summary>

```typescript
eof(''); // { ok: true, value: null, remaining: '' }
```

</details>
<details id="eol">
<summary><code>eol</code> — Parse end of line (\\n, \\r\\n, or EOF).</summary>

```typescript
eol('\nabc'); // { ok: true, value: '\n', remaining: 'abc' }
```

</details>
<details id="float">
<summary><code>float</code> — Parse a floating point number.</summary>

```typescript
float('1.23'); // { ok: true, value: 1.23, remaining: '' }
float('-2.5'); // { ok: true, value: -2.5, remaining: '' }
float('1.23abc'); // { ok: true, value: 1.23, remaining: 'abc' }
```

</details>
<details id="hexDigit">
<summary><code>hexDigit</code> — Parse a single hexadecimal digit.</summary>

```typescript
hexDigit('fF9'); // { ok: true, value: 'f', remaining: 'F9' }
```

</details>
<details id="hexDigits">
<summary><code>hexDigits</code> — Parse one or more hexadecimal digits.</summary>

```typescript
hexDigits('deadbeef'); // { ok: true, value: 'deadbeef', remaining: '' }
```

</details>
<details id="identifier">
<summary><code>identifier</code> — Parse a programming identifier.</summary>

```typescript
identifier('variable_name'); // { ok: true, value: 'variable_name', remaining: '' }
```

</details>
<details id="letter">
<summary><code>letter</code> — Parse a single letter.</summary>

```typescript
letter('abc'); // { ok: true, value: 'a', remaining: 'bc' }
```

</details>
<details id="letters">
<summary><code>letters</code> — Parse one or more letters.</summary>

```typescript
letters('abc123'); // { ok: true, value: 'abc', remaining: '123' }
```

</details>
<details id="line">
<summary><code>line</code> — Parse until end of line.</summary>

```typescript
line('hello\nworld'); // { ok: true, value: 'hello', remaining: '\nworld' }
```

</details>
<details id="lowercase">
<summary><code>lowercase</code> — Parse a single lowercase letter.</summary>

```typescript
lowercase('abc'); // { ok: true, value: 'a', remaining: 'bc' }
```

</details>
<details id="lowercases">
<summary><code>lowercases</code> — Parses one or more lowercase letters.</summary>

```typescript
lowercases('abcDEF'); // { ok: true, value: 'abc', remaining: 'DEF' }
```

</details>
<details id="nl">
<summary><code>nl</code> — Parse a newline character.</summary>

```typescript
nl('\ntext'); // { ok: true, value: '\n', remaining: 'text' }
```

</details>
<details id="octDigit">
<summary><code>octDigit</code> — Parse a single octal digit.</summary>

```typescript
octDigit('7abc'); // { ok: true, value: '7', remaining: 'abc' }
```

</details>
<details id="octDigits">
<summary><code>octDigits</code> — Parse one or more octal digits.</summary>

```typescript
octDigits('0777abc'); // { ok: true, value: '0777', remaining: 'abc' }
```

</details>
<details id="position">
<summary><code>position</code> — Get current position (remaining input length).</summary>

```typescript
position('abc'); // { ok: true, value: 3, remaining: 'abc' }
```

</details>
<details id="rest">
<summary><code>rest</code> — Parse the rest of the input.</summary>

```typescript
rest('hello'); // { ok: true, value: 'hello', remaining: '' }
```

</details>
<details id="tab">
<summary><code>tab</code> — Parse tab character.</summary>

```typescript
tab('\ttext'); // { ok: true, value: '\t', remaining: 'text' }
```

</details>
<details id="uppercase">
<summary><code>uppercase</code> — Parses a single uppercase letter.</summary>

```typescript
uppercase('ABC'); // { ok: true, value: 'A', remaining: 'BC' }
```

</details>
<details id="uppercases">
<summary><code>uppercases</code> — Parses one or more uppercase letters.</summary>

```typescript
uppercases('ABCdef'); // { ok: true, value: 'ABC', remaining: 'def' }
```

</details>
<details id="whitespace">
<summary><code>whitespace</code> — Parses a single whitespace character.</summary>

```typescript
whitespace(' abc'); // { ok: true, value: ' ', remaining: 'abc' }
```

</details>
<details id="whitespaces">
<summary><code>whitespaces</code> — Parses one or more whitespace characters.</summary>

```typescript
whitespaces('  abc'); // { ok: true, value: '  ', remaining: 'abc' }
```

</details>

## Combinators (`unitas/combinators`)

**Combinators** are functions that take one or more parsers and return a new parser. They are the "glue" that lets you compose complex parsers from simple ones.

<details id="attempt">
<summary><code>attempt</code> — Attempt wraps a parser to handle backtracking on failure.</summary>

```typescript
attempt(string('hello'))('hello world'); // { ok: true, value: 'hello', remaining: ' world' }
```

</details>
<details id="bind">
<summary><code>bind</code> — Chain parsers where the second parser depends on the first result.</summary>

```typescript
bind(digits, (n) => take(n))('3abc'); // { ok: true, value: 'abc', remaining: '' }
```

</details>
<details id="braced">
<summary><code>braced</code> — Parse content surrounded by braces.</summary>

```typescript
braced(string('hi'))('{hi}'); // { ok: true, value: 'hi', remaining: '' }
```

</details>
<details id="bracketed">
<summary><code>bracketed</code> — Parse content surrounded by brackets.</summary>

```typescript
bracketed(string('hi'))('[hi]'); // { ok: true, value: 'hi', remaining: '' }
```

</details>
<details id="chainLeft">
<summary><code>chainLeft</code> — Chain left-associative operations (right-to-left for same precedence).</summary>

```typescript
chainLeft(digits, operation)('1+2+3'); // { ok: true, value: 6, remaining: '' }
chainLeft(digits, operation)('10-3+2'); // { ok: true, value: 9, remaining: '' }
```

</details>
<details id="chainLeft1">
<summary><code>chainLeft1</code> — Chain left-associative operations (fails on empty input).</summary>

```typescript
chainLeft1(digits, operation)('1+2+3'); // { ok: true, value: 6, remaining: '' }
chainLeft1(digits, operation)('8/2*3'); // { ok: true, value: 12, remaining: '' }
```

</details>
<details id="chainRight">
<summary><code>chainRight</code> — Chain right-associative operations (right-to-left grouping).</summary>

```typescript
chainRight(digits, operation)('2-1-1'); // { ok: true, value: 2, remaining: '' }
chainRight(digits, operation)('4/2/2'); // { ok: true, value: 4, remaining: '' }
```

</details>
<details id="chainRight1">
<summary><code>chainRight1</code> — Chain right-associative operations (fails on empty input).</summary>

```typescript
chainRight1(digits, operation)('2-1-1'); // { ok: true, value: 2, remaining: '' }
chainRight1(digits, operation)('4/2/2'); // { ok: true, value: 4, remaining: '' }
```

</details>
<details id="choice">
<summary><code>choice</code> — Try each parser in order, return first success.</summary>

```typescript
choice(string('hello'), string('world'))('hello'); // { ok: true, value: 'hello', remaining: '' }
```

</details>
<details id="consume">
<summary><code>consume</code> — Consume input but discard the result (return null).</summary>

```typescript
consume(string('hello'))('hello world'); // { ok: true, value: null, remaining: ' world' }
```

</details>
<details id="endBy">
<summary><code>endBy</code> — Zero or more items separated and ending with terminator.</summary>

```typescript
endBy(string('item'), char(';'))('item;item;item;'); // { ok: true, value: ['item', 'item', 'item'], remaining: '' }
```

</details>
<details id="endBy1">
<summary><code>endBy1</code> — One or more items separated and ending with terminator.</summary>

```typescript
endBy1(string('item'), char(';'))('item;item;item;'); // { ok: true, value: ['item', 'item', 'item'], remaining: '' }
```

</details>
<details id="exactly">
<summary><code>exactly</code> — Parse exactly n occurrences.</summary>

```typescript
exactly(char('a'), 3)('aaa'); // { ok: true, value: ['a', 'a', 'a'], remaining: '' }
```

</details>
<details id="first">
<summary><code>first</code> — Extract the first element from a parser result array.</summary>

```typescript
first(sequence(char('a'), digit))('a1bc'); // { ok: true, value: 'a', remaining: 'bc' }
```

</details>
<details id="fold">
<summary><code>fold</code> — Parse zero or more and fold into a single value.</summary>

```typescript
fold(digit, [], (acc, d) => [...acc, d])('123'); // { ok: true, value: [1, 2, 3], remaining: '' }
```

</details>
<details id="fold1">
<summary><code>fold1</code> — Parse one or more and fold into a single value.</summary>

```typescript
fold1(digit, 0, (acc, d) => acc + d)('123'); // { ok: true, value: 6, remaining: '' }
```

</details>
<details id="foldRight">
<summary><code>foldRight</code> — Parse zero or more and fold right-to-left.</summary>

```typescript
foldRight(digit, [], (acc, d) => [...acc, d])('123'); // { ok: true, value: [3, 2, 1], remaining: '' }
```

</details>
<details id="foldRight1">
<summary><code>foldRight1</code> — Parse one or more and fold right-to-left.</summary>

```typescript
foldRight1(digit, [], (acc, d) => [...acc, d])('123'); // { ok: true, value: [3, 2, 1], remaining: '' }
```

</details>
<details id="fuse">
<summary><code>fuse</code> — Fuse multiple string parsers into a single one. The fused parser concatenates all string results.</summary>

```typescript
fuse(char('a'), char('b'), char('c'))('abc'); // { ok: true, value: 'abc', remaining: '' }
fuse(string('hello'), char(' '), string('world'))('hello world'); // { ok: true, value: 'hello world', remaining: '' }
```

</details>
<details id="guard">
<summary><code>guard</code> — Conditionally apply parser based on a condition.</summary>

```typescript
guard(true, string('hello'))('hello'); // { ok: true, value: 'hello', remaining: '' }
guard(false, string('hello'))('hello'); // { ok: false }
```

</details>
<details id="inner">
<summary><code>inner</code> — Extract inner value from surrounded content (like inner of braced).</summary>

```typescript
inner(char('('), string('hi'), char(')'))('(hi)'); // { ok: true, value: 'hi', remaining: '' }
```

</details>
<details id="interleaved">
<summary><code>interleaved</code> — Parse items with interleaved separators.</summary>

```typescript
interleaved(char('a'), char(','))('a,a,a'); // { ok: true, value: ['a', ',', 'a', ',', 'a'], remaining: '' }
```

</details>
<details id="last">
<summary><code>last</code> — Extract the last element from a parser result array.</summary>

```typescript
last(sequence(char('a'), char('b')))('ab'); // { ok: true, value: 'b', remaining: '' }
```

</details>
<details id="left">
<summary><code>left</code> — Keep only the left result from a sequence.</summary>

```typescript
left(string('hello'), string('world'))('helloworld'); // { ok: true, value: 'hello', remaining: '' }
```

</details>
<details id="lexeme">
<summary><code>lexeme</code> — Parser that consumes trailing whitespace.</summary>

```typescript
lexeme(string('hello'))('hello   world'); // { ok: true, value: 'hello', remaining: 'world' }
```

</details>
<details id="many">
<summary><code>many</code> — Zero or more occurrences (never fails).</summary>

```typescript
many(char('a'))('aaa'); // { ok: true, value: ['a', 'a', 'a'], remaining: '' }
```

</details>
<details id="many1">
<summary><code>many1</code> — One or more occurrences (fails if no matches).</summary>

```typescript
many1(char('a'))('aaa'); // { ok: true, value: ['a', 'a', 'a'], remaining: '' }
```

</details>
<details id="manyAtLeast">
<summary><code>manyAtLeast</code> — Parse at least n occurrences.</summary>

```typescript
manyAtLeast(char('a'), 2)('aaa'); // { ok: true, value: ['a', 'a', 'a'], remaining: '' }
```

</details>
<details id="manyAtMost">
<summary><code>manyAtMost</code> — Parse at most n occurrences.</summary>

```typescript
manyAtMost(char('a'), 2)('aaa'); // { ok: true, value: ['a', 'a'], remaining: 'a' }
```

</details>
<details id="manyBetween">
<summary><code>manyBetween</code> — Parse between min and max occurrences.</summary>

```typescript
manyBetween(char('a'), 2, 3)('aaa'); // { ok: true, value: ['a', 'a', 'a'], remaining: '' }
```

</details>
<details id="manyTill">
<summary><code>manyTill</code> — Parse zero or more until terminator matches.</summary>

```typescript
manyTill(char('a'), char('b'))('aaab'); // { ok: true, value: ['a', 'a', 'a'], remaining: '' }
```

</details>
<details id="map">
<summary><code>map</code> — Transform the parsed value.</summary>

```typescript
map(string('hello'), (v) => v.toUpperCase())('hello'); // { ok: true, value: 'HELLO', remaining: '' }
```

</details>
<details id="not">
<summary><code>not</code> — Succeed if parser fails (without consuming input).</summary>

```typescript
not(string('hello'))('world'); // { ok: true, value: null, remaining: 'world' }
```

</details>
<details id="nth">
<summary><code>nth</code> — Extract the nth element from a parser result array.</summary>

```typescript
nth(sequence(char('a'), char('b'), char('c')), 1)('abc'); // { ok: true, value: 'b', remaining: '' }
```

</details>
<details id="optional">
<summary><code>optional</code> — Make parser optional (return null on failure, without consuming input).</summary>

```typescript
optional(string('hello'))('hello'); // { ok: true, value: 'hello', remaining: '' }
optional(string('hello'))('world'); // { ok: true, value: null, remaining: 'world' }
```

</details>
<details id="optionalConsume">
<summary><code>optionalConsume</code> — Optionally consume input (always succeeds, returns void).</summary>

```typescript
optionalConsume(string('hello'))('hello world'); // { ok: true, value: undefined, remaining: ' world' }
optionalConsume(string('hello'))('world'); // { ok: true, value: undefined, remaining: 'world' }
```

</details>
<details id="optionalSeparatedBy">
<summary><code>optionalSeparatedBy</code> — Zero or more items separated by a separator, with optional null values.</summary>

```typescript
optionalSeparatedBy(digits, char(','))('1,2'); // { ok: true, value: [1, 2], remaining: '' }
optionalSeparatedBy(digits, char(','))(',1'); // { ok: true, value: [null, 1], remaining: '' }
optionalSeparatedBy(digits, char(','))('1,'); // { ok: true, value: [1], remaining: '' }
```

</details>
<details id="outer">
<summary><code>outer</code> — Extract outer values from a sequence of 3 parsers (skip middle).</summary>

```typescript
outer(char('('), string('hi'), char(')'))('(hi)'); // { ok: true, value: ['(', ')'], remaining: '' }
```

</details>
<details id="padded">
<summary><code>padded</code> — Parse content with optional whitespace on both sides.</summary>

```typescript
padded(string('hi'))('   hi   '); // { ok: true, value: 'hi', remaining: '' }
```

</details>
<details id="parenthesized">
<summary><code>parenthesized</code> — Parse content surrounded by parentheses.</summary>

```typescript
parenthesized(string('hi'))('(hi)'); // { ok: true, value: 'hi', remaining: '' }
```

</details>
<details id="peek">
<summary><code>peek</code> — Parse without consuming input.</summary>

```typescript
peek(string('hello'))('hello world'); // { ok: true, value: 'hello', remaining: 'hello world' }
```

</details>
<details id="postfix">
<summary><code>postfix</code> — Parse postfix operators (chains atom with operators that return functions).</summary>

```typescript
postfix(
    char('a'),
    map(char('!'), () => (x) => x),
)('a!'); // { ok: true, value: 'a', remaining: '' }
```

</details>
<details id="prefix">
<summary><code>prefix</code> — Parse prefix operators (like - in -5).</summary>

```typescript
prefix(
    map(char('-'), () => (x) => -x),
    digit,
)('-5'); // { ok: true, value: -5, remaining: '' }
```

</details>
<details id="quoted">
<summary><code>quoted</code> — Parse content surrounded by single or double quotes.</summary>

```typescript
quoted(string('hello'))('"hello"'); // { ok: true, value: 'hello', remaining: '' }
```

</details>
<details id="recover">
<summary><code>recover</code> — Use fallback value when parser fails.</summary>

```typescript
recover(string('hello'), 'default')('world'); // { ok: true, value: 'default', remaining: 'world' }
```

</details>
<details id="right">
<summary><code>right</code> — Keep only the right result from a sequence.</summary>

```typescript
right(string('hello'), string('world'))('helloworld'); // { ok: true, value: 'world', remaining: '' }
```

</details>
<details id="separatedBy">
<summary><code>separatedBy</code> — Zero or more items separated by a separator.</summary>

```typescript
separatedBy(char('a'), char(','))('a,a,a'); // { ok: true, value: ['a', 'a', 'a'], remaining: '' }
```

</details>
<details id="separatedBy1">
<summary><code>separatedBy1</code> — One or more items separated by a separator.</summary>

```typescript
separatedBy1(char('a'), char(','))('a,a,a'); // { ok: true, value: ['a', 'a', 'a'], remaining: '' }
```

</details>
<details id="separatedEndBy">
<summary><code>separatedEndBy</code> — Zero or more items separated by and ending with a terminator.</summary>

```typescript
separatedEndBy(char('a'), char(';'))('a;a;a;'); // { ok: true, value: ['a', 'a', 'a'], remaining: '' }
```

</details>
<details id="separatedEndBy1">
<summary><code>separatedEndBy1</code> — One or more items separated by and ending with a terminator.</summary>

```typescript
separatedEndBy1(char('a'), char(';'))('a;a;a;'); // { ok: true, value: ['a', 'a', 'a'], remaining: '' }
```

</details>
<details id="separatedUntil">
<summary><code>separatedUntil</code> — Parse items separated by separator until terminator matches.</summary>

```typescript
separatedUntil(char('a'), char(','), char(';'))('a,a,a;'); // { ok: true, value: ['a', 'a', 'a'], remaining: '' }
```

</details>
<details id="sequence">
<summary><code>sequence</code> — Parse a sequence of parsers and return all results as an array.</summary>

```typescript
sequence(char('a'), char('b'), char('c'))('abc'); // { ok: true, value: ['a', 'b', 'c'], remaining: '' }
```

</details>
<details id="skip">
<summary><code>skip</code> — Skip a parser n times.</summary>

```typescript
skip(char('a'), 2)('aabc'); // { ok: true, value: null, remaining: 'bc' }
```

</details>
<details id="skipMany">
<summary><code>skipMany</code> — Skip zero or more occurrences (never fails, returns null).</summary>

```typescript
skipMany(char('a'))('aaabc'); // { ok: true, value: null, remaining: 'bc' }
```

</details>
<details id="skipMany1">
<summary><code>skipMany1</code> — Skip one or more occurrences (fails if no matches).</summary>

```typescript
skipMany1(char('a'))('aaabc'); // { ok: true, value: null, remaining: 'bc' }
```

</details>
<details id="surrounded">
<summary><code>surrounded</code> — Parse content surrounded by delimiters.</summary>

```typescript
surrounded(char('['), string('hi'), char(']'))('[hi]'); // { ok: true, value: 'hi', remaining: '' }
surrounded(char('a'), char('b'), char('c'))('abc'); // { ok: true, value: 'b', remaining: '' }
```

</details>
<details id="unless">
<summary><code>unless</code> — Parse unless condition is true (inverse of guard).</summary>

```typescript
unless(false, string('hello'))('hello'); // { ok: true, value: 'hello', remaining: '' }
unless(true, string('hello'))('hello'); // { ok: true, value: null, remaining: 'hello' }
```

</details>
<details id="until">
<summary><code>until</code> — Parse until terminator matches (fails if terminator never matches).</summary>

```typescript
until(char('a'), char('b'))('baaa'); // { ok: true, value: [], remaining: 'baaa' }
until(char('a'), char('b'))('aaba'); // { ok: true, value: ['a', 'a'], remaining: 'ba' }
```

</details>
<details id="validate">
<summary><code>validate</code> — Validate parsed value with a predicate.</summary>

```typescript
validate(digit, (n) => n > 5)('7'); // { ok: true, value: 7, remaining: '' }
validate(digit, (n) => n > 5)('3'); // { ok: false }
```

</details>

## Utils (`unitas/utils`)

**Utils** are utility functions for working with parser results, arrays, and function composition.

<details id="filter">
<summary><code>filter</code> — Exclude values from array.</summary>

```typescript
filter([1, 2, 3])([1, 2, 3, 4, 5]); // [4, 5]
filter([1, 2], true)([1, false, 3]); // [3]
```

</details>
<details id="flatten">
<summary><code>flatten</code> — Flatten nested arrays.</summary>

```typescript
flatten()([1, [2, [3]]]); // [1, 2, [3]]
flatten(2)([1, [2, [3]]]); // [1, 2, 3]
```

</details>
<details id="join">
<summary><code>join</code> — Join array elements into a string.</summary>

```typescript
join()([1, 2, 3]); // '123'
join('-')([1, 2, 3]); // '1-2-3'
```

</details>
<details id="pick">
<summary><code>pick</code> — Pick elements from an array by index.</summary>

```typescript
pick(0, 2)(['a', 'b', 'c']); // ['a', 'c']
pick(2, 4)(['a', 'b', 'c', 'd', 'e']); // ['c', 'e']
```

</details>
<details id="pipe">
<summary><code>pipe</code> — Pipe parser functions together.</summary>

```typescript
pipe(lexeme)(letters)('xyz   abc'); // { ok: true, value: 'xyz', remaining: 'abc' }
```

</details>
<details id="pop">
<summary><code>pop</code> — Get the last element of an array.</summary>

```typescript
pop()([1, 2, 3]); // 3
```

</details>
<details id="shift">
<summary><code>shift</code> — Get the first element of an array.</summary>

```typescript
shift()([1, 2, 3]); // 1
```

</details>
<details id="spread">
<summary><code>spread</code> — Collect spread arguments into an array.</summary>

```typescript
spread()(1, 2, 3); // [1, 2, 3]
```

</details>

## License

MIT
