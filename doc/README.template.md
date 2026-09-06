<!-- Generated from doc/README.template.md by `npm run generate:readme`. Edit the template, not this file. -->

# unitas

<img src="https://raw.githubusercontent.com/sovrin/unitas/master/doc/logo.png" height="64" align="right" alt="">

**Composing parsers into a unified whole.** A lightweight, TypeScript-first parser combinator library — write small parsers, combine them into big ones, get typed results back.

[![npm version](https://img.shields.io/npm/v/unitas)](https://www.npmjs.com/package/unitas)
[![Coverage](https://coveralls.io/repos/github/sovrin/unitas/badge.svg?branch=master)](https://coveralls.io/github/sovrin/unitas?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

```bash
npm install unitas
```

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

- **Zero dependencies**, ESM-only, fully typed
- **Tree-shakeable** — five entry points, import only what you touch
- **<$total> composable exports** — grouped by what they do, indexed below
- **Mutual recursion out of the box** via `grammar`, no forward declarations

> **Note:** This library is in active development. The API may change before v1.0.0.

## Contents

- [Entry points](#entry-points)
- [Which function do I need?](#which-function-do-i-need)
- [Core concepts](#core-concepts)
- [More examples](#more-examples)
- [API index](#api-index)

## Entry points

Nothing is re-exported across entry points, so your bundler only ever sees what you import.

| Import from            | Contains                                                              |
| ---------------------- | --------------------------------------------------------------------- |
| `unitas`               | Types, `success`/`failure`, `run`, `grammar`, `lazy`, `memoize`        |
| `unitas/terminals`     | Factories that match input directly — `char`, `string`, `regex`, …    |
| `unitas/primitives`    | Ready-made parsers — `digit`, `letters`, `whitespace`, …              |
| `unitas/combinators`   | Parsers that take parsers — `map`, `choice`, `sequence`, `many`, …    |
| `unitas/utils`         | Helpers for `map` callbacks — `pick`, `join`, `pipe`, …               |

## Which function do I need?

The library is broad on purpose: each function does one small thing, so grammars read like the format they parse. This table is the fastest way in — start from the intent, then look the name up in the [API index](#api-index).

### Matching a single thing

| I want to match…                            | Reach for                                            |
| ------------------------------------------- | ---------------------------------------------------- |
| an exact character or string                | `char`, `string`                                     |
| one of several strings (longest wins)       | `oneOf`                                              |
| any character in / not in a set             | `charOf`, `stringOf`, `noneOf`                       |
| a character passing a predicate             | `satisfy`                                            |
| a regular expression                        | `regex`                                              |
| a fixed number of characters, or a run      | `take`, `takeWhile`                                  |
| a keyword not glued to more word characters | `word`                                               |
| a token, eating trailing whitespace         | `token`, `lexeme`                                    |
| a value — no need to build it               | `number`, `integer`, `float`, `bool`, `identifier`, `literal`, `line`, `rest` |
| a character class                           | `letter`, `digit`, `alphaNum`, `hexDigit`, `octDigit`, `lowercase`, `uppercase`, `anyChar` |
| whitespace or a line break                  | `whitespace`, `space`, `tab`, `nl`, `crlf`, `eol`, `eof`   |

Most primitives come in a singular and a plural form: `letter` matches one, `letters` matches a run of them. The same holds for `digit`/`digits`, `alphaNum`/`alphaNums`, `hexDigit`/`hexDigits`, `octDigit`/`octDigits`, `lowercase`/`lowercases`, `uppercase`/`uppercases`, `space`/`spaces` and `whitespace`/`whitespaces`. Need to know how much input is left? `position`.

### Repeating

| I want to…                                   | Reach for                                            |
| -------------------------------------------- | ---------------------------------------------------- |
| repeat zero or more / one or more times      | `many`, `many1`                                      |
| repeat a bounded number of times             | `exactly`, `manyAtLeast`, `manyAtMost`, `manyBetween` |
| repeat with a separator between items        | `separatedBy`, `separatedBy1`, `optionalSeparatedBy` |
| …and allow a trailing separator              | `separatedEndBy`, `separatedEndBy1`                  |
| …where every item ends with the separator    | `endBy`, `endBy1`, `interleaved`                     |
| repeat until something else shows up         | `manyTill`, `until`, `separatedUntil`                |
| repeat but throw the values away             | `skip`, `skipMany`, `skipMany1`                      |
| reduce the repetitions as I go               | `fold`, `fold1`, `foldRight`, `foldRight1`           |

### Choosing and branching

| I want to…                                   | Reach for                                            |
| -------------------------------------------- | ---------------------------------------------------- |
| take the first alternative that matches      | `choice`                                             |
| succeed either way                           | `optional`, `optionalConsume`, `recover`, `flag`     |
| succeed only when something *doesn't* match  | `not`                                                |
| gate on a boolean I already have             | `guard`, `unless`, `when`                            |
| look ahead without consuming input           | `peek`                                               |
| undo input consumption on failure            | `attempt`                                            |

### Sequencing and pulling values out

| I want to…                                   | Reach for                                            |
| -------------------------------------------- | ---------------------------------------------------- |
| run parsers in order and keep every result   | `sequence`                                           |
| keep only one side of a pair                 | `left`, `right`                                      |
| keep specific positions of a sequence        | `first`, `last`, `nth`, `pick`                       |
| drop the delimiters, keep the middle         | `inner`, `outer`                                     |
| glue string results together                 | `concat`, `fuse`, `join`                             |
| match content inside delimiters              | `surrounded`, `parenthesized`, `braced`, `bracketed`, `quoted`, `padded` |

### Shaping the result

| I want to…                                   | Reach for                                            |
| -------------------------------------------- | ---------------------------------------------------- |
| transform the parsed value                   | `map`, `pipe`                                        |
| replace it with a constant                   | `value`, `pure`, `consume`                           |
| build a typed AST node                       | `node`                                               |
| reject a value after parsing it              | `validate`                                           |
| choose the next parser from the last value   | `bind`                                               |
| tidy up arrays inside a `map`                | `pick`, `filter`, `flatten`, `shift`, `pop`, `spread` |

### Grammars, recursion and errors

| I want to…                                   | Reach for                                            |
| -------------------------------------------- | ---------------------------------------------------- |
| let rules reference each other by name       | `grammar`                                            |
| refer to a parser defined further down       | `lazy`                                               |
| cache results and avoid exponential blowup   | `memoize`                                            |
| attach a readable error message              | `label`                                              |
| parse infix operators with precedence        | `chainLeft`, `chainLeft1`, `chainRight`, `chainRight1` |
| parse prefix / postfix operators             | `prefix`, `postfix`                                  |
| handle both outcomes of a `Result`           | `match`                                              |

## Core concepts

### The `Parser` type

A `Parser<T>` is a function from an input string to a `Result<T>`. That is the whole abstraction — everything else in this library either produces one or wraps one.

```typescript
type Parser<T> = (input: string) => Result<T>;
```

### The `Result` type

```typescript
type Success<T> = { ok: true; value: T; remaining: string };
type Failure = { ok: false; error?: string };
type Result<T> = Success<T> | Failure;
```

```typescript
{ ok: true, value: 'hello', remaining: ' world' }
       │           │                   │
       │           │                   └── what is left to parse
       │           └── the parsed value
       └── always true for success
```

`remaining` is the important part: it is how input gets consumed and how parsers chain. A failure carries an optional message, which you can always supply later with `label`.

```typescript
{ ok: false }                      // generic failure
{ ok: false, error: 'expected a' } // failure with a message
```

### Writing one by hand

Most of the time you compose existing pieces, but nothing stops you from dropping down a level:

```typescript
import { create, success, failure } from 'unitas';

const parser = create<string>((input) => {
    if (input.startsWith('hello')) {
        return success('hello', input.slice(5));
    }

    return failure('expected "hello"');
});
```

### Grammars

`grammar` hands every rule a proxy `p`, so rules can reference each other — including themselves — without forward declarations or `lazy` boilerplate.

```typescript
import { grammar, run } from 'unitas';
import { chainLeft1, choice, map, sequence } from 'unitas/combinators';
import { char } from 'unitas/terminals';
import { digits } from 'unitas/primitives';

type Math = { expr: number; term: number; value: number };

const g = grammar<Math>({
    expr: (p) =>
        chainLeft1(
            p.term,
            map(char('+'), () => (l: number, r: number) => l + r),
        ),
    term: (p) =>
        choice(
            p.value,
            map(sequence(char('('), p.expr, char(')')), ([, v]) => v),
        ),
    value: () => digits,
});

run(g.expr, '1+2+3'); // 6
run(g.expr, '(1+2)'); // 3
```

## More examples

**JSON value** — a tagged union of scalars

```typescript
import { grammar, run } from 'unitas';
import { choice, quoted, value } from 'unitas/combinators';
import { string } from 'unitas/terminals';
import { bool, digits, letters } from 'unitas/primitives';

const json = grammar({
    value: (p) => choice(p.string, p.number, p.bool, p.null),
    string: () => quoted(letters),
    number: () => digits,
    bool: () => bool,
    null: () => value(string('null'), null),
});

run(json.value, '"hello"'); // 'hello'
run(json.value, '42'); // 42
run(json.value, 'true'); // true
run(json.value, 'null'); // null
```

**Query string** — separated pairs folded into an object

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

**INI section** — a header plus an entry, with the punctuation dropped

```typescript
import { grammar, run } from 'unitas';
import { bracketed, map, outer, sequence } from 'unitas/combinators';
import { char, regex } from 'unitas/terminals';
import { letters, nl } from 'unitas/primitives';
import { pick } from 'unitas/utils';

const ini = grammar({
    section: (p) =>
        map(
            sequence(bracketed(p.name), nl, p.entry),
            pick(0, 2),
            ([name, entry]) => ({ name, entry }),
        ),
    name: () => letters,
    entry: (p) => outer(p.key, char('='), p.value),
    key: () => letters,
    value: () => regex(/^[^\n]+/),
});

run(ini.section, '[database]\nhost=localhost'); // { name: 'database', entry: ['host', 'localhost'] }
```

## API index

One line per export. Every name links to its full description and runnable example in the reference pages under [`doc/api`](https://github.com/sovrin/unitas/tree/master/doc/api).

<$index>

## Contributing

```bash
npm test                  # run the suite
npm run build             # compile to dist/
npm run generate:index    # regenerate barrel files after adding a source file
npm run generate:readme   # regenerate README.md and doc/api/ from JSDoc
```

Every export lives in its own file with a co-located test and a JSDoc `@example`. Those examples are the single source of truth: they are extracted into `test/examples.test.ts` and into the documentation, so they cannot drift.

## License

MIT © [Oleg Kamlowski](https://github.com/sovrin)
