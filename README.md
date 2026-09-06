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
- **126 composable exports** — grouped by what they do, indexed below
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

| Import from          | Contains                                                           |
| -------------------- | ------------------------------------------------------------------ |
| `unitas`             | Types, `success`/`failure`, `run`, `grammar`, `lazy`, `memoize`    |
| `unitas/terminals`   | Factories that match input directly — `char`, `string`, `regex`, … |
| `unitas/primitives`  | Ready-made parsers — `digit`, `letters`, `whitespace`, …           |
| `unitas/combinators` | Parsers that take parsers — `map`, `choice`, `sequence`, `many`, … |
| `unitas/utils`       | Helpers for `map` callbacks — `pick`, `join`, `pipe`, …            |

## Which function do I need?

The library is broad on purpose: each function does one small thing, so grammars read like the format they parse. This table is the fastest way in — start from the intent, then look the name up in the [API index](#api-index).

### Matching a single thing

| I want to match…                            | Reach for                                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------------------------ |
| an exact character or string                | `char`, `string`                                                                           |
| one of several strings (longest wins)       | `oneOf`                                                                                    |
| any character in / not in a set             | `charOf`, `stringOf`, `noneOf`                                                             |
| a character passing a predicate             | `satisfy`                                                                                  |
| a regular expression                        | `regex`                                                                                    |
| a fixed number of characters, or a run      | `take`, `takeWhile`                                                                        |
| a keyword not glued to more word characters | `word`                                                                                     |
| a token, eating trailing whitespace         | `token`, `lexeme`                                                                          |
| a value — no need to build it               | `number`, `integer`, `float`, `bool`, `identifier`, `literal`, `line`, `rest`              |
| a character class                           | `letter`, `digit`, `alphaNum`, `hexDigit`, `octDigit`, `lowercase`, `uppercase`, `anyChar` |
| whitespace or a line break                  | `whitespace`, `space`, `tab`, `nl`, `crlf`, `eol`, `eof`                                   |

Most primitives come in a singular and a plural form: `letter` matches one, `letters` matches a run of them. The same holds for `digit`/`digits`, `alphaNum`/`alphaNums`, `hexDigit`/`hexDigits`, `octDigit`/`octDigits`, `lowercase`/`lowercases`, `uppercase`/`uppercases`, `space`/`spaces` and `whitespace`/`whitespaces`. Need to know how much input is left? `position`.

### Repeating

| I want to…                                | Reach for                                             |
| ----------------------------------------- | ----------------------------------------------------- |
| repeat zero or more / one or more times   | `many`, `many1`                                       |
| repeat a bounded number of times          | `exactly`, `manyAtLeast`, `manyAtMost`, `manyBetween` |
| repeat with a separator between items     | `separatedBy`, `separatedBy1`, `optionalSeparatedBy`  |
| …and allow a trailing separator           | `separatedEndBy`, `separatedEndBy1`                   |
| …where every item ends with the separator | `endBy`, `endBy1`, `interleaved`                      |
| repeat until something else shows up      | `manyTill`, `until`, `separatedUntil`                 |
| repeat but throw the values away          | `skip`, `skipMany`, `skipMany1`                       |
| reduce the repetitions as I go            | `fold`, `fold1`, `foldRight`, `foldRight1`            |

### Choosing and branching

| I want to…                                  | Reach for                                        |
| ------------------------------------------- | ------------------------------------------------ |
| take the first alternative that matches     | `choice`                                         |
| succeed either way                          | `optional`, `optionalConsume`, `recover`, `flag` |
| succeed only when something _doesn't_ match | `not`                                            |
| gate on a boolean I already have            | `guard`, `unless`, `when`                        |
| look ahead without consuming input          | `peek`                                           |

### Sequencing and pulling values out

| I want to…                                 | Reach for                                                                |
| ------------------------------------------ | ------------------------------------------------------------------------ |
| run parsers in order and keep every result | `sequence`                                                               |
| keep only one side of a pair               | `left`, `right`                                                          |
| keep specific positions of a sequence      | `first`, `last`, `nth`, `pick`                                           |
| drop the delimiters, keep the middle       | `inner`, `outer`                                                         |
| glue string results together               | `concat`, `fuse`, `join`                                                 |
| match content inside delimiters            | `surrounded`, `parenthesized`, `braced`, `bracketed`, `quoted`, `padded` |

### Shaping the result

| I want to…                                 | Reach for                                             |
| ------------------------------------------ | ----------------------------------------------------- |
| transform the parsed value                 | `map`, `pipe`                                         |
| replace it with a constant                 | `value`, `pure`, `consume`                            |
| build a typed AST node                     | `node`                                                |
| reject a value after parsing it            | `validate`                                            |
| choose the next parser from the last value | `bind`                                                |
| tidy up arrays inside a `map`              | `pick`, `filter`, `flatten`, `shift`, `pop`, `spread` |

### Grammars, recursion and errors

| I want to…                                 | Reach for                                              |
| ------------------------------------------ | ------------------------------------------------------ |
| let rules reference each other by name     | `grammar`                                              |
| refer to a parser defined further down     | `lazy`                                                 |
| cache results and avoid exponential blowup | `memoize`                                              |
| attach a readable error message            | `label`                                                |
| parse infix operators with precedence      | `chainLeft`, `chainLeft1`, `chainRight`, `chainRight1` |
| parse prefix / postfix operators           | `prefix`, `postfix`                                    |
| handle both outcomes of a `Result`         | `match`                                                |

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

### Backtracking is free

Note what a `Failure` does _not_ carry: a position. There is nowhere to record how much input a failed parser got through, and combinators hand every alternative the same string they started with, so a branch that fails can never leave the cursor moved. `choice(a, b)` always offers `b` the full input, however far `a` got.

If you are coming from Parsec, this is why there is no `try`/`attempt` here — backtracking is unconditional, so there is nothing to opt into.

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

### Core — `unitas`

Types, constructors and the grammar runner. **9** exports — [full reference →][api-core]

|                           |                                                                             |
| ------------------------- | --------------------------------------------------------------------------- |
| [`failure`][core-failure] | Creates a failed result with an optional error message.                     |
| [`grammar`][core-grammar] | Creates a recursive grammar where rules can reference each other.           |
| [`label`][core-label]     | Labels a parser with a custom error message on failure.                     |
| [`lazy`][core-lazy]       | Defers parser creation, useful for recursive grammars.                      |
| [`match`][core-match]     | Pattern matching on a Result to handle success and failure cases.           |
| [`memoize`][core-memoize] | Memoizes a parser to cache results by input string.                         |
| [`parser`][core-parser]   | Creates a parser from a parser function.                                    |
| [`run`][core-run]         | Runs a parser and returns the value, throws on failure or unconsumed input. |
| [`success`][core-success] | Creates a successful result with a value and remaining input.               |

### Terminals — `unitas/terminals`

Factories that match the input string directly. **12** exports — [full reference →][api-terminals]

|                                    |                                                                             |
| ---------------------------------- | --------------------------------------------------------------------------- |
| [`char`][terminals-char]           | Parse a specific character.                                                 |
| [`charOf`][terminals-charof]       | Parse any character from a set.                                             |
| [`noneOf`][terminals-noneof]       | Parse any character not in the set.                                         |
| [`oneOf`][terminals-oneof]         | Parse one string from a set of strings (longest match wins).                |
| [`regex`][terminals-regex]         | Parse with a regular expression.                                            |
| [`satisfy`][terminals-satisfy]     | Parse a character satisfying a predicate.                                   |
| [`string`][terminals-string]       | Parse a specific string.                                                    |
| [`stringOf`][terminals-stringof]   | Parse first character that exists in string (like charOf but for a string). |
| [`take`][terminals-take]           | Take n characters.                                                          |
| [`takeWhile`][terminals-takewhile] | Takes characters while the predicate returns true.                          |
| [`token`][terminals-token]         | Parses a string as a token, skipping trailing whitespace.                   |
| [`word`][terminals-word]           | Parses a specific word and ensures it is not followed by word characters.   |

### Primitives — `unitas/primitives`

Ready-made parsers for the usual suspects. **33** exports — [full reference →][api-primitives]

|                                         |                                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------------------ |
| [`alphaNum`][primitives-alphanum]       | Parse a single alphanumeric character.                                               |
| [`alphaNums`][primitives-alphanums]     | Parse one or more alphanumeric characters.                                           |
| [`anyChar`][primitives-anychar]         | Parse any single character.                                                          |
| [`bool`][primitives-bool]               | Parse a boolean literal.                                                             |
| [`crlf`][primitives-crlf]               | Parse CRLF line ending.                                                              |
| [`digit`][primitives-digit]             | Parse a single digit and return as number.                                           |
| [`digits`][primitives-digits]           | Parse one or more digits and return as number.                                       |
| [`eof`][primitives-eof]                 | Parse end of file (succeeds only on empty input).                                    |
| [`eol`][primitives-eol]                 | Parse end of line (\\n, \\r\\n, or EOF).                                             |
| [`float`][primitives-float]             | Parse a floating point number.                                                       |
| [`hexDigit`][primitives-hexdigit]       | Parse a single hexadecimal digit.                                                    |
| [`hexDigits`][primitives-hexdigits]     | Parse one or more hexadecimal digits.                                                |
| [`identifier`][primitives-identifier]   | Parse an identifier — starts with letter or underscore, no leading digit, no hyphen. |
| [`integer`][primitives-integer]         | Parse a signed integer.                                                              |
| [`letter`][primitives-letter]           | Parse a single letter.                                                               |
| [`letters`][primitives-letters]         | Parse one or more letters.                                                           |
| [`line`][primitives-line]               | Parse until end of line.                                                             |
| [`literal`][primitives-literal]         | Parse a word-like value including hyphens.                                           |
| [`lowercase`][primitives-lowercase]     | Parse a single lowercase letter.                                                     |
| [`lowercases`][primitives-lowercases]   | Parses one or more lowercase letters.                                                |
| [`nl`][primitives-nl]                   | Parse a newline character.                                                           |
| [`number`][primitives-number]           | Parse an integer or float.                                                           |
| [`octDigit`][primitives-octdigit]       | Parse a single octal digit.                                                          |
| [`octDigits`][primitives-octdigits]     | Parse one or more octal digits.                                                      |
| [`position`][primitives-position]       | Get current position (remaining input length).                                       |
| [`rest`][primitives-rest]               | Parse the rest of the input.                                                         |
| [`space`][primitives-space]             | Parse a single space character.                                                      |
| [`spaces`][primitives-spaces]           | Parse one or more space characters.                                                  |
| [`tab`][primitives-tab]                 | Parse tab character.                                                                 |
| [`uppercase`][primitives-uppercase]     | Parses a single uppercase letter.                                                    |
| [`uppercases`][primitives-uppercases]   | Parses one or more uppercase letters.                                                |
| [`whitespace`][primitives-whitespace]   | Parses a single whitespace character.                                                |
| [`whitespaces`][primitives-whitespaces] | Parses one or more whitespace characters.                                            |

### Combinators — `unitas/combinators`

Take parsers, return a new parser. **64** exports — [full reference →][api-combinators]

|                                                          |                                                                             |
| -------------------------------------------------------- | --------------------------------------------------------------------------- |
| [`bind`][combinators-bind]                               | Chain parsers where the second parser depends on the first result.          |
| [`braced`][combinators-braced]                           | Parse content surrounded by braces.                                         |
| [`bracketed`][combinators-bracketed]                     | Parse content surrounded by brackets.                                       |
| [`chainLeft`][combinators-chainleft]                     | Chain left-associative operations (right-to-left for same precedence).      |
| [`chainLeft1`][combinators-chainleft1]                   | Chain left-associative operations (fails on empty input).                   |
| [`chainRight`][combinators-chainright]                   | Chain right-associative operations (right-to-left grouping).                |
| [`chainRight1`][combinators-chainright1]                 | Chain right-associative operations (fails on empty input).                  |
| [`choice`][combinators-choice]                           | Try each parser in order, return first success.                             |
| [`concat`][combinators-concat]                           | Join string array parser result into a single string.                       |
| [`consume`][combinators-consume]                         | Consume input but discard the result (return null).                         |
| [`endBy`][combinators-endby]                             | Zero or more items separated and ending with terminator.                    |
| [`endBy1`][combinators-endby1]                           | One or more items separated and ending with terminator.                     |
| [`exactly`][combinators-exactly]                         | Parse exactly n occurrences.                                                |
| [`first`][combinators-first]                             | Extract the first element from a parser result array.                       |
| [`flag`][combinators-flag]                               | Return true if parser succeeds, false otherwise.                            |
| [`fold`][combinators-fold]                               | Parse zero or more and fold into a single value.                            |
| [`fold1`][combinators-fold1]                             | Parse one or more and fold into a single value.                             |
| [`foldRight`][combinators-foldright]                     | Parse zero or more and fold right-to-left.                                  |
| [`foldRight1`][combinators-foldright1]                   | Parse one or more and fold right-to-left.                                   |
| [`fuse`][combinators-fuse]                               | Fuse multiple string parsers into a single one.                             |
| [`guard`][combinators-guard]                             | Conditionally apply parser based on a condition.                            |
| [`inner`][combinators-inner]                             | Extract inner value from surrounded content (like inner of braced).         |
| [`interleaved`][combinators-interleaved]                 | Parse items with interleaved separators.                                    |
| [`last`][combinators-last]                               | Extract the last element from a parser result array.                        |
| [`left`][combinators-left]                               | Keep only the left result from a sequence.                                  |
| [`lexeme`][combinators-lexeme]                           | Parser that consumes trailing whitespace.                                   |
| [`many`][combinators-many]                               | Zero or more occurrences (never fails).                                     |
| [`many1`][combinators-many1]                             | One or more occurrences (fails if no matches).                              |
| [`manyAtLeast`][combinators-manyatleast]                 | Parse at least n occurrences.                                               |
| [`manyAtMost`][combinators-manyatmost]                   | Parse at most n occurrences.                                                |
| [`manyBetween`][combinators-manybetween]                 | Parse between min and max occurrences.                                      |
| [`manyTill`][combinators-manytill]                       | Parse zero or more until terminator matches.                                |
| [`map`][combinators-map]                                 | Transform the parsed value.                                                 |
| [`node`][combinators-node]                               | Create a node from parser fields.                                           |
| [`not`][combinators-not]                                 | Succeed if parser fails (without consuming input).                          |
| [`nth`][combinators-nth]                                 | Extract the nth element from a parser result array.                         |
| [`optional`][combinators-optional]                       | Make parser optional (return null on failure, without consuming input).     |
| [`optionalConsume`][combinators-optionalconsume]         | Optionally consume input (always succeeds, returns void).                   |
| [`optionalSeparatedBy`][combinators-optionalseparatedby] | Zero or more items separated by a separator, with optional null values.     |
| [`outer`][combinators-outer]                             | Extract outer values from a sequence of 3 parsers (skip middle).            |
| [`padded`][combinators-padded]                           | Parse content with optional whitespace on both sides.                       |
| [`parenthesized`][combinators-parenthesized]             | Parse content surrounded by parentheses.                                    |
| [`peek`][combinators-peek]                               | Parse without consuming input.                                              |
| [`postfix`][combinators-postfix]                         | Parse postfix operators (chains atom with operators that return functions). |
| [`prefix`][combinators-prefix]                           | Parse prefix operators (like - in -5).                                      |
| [`pure`][combinators-pure]                               | Always return a value without consuming input.                              |
| [`quoted`][combinators-quoted]                           | Parse content surrounded by single or double quotes.                        |
| [`recover`][combinators-recover]                         | Use fallback value when parser fails.                                       |
| [`right`][combinators-right]                             | Keep only the right result from a sequence.                                 |
| [`separatedBy`][combinators-separatedby]                 | Zero or more items separated by a separator.                                |
| [`separatedBy1`][combinators-separatedby1]               | One or more items separated by a separator.                                 |
| [`separatedEndBy`][combinators-separatedendby]           | Zero or more items separated by and ending with a terminator.               |
| [`separatedEndBy1`][combinators-separatedendby1]         | One or more items separated by and ending with a terminator.                |
| [`separatedUntil`][combinators-separateduntil]           | Parse items separated by separator until terminator matches.                |
| [`sequence`][combinators-sequence]                       | Parse a sequence of parsers and return all results as an array.             |
| [`skip`][combinators-skip]                               | Skip a parser n times.                                                      |
| [`skipMany`][combinators-skipmany]                       | Skip zero or more occurrences (never fails, returns null).                  |
| [`skipMany1`][combinators-skipmany1]                     | Skip one or more occurrences (fails if no matches).                         |
| [`surrounded`][combinators-surrounded]                   | Parse content surrounded by delimiters.                                     |
| [`unless`][combinators-unless]                           | Parse unless condition is true (inverse of guard).                          |
| [`until`][combinators-until]                             | Parse until terminator matches (fails if terminator never matches).         |
| [`validate`][combinators-validate]                       | Validate parsed value with a predicate.                                     |
| [`value`][combinators-value]                             | Replace parsed value with a constant.                                       |
| [`when`][combinators-when]                               | Branch on a boolean parser result.                                          |

### Utils — `unitas/utils`

Plain helpers for `map` callbacks. **8** exports — [full reference →][api-utils]

|                            |                                         |
| -------------------------- | --------------------------------------- |
| [`filter`][utils-filter]   | Exclude values from array.              |
| [`flatten`][utils-flatten] | Flatten nested arrays.                  |
| [`join`][utils-join]       | Join array elements into a string.      |
| [`pick`][utils-pick]       | Pick elements from an array by index.   |
| [`pipe`][utils-pipe]       | Pipe parser functions together.         |
| [`pop`][utils-pop]         | Get the last element of an array.       |
| [`shift`][utils-shift]     | Get the first element of an array.      |
| [`spread`][utils-spread]   | Collect spread arguments into an array. |

[api-core]: https://github.com/sovrin/unitas/blob/master/doc/api/core.md
[core-failure]: https://github.com/sovrin/unitas/blob/master/doc/api/core.md#failure
[core-grammar]: https://github.com/sovrin/unitas/blob/master/doc/api/core.md#grammar
[core-label]: https://github.com/sovrin/unitas/blob/master/doc/api/core.md#label
[core-lazy]: https://github.com/sovrin/unitas/blob/master/doc/api/core.md#lazy
[core-match]: https://github.com/sovrin/unitas/blob/master/doc/api/core.md#match
[core-memoize]: https://github.com/sovrin/unitas/blob/master/doc/api/core.md#memoize
[core-parser]: https://github.com/sovrin/unitas/blob/master/doc/api/core.md#parser
[core-run]: https://github.com/sovrin/unitas/blob/master/doc/api/core.md#run
[core-success]: https://github.com/sovrin/unitas/blob/master/doc/api/core.md#success
[api-terminals]: https://github.com/sovrin/unitas/blob/master/doc/api/terminals.md
[terminals-char]: https://github.com/sovrin/unitas/blob/master/doc/api/terminals.md#char
[terminals-charof]: https://github.com/sovrin/unitas/blob/master/doc/api/terminals.md#charof
[terminals-noneof]: https://github.com/sovrin/unitas/blob/master/doc/api/terminals.md#noneof
[terminals-oneof]: https://github.com/sovrin/unitas/blob/master/doc/api/terminals.md#oneof
[terminals-regex]: https://github.com/sovrin/unitas/blob/master/doc/api/terminals.md#regex
[terminals-satisfy]: https://github.com/sovrin/unitas/blob/master/doc/api/terminals.md#satisfy
[terminals-string]: https://github.com/sovrin/unitas/blob/master/doc/api/terminals.md#string
[terminals-stringof]: https://github.com/sovrin/unitas/blob/master/doc/api/terminals.md#stringof
[terminals-take]: https://github.com/sovrin/unitas/blob/master/doc/api/terminals.md#take
[terminals-takewhile]: https://github.com/sovrin/unitas/blob/master/doc/api/terminals.md#takewhile
[terminals-token]: https://github.com/sovrin/unitas/blob/master/doc/api/terminals.md#token
[terminals-word]: https://github.com/sovrin/unitas/blob/master/doc/api/terminals.md#word
[api-primitives]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md
[primitives-alphanum]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#alphanum
[primitives-alphanums]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#alphanums
[primitives-anychar]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#anychar
[primitives-bool]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#bool
[primitives-crlf]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#crlf
[primitives-digit]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#digit
[primitives-digits]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#digits
[primitives-eof]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#eof
[primitives-eol]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#eol
[primitives-float]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#float
[primitives-hexdigit]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#hexdigit
[primitives-hexdigits]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#hexdigits
[primitives-identifier]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#identifier
[primitives-integer]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#integer
[primitives-letter]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#letter
[primitives-letters]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#letters
[primitives-line]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#line
[primitives-literal]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#literal
[primitives-lowercase]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#lowercase
[primitives-lowercases]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#lowercases
[primitives-nl]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#nl
[primitives-number]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#number
[primitives-octdigit]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#octdigit
[primitives-octdigits]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#octdigits
[primitives-position]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#position
[primitives-rest]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#rest
[primitives-space]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#space
[primitives-spaces]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#spaces
[primitives-tab]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#tab
[primitives-uppercase]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#uppercase
[primitives-uppercases]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#uppercases
[primitives-whitespace]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#whitespace
[primitives-whitespaces]: https://github.com/sovrin/unitas/blob/master/doc/api/primitives.md#whitespaces
[api-combinators]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md
[combinators-bind]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#bind
[combinators-braced]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#braced
[combinators-bracketed]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#bracketed
[combinators-chainleft]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#chainleft
[combinators-chainleft1]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#chainleft1
[combinators-chainright]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#chainright
[combinators-chainright1]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#chainright1
[combinators-choice]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#choice
[combinators-concat]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#concat
[combinators-consume]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#consume
[combinators-endby]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#endby
[combinators-endby1]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#endby1
[combinators-exactly]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#exactly
[combinators-first]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#first
[combinators-flag]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#flag
[combinators-fold]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#fold
[combinators-fold1]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#fold1
[combinators-foldright]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#foldright
[combinators-foldright1]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#foldright1
[combinators-fuse]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#fuse
[combinators-guard]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#guard
[combinators-inner]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#inner
[combinators-interleaved]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#interleaved
[combinators-last]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#last
[combinators-left]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#left
[combinators-lexeme]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#lexeme
[combinators-many]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#many
[combinators-many1]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#many1
[combinators-manyatleast]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#manyatleast
[combinators-manyatmost]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#manyatmost
[combinators-manybetween]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#manybetween
[combinators-manytill]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#manytill
[combinators-map]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#map
[combinators-node]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#node
[combinators-not]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#not
[combinators-nth]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#nth
[combinators-optional]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#optional
[combinators-optionalconsume]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#optionalconsume
[combinators-optionalseparatedby]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#optionalseparatedby
[combinators-outer]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#outer
[combinators-padded]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#padded
[combinators-parenthesized]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#parenthesized
[combinators-peek]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#peek
[combinators-postfix]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#postfix
[combinators-prefix]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#prefix
[combinators-pure]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#pure
[combinators-quoted]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#quoted
[combinators-recover]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#recover
[combinators-right]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#right
[combinators-separatedby]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#separatedby
[combinators-separatedby1]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#separatedby1
[combinators-separatedendby]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#separatedendby
[combinators-separatedendby1]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#separatedendby1
[combinators-separateduntil]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#separateduntil
[combinators-sequence]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#sequence
[combinators-skip]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#skip
[combinators-skipmany]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#skipmany
[combinators-skipmany1]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#skipmany1
[combinators-surrounded]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#surrounded
[combinators-unless]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#unless
[combinators-until]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#until
[combinators-validate]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#validate
[combinators-value]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#value
[combinators-when]: https://github.com/sovrin/unitas/blob/master/doc/api/combinators.md#when
[api-utils]: https://github.com/sovrin/unitas/blob/master/doc/api/utils.md
[utils-filter]: https://github.com/sovrin/unitas/blob/master/doc/api/utils.md#filter
[utils-flatten]: https://github.com/sovrin/unitas/blob/master/doc/api/utils.md#flatten
[utils-join]: https://github.com/sovrin/unitas/blob/master/doc/api/utils.md#join
[utils-pick]: https://github.com/sovrin/unitas/blob/master/doc/api/utils.md#pick
[utils-pipe]: https://github.com/sovrin/unitas/blob/master/doc/api/utils.md#pipe
[utils-pop]: https://github.com/sovrin/unitas/blob/master/doc/api/utils.md#pop
[utils-shift]: https://github.com/sovrin/unitas/blob/master/doc/api/utils.md#shift
[utils-spread]: https://github.com/sovrin/unitas/blob/master/doc/api/utils.md#spread

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
