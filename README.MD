# unitas — composing parsers into a unified whole

##
the spiritual successor to [onia](https://github.com/sovrin/onia)

<p align="center">
    <a href="https://github.com/sovrin/unitas" target="_blank"><img src="./doc/logo.png" width="60" alt="unitas Logo"/></a>
</p>

`unitas` is a simple, type-safe monadic parser combinator library for TypeScript. It allows you to build complex parsers by composing smaller, reusable components.

### Core Concepts

A `Parser<T>` is a function that takes an input string and returns a `Result<T>`.
A `Result<T>` is either:
-   `Success<T>`: A tuple containing the parsed value and the remaining input.
-   `Failure`: `null`, indicating the parser did not match.

```typescript
type Parser<T> = (input: string) => [T, string] | null;
```

### Terminals

Terminals are the basic building blocks that match specific parts of the input.

#### `char(c)`
Matches a single character.
```typescript
import { char } from 'unitas/terminals';

const a = char('a');
a('abc'); // ['a', 'bc']
a('bbc'); // null
```

#### `literal(str)`
Matches an exact string.
```typescript
import { literal } from 'unitas/terminals';

const hello = literal('hello');
hello('hello world'); // ['hello', ' world']
```

#### `regex(re)`
Matches a regular expression at the start of the input.
```typescript
import { regex } from 'unitas/terminals';

const digits = regex(/\d+/);
digits('123abc'); // ['123', 'abc']
```

### Combinators

Combinators take one or more parsers and return a new parser.

#### `sequence(...parsers)`
Runs multiple parsers in order and returns an array of their results.
```typescript
import { sequence } from 'unitas/combinators';
import { char } from 'unitas/terminals';

const ab = sequence(char('a'), char('b'));
ab('abc'); // [['a', 'b'], 'c']
```

#### `choice(...parsers)`
Tries each parser in order and returns the result of the first one that succeeds.
```typescript
import { choice } from 'unitas/combinators';
import { char } from 'unitas/terminals';

const ab = choice(char('a'), char('b'));
ab('a'); // ['a', '']
ab('b'); // ['b', '']
```

#### `many(parser)`
Matches zero or more occurrences of the given parser.
```typescript
import { many } from 'unitas/combinators';
import { char } from 'unitas/terminals';

const as = many(char('a'));
as('aaab'); // [['a', 'a', 'a'], 'b']
as('bbb');  // [[], 'bbb']
```

#### `surrounded(left, content, right?)`
Matches content surrounded by other parsers (e.g., brackets).
```typescript
import { surrounded } from 'unitas/combinators';
import { char } from 'unitas/terminals';

const inBrackets = surrounded(char('['), many(char('a')), char(']'));
inBrackets('[aaa]'); // [['a', 'a', 'a'], '']
```

#### `map(parser, ...transforms)`
Applies transformations to the result of a parser.
```typescript
import { map } from 'unitas/combinators';
import { regex } from 'unitas/terminals';

const num = map(regex(/\d+/), (s) => parseInt(s, 10));
num('123'); // [123, '']
```

### Grammars

Use `grammar` to define complex, recursive parsers.

```typescript
import { grammar } from 'unitas';
import { choice, sequence, map, surrounded } from 'unitas/combinators';
import { char, regex } from 'unitas/terminals';

const { expr } = grammar({
    expr: (p) => choice(p.term, p.add),
    add: (p) => map(
        sequence(p.term, char('+'), p.expr),
        ([left, , right]) => (left as number) + (right as number)
    ),
    term: (p) => choice(
        p.number,
        surrounded(char('('), p.expr, char(')'))
    ),
    number: () => map(regex(/\d+/), (d) => parseInt(d, 10))
});

expr('1+(2+3)'); // [6, '']
```
