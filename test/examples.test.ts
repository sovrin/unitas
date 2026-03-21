// @ts-nocheck
import { describe, it, expect } from 'vitest';

import * as combinators from '../src/combinators';
import * as core from '../src/core';
import * as terminals from '../src/terminals';
import * as utils from '../src/utils';
import * as helpers from './helpers';

Object.assign(globalThis, utils, combinators, terminals, core, helpers);

describe('examples from source', () => {
    describe('combinators', () => {
        it('attempt: Attempt wraps a parser to handle backtracking on failure.', () => {
            const __result0 = attempt(literal('hello'))('hello world');
            expect(__result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: ' world',
            });
        });

        it('braced: Parse content surrounded by braces.', () => {
            const __result0 = braced(literal('hi'))('{hi}');
            expect(__result0).toEqual({ ok: true, value: 'hi', remaining: '' });
        });

        it('bracketed: Parse content surrounded by brackets.', () => {
            const __result0 = bracketed(literal('hi'))('[hi]');
            expect(__result0).toEqual({ ok: true, value: 'hi', remaining: '' });
        });

        it('chainLeft: Chain left-associative operations (right-to-left for same precedence).', () => {
            const __result0 = chainLeft(digits, operation)('1+2+3');
            expect(__result0).toEqual({ ok: true, value: 6, remaining: '' });
            const __result1 = chainLeft(digits, operation)('10-3+2');
            expect(__result1).toEqual({ ok: true, value: 9, remaining: '' });
        });

        it('chainLeft1: Chain left-associative operations (fails on empty input).', () => {
            const __result0 = chainLeft1(digits, operation)('1+2+3');
            expect(__result0).toEqual({ ok: true, value: 6, remaining: '' });
            const __result1 = chainLeft1(digits, operation)('8/2*3');
            expect(__result1).toEqual({ ok: true, value: 12, remaining: '' });
        });

        it('chainRight: Chain right-associative operations (right-to-left grouping).', () => {
            const __result0 = chainRight(digits, operation)('2-1-1');
            expect(__result0).toEqual({ ok: true, value: 2, remaining: '' });
            const __result1 = chainRight(digits, operation)('4/2/2');
            expect(__result1).toEqual({ ok: true, value: 4, remaining: '' });
        });

        it('chainRight1: Chain right-associative operations (fails on empty input).', () => {
            const __result0 = chainRight1(digits, operation)('2-1-1');
            expect(__result0).toEqual({ ok: true, value: 2, remaining: '' });
            const __result1 = chainRight1(digits, operation)('4/2/2');
            expect(__result1).toEqual({ ok: true, value: 4, remaining: '' });
        });

        it('choice: Try each parser in order, return first success.', () => {
            const __result0 = choice(
                literal('hello'),
                literal('world'),
            )('hello');
            expect(__result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: '',
            });
        });

        it('consume: Consume input but discard the result (return null).', () => {
            const __result0 = consume(literal('hello'))('hello world');
            expect(__result0).toEqual({
                ok: true,
                value: null,
                remaining: ' world',
            });
        });

        it('endBy: Zero or more items separated and ending with terminator.', () => {
            const __result0 = endBy(
                literal('item'),
                literal(';'),
            )('item;item;item;');
            expect(__result0).toEqual({
                ok: true,
                value: ['item', 'item', 'item'],
                remaining: '',
            });
        });

        it('endBy1: One or more items separated and ending with terminator.', () => {
            const __result0 = endBy1(
                literal('item'),
                literal(';'),
            )('item;item;item;');
            expect(__result0).toEqual({
                ok: true,
                value: ['item', 'item', 'item'],
                remaining: '',
            });
        });

        it('exactly: Parse exactly n occurrences.', () => {
            const __result0 = exactly(literal('a'), 3)('aaa');
            expect(__result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('first: Extract the first element from a parser result array.', () => {
            const __result0 = first(sequence(literal('a'), digit))('a1bc');
            expect(__result0).toEqual({
                ok: true,
                value: 'a',
                remaining: 'bc',
            });
        });

        it('fold: Parse zero or more and fold into a single value.', () => {
            const __result0 = fold(digit, [], (acc, d) => [...acc, d])('123');
            expect(__result0).toEqual({
                ok: true,
                value: [1, 2, 3],
                remaining: '',
            });
        });

        it('fold1: Parse one or more and fold into a single value.', () => {
            const __result0 = fold1(digit, 0, (acc, d) => acc + d)('123');
            expect(__result0).toEqual({ ok: true, value: 6, remaining: '' });
        });

        it('foldRight: Parse zero or more and fold right-to-left.', () => {
            const __result0 = foldRight(digit, [], (acc, d) => [...acc, d])(
                '123',
            );
            expect(__result0).toEqual({
                ok: true,
                value: [3, 2, 1],
                remaining: '',
            });
        });

        it('foldRight1: Parse one or more and fold right-to-left.', () => {
            const __result0 = foldRight1(digit, [], (acc, d) => [...acc, d])(
                '123',
            );
            expect(__result0).toEqual({
                ok: true,
                value: [3, 2, 1],
                remaining: '',
            });
        });

        it('guard: Conditionally apply parser based on a condition.', () => {
            const __result0 = guard(true, literal('hello'))('hello');
            expect(__result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: '',
            });
            const __result1 = guard(false, literal('hello'))('hello');
            expect(__result1).toEqual({ ok: false });
        });

        it('inner: Extract inner value from surrounded content (like inner of braced).', () => {
            const __result0 = inner(
                literal('('),
                literal('hi'),
                literal(')'),
            )('(hi)');
            expect(__result0).toEqual({ ok: true, value: 'hi', remaining: '' });
        });

        it('interleaved: Parse items with interleaved separators.', () => {
            const __result0 = interleaved(literal('a'), literal(','))('a,a,a');
            expect(__result0).toEqual({
                ok: true,
                value: ['a', ',', 'a', ',', 'a'],
                remaining: '',
            });
        });

        it('last: Extract the last element from a parser result array.', () => {
            const __result0 = last(sequence(literal('a'), literal('b')))('ab');
            expect(__result0).toEqual({ ok: true, value: 'b', remaining: '' });
        });

        it('left: Keep only the left result from a sequence.', () => {
            const __result0 = left(
                literal('hello'),
                literal('world'),
            )('helloworld');
            expect(__result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: '',
            });
        });

        it('lexeme: Parser that consumes trailing whitespace.', () => {
            const __result0 = lexeme(literal('hello'))('hello   world');
            expect(__result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: 'world',
            });
        });

        it('many: Zero or more occurrences (never fails).', () => {
            const __result0 = many(literal('a'))('aaa');
            expect(__result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('many1: One or more occurrences (fails if no matches).', () => {
            const __result0 = many1(literal('a'))('aaa');
            expect(__result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('manyAtLeast: Parse at least n occurrences.', () => {
            const __result0 = manyAtLeast(literal('a'), 2)('aaa');
            expect(__result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('manyAtMost: Parse at most n occurrences.', () => {
            const __result0 = manyAtMost(literal('a'), 2)('aaa');
            expect(__result0).toEqual({
                ok: true,
                value: ['a', 'a'],
                remaining: 'a',
            });
        });

        it('manyBetween: Parse between min and max occurrences.', () => {
            const __result0 = manyBetween(literal('a'), 2, 3)('aaa');
            expect(__result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('manyTill: Parse zero or more until terminator matches.', () => {
            const __result0 = manyTill(literal('a'), literal('b'))('aaab');
            expect(__result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('map: Transform the parsed value.', () => {
            const __result0 = map(literal('hello'), (v) => v.toUpperCase())(
                'hello',
            );
            expect(__result0).toEqual({
                ok: true,
                value: 'HELLO',
                remaining: '',
            });
        });

        it('not: Succeed if parser fails (without consuming input).', () => {
            const __result0 = not(literal('hello'))('world');
            expect(__result0).toEqual({
                ok: true,
                value: null,
                remaining: 'world',
            });
        });

        it('nth: Extract the nth element from a parser result array.', () => {
            const __result0 = nth(
                sequence(literal('a'), literal('b'), literal('c')),
                1,
            )('abc');
            expect(__result0).toEqual({ ok: true, value: 'b', remaining: '' });
        });

        it('optional: Make parser optional (return null on failure, without consuming input).', () => {
            const __result0 = optional(literal('hello'))('hello');
            expect(__result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: '',
            });
            const __result1 = optional(literal('hello'))('world');
            expect(__result1).toEqual({
                ok: true,
                value: null,
                remaining: 'world',
            });
        });

        it('optionalConsume: Optionally consume input (always succeeds, returns void).', () => {
            const __result0 = optionalConsume(literal('hello'))('hello world');
            expect(__result0).toEqual({
                ok: true,
                value: undefined,
                remaining: ' world',
            });
            const __result1 = optionalConsume(literal('hello'))('world');
            expect(__result1).toEqual({
                ok: true,
                value: undefined,
                remaining: 'world',
            });
        });

        it('outer: Extract outer values from a sequence of 3 parsers (skip middle).', () => {
            const __result0 = outer(
                literal('('),
                literal('hi'),
                literal(')'),
            )('(hi)');
            expect(__result0).toEqual({
                ok: true,
                value: ['(', ')'],
                remaining: '',
            });
        });

        it('padded: Parse content with optional whitespace on both sides.', () => {
            const __result0 = padded(literal('hi'))('   hi   ');
            expect(__result0).toEqual({ ok: true, value: 'hi', remaining: '' });
        });

        it('parenthesized: Parse content surrounded by parentheses.', () => {
            const __result0 = parenthesized(literal('hi'))('(hi)');
            expect(__result0).toEqual({ ok: true, value: 'hi', remaining: '' });
        });

        it('peek: Parse without consuming input.', () => {
            const __result0 = peek(literal('hello'))('hello world');
            expect(__result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: 'hello world',
            });
        });

        it('postfix: Parse postfix operators (chains atom with operators that return functions).', () => {
            const __result0 = postfix(
                literal('a'),
                map(literal('!'), () => (x) => x),
            )('a!');
            expect(__result0).toEqual({ ok: true, value: 'a', remaining: '' });
        });

        it('prefix: Parse prefix operators (like - in -5).', () => {
            const __result0 = prefix(
                map(literal('-'), () => (x) => -x),
                digit,
            )('-5');
            expect(__result0).toEqual({ ok: true, value: -5, remaining: '' });
        });

        it('quoted: Parse content surrounded by single or double quotes.', () => {
            const __result0 = quoted(literal('hello'))('"hello"');
            expect(__result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: '',
            });
        });

        it('recover: Use fallback value when parser fails.', () => {
            const __result0 = recover(literal('hello'), 'default')('world');
            expect(__result0).toEqual({
                ok: true,
                value: 'default',
                remaining: 'world',
            });
        });

        it('right: Keep only the right result from a sequence.', () => {
            const __result0 = right(
                literal('hello'),
                literal('world'),
            )('helloworld');
            expect(__result0).toEqual({
                ok: true,
                value: 'world',
                remaining: '',
            });
        });

        it('separatedBy: Zero or more items separated by a separator.', () => {
            const __result0 = separatedBy(literal('a'), literal(','))('a,a,a');
            expect(__result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('separatedBy1: One or more items separated by a separator.', () => {
            const __result0 = separatedBy1(literal('a'), literal(','))('a,a,a');
            expect(__result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('separatedEndBy: Zero or more items separated by and ending with a terminator.', () => {
            const __result0 = separatedEndBy(
                literal('a'),
                literal(';'),
            )('a;a;a;');
            expect(__result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('separatedEndBy1: One or more items separated by and ending with a terminator.', () => {
            const __result0 = separatedEndBy1(
                literal('a'),
                literal(';'),
            )('a;a;a;');
            expect(__result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('separatedUntil: Parse items separated by separator until terminator matches.', () => {
            const __result0 = separatedUntil(
                literal('a'),
                literal(','),
                literal(';'),
            )('a,a,a;');
            expect(__result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('sequence: Parse a sequence of parsers and return all results as an array.', () => {
            const __result0 = sequence(
                literal('a'),
                literal('b'),
                literal('c'),
            )('abc');
            expect(__result0).toEqual({
                ok: true,
                value: ['a', 'b', 'c'],
                remaining: '',
            });
        });

        it('skip: Skip a parser n times.', () => {
            const __result0 = skip(literal('a'), 2)('aabc');
            expect(__result0).toEqual({
                ok: true,
                value: null,
                remaining: 'bc',
            });
        });

        it('skipMany: Skip zero or more occurrences (never fails, returns null).', () => {
            const __result0 = skipMany(literal('a'))('aaabc');
            expect(__result0).toEqual({
                ok: true,
                value: null,
                remaining: 'bc',
            });
        });

        it('skipMany1: Skip one or more occurrences (fails if no matches).', () => {
            const __result0 = skipMany1(literal('a'))('aaabc');
            expect(__result0).toEqual({
                ok: true,
                value: null,
                remaining: 'bc',
            });
        });

        it('surrounded: Parse content surrounded by delimiters.', () => {
            const __result0 = surrounded(
                literal('['),
                literal('hi'),
                literal(']'),
            )('[hi]');
            expect(__result0).toEqual({ ok: true, value: 'hi', remaining: '' });
            const __result1 = surrounded(
                literal('a'),
                literal('b'),
                literal('c'),
            )('abc');
            expect(__result1).toEqual({ ok: true, value: 'b', remaining: '' });
        });

        it('unless: Parse unless condition is true (inverse of guard).', () => {
            const __result0 = unless(false, literal('hello'))('hello');
            expect(__result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: '',
            });
            const __result1 = unless(true, literal('hello'))('hello');
            expect(__result1).toEqual({
                ok: true,
                value: null,
                remaining: 'hello',
            });
        });

        it('until: Parse until terminator matches (fails if terminator never matches).', () => {
            const __result0 = until(literal('a'), literal('b'))('baaa');
            expect(__result0).toEqual({
                ok: true,
                value: [],
                remaining: 'baaa',
            });
            const __result1 = until(literal('a'), literal('b'))('aaba');
            expect(__result1).toEqual({
                ok: true,
                value: ['a', 'a'],
                remaining: 'ba',
            });
        });

        it('validate: Validate parsed value with a predicate.', () => {
            const __result0 = validate(digit, (n) => n > 5)('7');
            expect(__result0).toEqual({ ok: true, value: 7, remaining: '' });
            const __result1 = validate(digit, (n) => n > 5)('3');
            expect(__result1).toEqual({ ok: false });
        });
    });

    describe('core', () => {
        it('failure: Creates a failed result with an optional error message.', () => {
            const __result0 = failure('unexpected input');
            expect(__result0).toEqual({ ok: false, error: 'unexpected input' });
        });

        it('grammar: Creates a recursive grammar where rules can reference each other.', () => {
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
                        map(
                            sequence(char('('), p.expr, char(')')),
                            ([, v]) => v,
                        ),
                    ),
                value: () => digits,
            });
            const __result0 = run(g.expr, '1+2');
            expect(__result0).toEqual(3);
            const __result1 = run(g.expr, '1+2+3');
            expect(__result1).toEqual(6);
            const __result2 = run(g.expr, '(1+2)');
            expect(__result2).toEqual(3);
        });

        it('label: Labels a parser with a custom error message on failure.', () => {
            const __result0 = label(char('x'), 'letter x')('');
            expect(__result0).toEqual({
                ok: false,
                error: 'expected letter x',
            });
        });

        it('lazy: Defers parser creation, useful for recursive grammars.', () => {
            const __result0 = lazy(() => char('a'))('abc');
            expect(__result0).toEqual({
                ok: true,
                value: 'a',
                remaining: 'bc',
            });
        });

        it('match: Pattern matching on a Result to handle success and failure cases.', () => {
            const __result0 = match(success('hello', ''), {
                success: (v) => v,
                failure: () => 'failed',
            });
            expect(__result0).toEqual('hello');
        });

        it('parser: Creates a parser from a parser function.', () => {
            const __result0 = create((input) =>
                success('parsed', input.slice(6)),
            )('hello world');
            expect(__result0).toEqual({
                ok: true,
                value: 'parsed',
                remaining: 'world',
            });
        });

        it('run: Runs a parser and returns the value, throws on failure or unconsumed input.', () => {
            const __result0 = run(literal('hello'), 'hello');
            expect(__result0).toEqual('hello');
        });

        it('success: Creates a successful result with a value and remaining input.', () => {
            const __result0 = success('hello', ' world');
            expect(__result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: ' world',
            });
        });
    });

    describe('terminals', () => {
        it('alphaNum: Parse a single alphanumeric character.', () => {
            const __result0 = alphaNum('a1');
            expect(__result0).toEqual({ ok: true, value: 'a', remaining: '1' });
            const __result1 = alphaNum('1a');
            expect(__result1).toEqual({ ok: true, value: '1', remaining: 'a' });
        });

        it('alphaNums: Parse one or more alphanumeric characters.', () => {
            const __result0 = alphaNums('abc123');
            expect(__result0).toEqual({
                ok: true,
                value: 'abc123',
                remaining: '',
            });
        });

        it('anyChar: Parse any single character.', () => {
            const __result0 = anyChar('abc');
            expect(__result0).toEqual({
                ok: true,
                value: 'a',
                remaining: 'bc',
            });
        });

        it('char: Parse a specific character.', () => {
            const __result0 = char('A')('ABC');
            expect(__result0).toEqual({
                ok: true,
                value: 'A',
                remaining: 'BC',
            });
        });

        it('charOf: Parse any character from a set.', () => {
            const __result0 = charOf(['a', 'b', 'c'])('abc');
            expect(__result0).toEqual({
                ok: true,
                value: 'a',
                remaining: 'bc',
            });
        });

        it('crlf: Parse CRLF line ending.', () => {
            const __result0 = crlf('\r\nabc');
            expect(__result0).toEqual({
                ok: true,
                value: '\r\n',
                remaining: 'abc',
            });
        });

        it('digit: Parse a single digit and return as number.', () => {
            const __result0 = digit('5abc');
            expect(__result0).toEqual({ ok: true, value: 5, remaining: 'abc' });
        });

        it('digits: Parse one or more digits and return as number.', () => {
            const __result0 = digits('123abc');
            expect(__result0).toEqual({
                ok: true,
                value: 123,
                remaining: 'abc',
            });
        });

        it('eof: Parse end of file (succeeds only on empty input).', () => {
            const __result0 = eof('');
            expect(__result0).toEqual({ ok: true, value: null, remaining: '' });
        });

        it('eol: Parse end of line (\\n, \\r\\n, or EOF).', () => {
            const __result0 = eol('\nabc');
            expect(__result0).toEqual({
                ok: true,
                value: '\n',
                remaining: 'abc',
            });
        });

        it('hexDigit: Parse a single hexadecimal digit.', () => {
            const __result0 = hexDigit('fF9');
            expect(__result0).toEqual({
                ok: true,
                value: 'f',
                remaining: 'F9',
            });
        });

        it('hexDigits: Parse one or more hexadecimal digits.', () => {
            const __result0 = hexDigits('deadbeef');
            expect(__result0).toEqual({
                ok: true,
                value: 'deadbeef',
                remaining: '',
            });
        });

        it('identifier: Parse a programming identifier.', () => {
            const __result0 = identifier('variable_name');
            expect(__result0).toEqual({
                ok: true,
                value: 'variable_name',
                remaining: '',
            });
        });

        it('letter: Parse a single letter.', () => {
            const __result0 = letter('abc');
            expect(__result0).toEqual({
                ok: true,
                value: 'a',
                remaining: 'bc',
            });
        });

        it('letters: Parse one or more letters.', () => {
            const __result0 = letters('abc123');
            expect(__result0).toEqual({
                ok: true,
                value: 'abc',
                remaining: '123',
            });
        });

        it('line: Parse until end of line.', () => {
            const __result0 = line('hello\nworld');
            expect(__result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: '\nworld',
            });
        });

        it('literal: Parse a specific string.', () => {
            const __result0 = literal('hello')('hello world');
            expect(__result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: ' world',
            });
        });

        it('lowercase: Parse a single lowercase letter.', () => {
            const __result0 = lowercase('abc');
            expect(__result0).toEqual({
                ok: true,
                value: 'a',
                remaining: 'bc',
            });
        });

        it('lowercases: Parses one or more lowercase letters.', () => {
            const __result0 = lowercases('abcDEF');
            expect(__result0).toEqual({
                ok: true,
                value: 'abc',
                remaining: 'DEF',
            });
        });

        it('nl: Parse a newline character.', () => {
            const __result0 = nl('\ntext');
            expect(__result0).toEqual({
                ok: true,
                value: '\n',
                remaining: 'text',
            });
        });

        it('noneOf: Parse any character not in the set.', () => {
            const __result0 = noneOf(['a', 'b', 'c'])('xyz');
            expect(__result0).toEqual({
                ok: true,
                value: 'x',
                remaining: 'yz',
            });
        });

        it('octDigit: Parse a single octal digit.', () => {
            const __result0 = octDigit('7abc');
            expect(__result0).toEqual({
                ok: true,
                value: '7',
                remaining: 'abc',
            });
        });

        it('octDigits: Parse one or more octal digits.', () => {
            const __result0 = octDigits('0777abc');
            expect(__result0).toEqual({
                ok: true,
                value: '0777',
                remaining: 'abc',
            });
        });

        it('oneOf: Parse one string from a set of strings (longest match wins).', () => {
            const __result0 = oneOf(['hello', 'hell', 'help'])('helpful');
            expect(__result0).toEqual({
                ok: true,
                value: 'help',
                remaining: 'ful',
            });
        });

        it('position: Get current position (remaining input length).', () => {
            const __result0 = position('abc');
            expect(__result0).toEqual({ ok: true, value: 3, remaining: 'abc' });
        });

        it('regex: Parse with a regular expression.', () => {
            const __result0 = regex(/^\w+/)('hello world');
            expect(__result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: ' world',
            });
        });

        it('rest: Parse the rest of the input.', () => {
            const __result0 = rest('hello');
            expect(__result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: '',
            });
        });

        it('satisfy: Parse a character satisfying a predicate.', () => {
            const __result0 = satisfy((c) => c === 'a')('abc');
            expect(__result0).toEqual({
                ok: true,
                value: 'a',
                remaining: 'bc',
            });
        });

        it('stringOf: Parse first character that exists in string (like charOf but for a string).', () => {
            const __result0 = stringOf('abc')('abcdef');
            expect(__result0).toEqual({
                ok: true,
                value: 'a',
                remaining: 'bcdef',
            });
        });

        it('tab: Parse tab character.', () => {
            const __result0 = tab('\ttext');
            expect(__result0).toEqual({
                ok: true,
                value: '\t',
                remaining: 'text',
            });
        });

        it('take: Take n characters.', () => {
            const __result0 = take(3)('abcdef');
            expect(__result0).toEqual({
                ok: true,
                value: 'abc',
                remaining: 'def',
            });
        });

        it('takeUntil: Takes characters until the predicate returns true.', () => {
            const __result0 = takeUntil((c) => c === 'x')('abcx');
            expect(__result0).toEqual({
                ok: true,
                value: 'abc',
                remaining: 'x',
            });
        });

        it('takeWhile: Takes characters while the predicate returns true.', () => {
            const __result0 = takeWhile((c) => c !== 'x')('abcx');
            expect(__result0).toEqual({
                ok: true,
                value: 'abc',
                remaining: 'x',
            });
        });

        it('token: Parses a literal string as a token, skipping trailing whitespace.', () => {
            const __result0 = token('let')('let x');
            expect(__result0).toEqual({
                ok: true,
                value: 'let',
                remaining: 'x',
            });
        });

        it('uppercases: Parses one or more uppercase letters.', () => {
            const __result0 = uppercases('ABCdef');
            expect(__result0).toEqual({
                ok: true,
                value: 'ABC',
                remaining: 'def',
            });
        });

        it('whitespace: Parses a single whitespace character.', () => {
            const __result0 = whitespace(' abc');
            expect(__result0).toEqual({
                ok: true,
                value: ' ',
                remaining: 'abc',
            });
        });

        it('whitespaces: Parses one or more whitespace characters.', () => {
            const __result0 = whitespaces('  abc');
            expect(__result0).toEqual({
                ok: true,
                value: '  ',
                remaining: 'abc',
            });
        });

        it('word: Parses a specific word and ensures it is not followed by word characters.', () => {
            const __result0 = word('let')('let x');
            expect(__result0).toEqual({
                ok: true,
                value: 'let',
                remaining: 'x',
            });
        });
    });

    describe('utils', () => {
        it('filter: Exclude values from array.', () => {
            const __result0 = filter([1, 2, 3])([1, 2, 3, 4, 5]);
            expect(__result0).toEqual([4, 5]);
            const __result1 = filter([1, 2], true)([1, false, 3]);
            expect(__result1).toEqual([3]);
        });

        it('flatten: Flatten nested arrays.', () => {
            const __result0 = flatten()([1, [2, [3]]]);
            expect(__result0).toEqual([1, 2, [3]]);
            const __result1 = flatten(2)([1, [2, [3]]]);
            expect(__result1).toEqual([1, 2, 3]);
        });

        it('join: Join array elements into a string.', () => {
            const __result0 = join()([1, 2, 3]);
            expect(__result0).toEqual('123');
            const __result1 = join('-')([1, 2, 3]);
            expect(__result1).toEqual('1-2-3');
        });

        it('pop: Get the last element of an array.', () => {
            const __result0 = pop()([1, 2, 3]);
            expect(__result0).toEqual(3);
        });

        it('shift: Get the first element of an array.', () => {
            const __result0 = shift()([1, 2, 3]);
            expect(__result0).toEqual(1);
        });

        it('spread: Collect spread arguments into an array.', () => {
            const __result0 = spread()(1, 2, 3);
            expect(__result0).toEqual([1, 2, 3]);
        });
    });
});
