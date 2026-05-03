// @ts-nocheck
import { describe, it, expect } from 'vitest';

import * as combinators from '../src/combinators';
import * as core from '../src/core';
import * as primitives from '../src/primitives';
import * as terminals from '../src/terminals';
import * as utils from '../src/utils';
import * as helpers from './helpers';

Object.assign(
    globalThis,
    utils,
    combinators,
    terminals,
    core,
    primitives,
    helpers,
);

describe('examples from source', () => {
    describe('combinators', () => {
        it('attempt: Attempt wraps a parser to handle backtracking on failure.', () => {
            const result0 = attempt(string('hello'))('hello world');
            expect(result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: ' world',
            });
        });

        it('bind: Chain parsers where the second parser depends on the first result.', () => {
            const result0 = bind(digits, (n) => take(n))('3abc');
            expect(result0).toEqual({ ok: true, value: 'abc', remaining: '' });
        });

        it('braced: Parse content surrounded by braces.', () => {
            const result0 = braced(string('hi'))('{hi}');
            expect(result0).toEqual({ ok: true, value: 'hi', remaining: '' });
        });

        it('bracketed: Parse content surrounded by brackets.', () => {
            const result0 = bracketed(string('hi'))('[hi]');
            expect(result0).toEqual({ ok: true, value: 'hi', remaining: '' });
        });

        it('chainLeft: Chain left-associative operations (right-to-left for same precedence).', () => {
            const result0 = chainLeft(digits, operation)('1+2+3');
            expect(result0).toEqual({ ok: true, value: 6, remaining: '' });
            const result1 = chainLeft(digits, operation)('10-3+2');
            expect(result1).toEqual({ ok: true, value: 9, remaining: '' });
        });

        it('chainLeft1: Chain left-associative operations (fails on empty input).', () => {
            const result0 = chainLeft1(digits, operation)('1+2+3');
            expect(result0).toEqual({ ok: true, value: 6, remaining: '' });
            const result1 = chainLeft1(digits, operation)('8/2*3');
            expect(result1).toEqual({ ok: true, value: 12, remaining: '' });
        });

        it('chainRight: Chain right-associative operations (right-to-left grouping).', () => {
            const result0 = chainRight(digits, operation)('2-1-1');
            expect(result0).toEqual({ ok: true, value: 2, remaining: '' });
            const result1 = chainRight(digits, operation)('4/2/2');
            expect(result1).toEqual({ ok: true, value: 4, remaining: '' });
        });

        it('chainRight1: Chain right-associative operations (fails on empty input).', () => {
            const result0 = chainRight1(digits, operation)('2-1-1');
            expect(result0).toEqual({ ok: true, value: 2, remaining: '' });
            const result1 = chainRight1(digits, operation)('4/2/2');
            expect(result1).toEqual({ ok: true, value: 4, remaining: '' });
        });

        it('choice: Try each parser in order, return first success.', () => {
            const result0 = choice(string('hello'), string('world'))('hello');
            expect(result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: '',
            });
        });

        it('concat: Join string array parser result into a single string.', () => {
            const result0 = concat(many(letter))('abc123');
            expect(result0).toEqual({
                ok: true,
                value: 'abc',
                remaining: '123',
            });
            const result1 = concat(many(letter), '-')('abc123');
            expect(result1).toEqual({
                ok: true,
                value: 'a-b-c',
                remaining: '123',
            });
        });

        it('consume: Consume input but discard the result (return null).', () => {
            const result0 = consume(string('hello'))('hello world');
            expect(result0).toEqual({
                ok: true,
                value: null,
                remaining: ' world',
            });
        });

        it('endBy: Zero or more items separated and ending with terminator.', () => {
            const result0 = endBy(string('item'), char(';'))('item;item;item;');
            expect(result0).toEqual({
                ok: true,
                value: ['item', 'item', 'item'],
                remaining: '',
            });
        });

        it('endBy1: One or more items separated and ending with terminator.', () => {
            const result0 = endBy1(
                string('item'),
                char(';'),
            )('item;item;item;');
            expect(result0).toEqual({
                ok: true,
                value: ['item', 'item', 'item'],
                remaining: '',
            });
        });

        it('exactly: Parse exactly n occurrences.', () => {
            const result0 = exactly(char('a'), 3)('aaa');
            expect(result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('first: Extract the first element from a parser result array.', () => {
            const result0 = first(sequence(char('a'), digit))('a1bc');
            expect(result0).toEqual({ ok: true, value: 'a', remaining: 'bc' });
        });

        it('flag: Return true if parser succeeds, false otherwise. Always succeeds without consuming input on failure.', () => {
            const result0 = flag(string('*'))('*abc');
            expect(result0).toEqual({
                ok: true,
                value: true,
                remaining: 'abc',
            });
            const result1 = flag(string('*'))('abc');
            expect(result1).toEqual({
                ok: true,
                value: false,
                remaining: 'abc',
            });
        });

        it('fold: Parse zero or more and fold into a single value.', () => {
            const result0 = fold(digit, [], (acc, d) => [...acc, d])('123');
            expect(result0).toEqual({
                ok: true,
                value: [1, 2, 3],
                remaining: '',
            });
        });

        it('fold1: Parse one or more and fold into a single value.', () => {
            const result0 = fold1(digit, 0, (acc, d) => acc + d)('123');
            expect(result0).toEqual({ ok: true, value: 6, remaining: '' });
        });

        it('foldRight: Parse zero or more and fold right-to-left.', () => {
            const result0 = foldRight(digit, [], (acc, d) => [...acc, d])(
                '123',
            );
            expect(result0).toEqual({
                ok: true,
                value: [3, 2, 1],
                remaining: '',
            });
        });

        it('foldRight1: Parse one or more and fold right-to-left.', () => {
            const result0 = foldRight1(digit, [], (acc, d) => [...acc, d])(
                '123',
            );
            expect(result0).toEqual({
                ok: true,
                value: [3, 2, 1],
                remaining: '',
            });
        });

        it('fuse: The fused parser concatenates all string results.', () => {
            const result0 = fuse(char('a'), char('b'), char('c'))('abc');
            expect(result0).toEqual({ ok: true, value: 'abc', remaining: '' });
            const result1 = fuse(
                string('hello'),
                char(' '),
                string('world'),
            )('hello world');
            expect(result1).toEqual({
                ok: true,
                value: 'hello world',
                remaining: '',
            });
        });

        it('guard: Conditionally apply parser based on a condition.', () => {
            const result0 = guard(true, string('hello'))('hello');
            expect(result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: '',
            });
            const result1 = guard(false, string('hello'))('hello');
            expect(result1).toEqual({ ok: false });
        });

        it('inner: Extract inner value from surrounded content (like inner of braced).', () => {
            const result0 = inner(char('('), string('hi'), char(')'))('(hi)');
            expect(result0).toEqual({ ok: true, value: 'hi', remaining: '' });
        });

        it('interleaved: Parse items with interleaved separators.', () => {
            const result0 = interleaved(char('a'), char(','))('a,a,a');
            expect(result0).toEqual({
                ok: true,
                value: ['a', ',', 'a', ',', 'a'],
                remaining: '',
            });
        });

        it('last: Extract the last element from a parser result array.', () => {
            const result0 = last(sequence(char('a'), char('b')))('ab');
            expect(result0).toEqual({ ok: true, value: 'b', remaining: '' });
        });

        it('left: Keep only the left result from a sequence.', () => {
            const result0 = left(
                string('hello'),
                string('world'),
            )('helloworld');
            expect(result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: '',
            });
        });

        it('lexeme: Parser that consumes trailing whitespace.', () => {
            const result0 = lexeme(string('hello'))('hello   world');
            expect(result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: 'world',
            });
        });

        it('many: Zero or more occurrences (never fails).', () => {
            const result0 = many(char('a'))('aaa');
            expect(result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('many1: One or more occurrences (fails if no matches).', () => {
            const result0 = many1(char('a'))('aaa');
            expect(result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('manyAtLeast: Parse at least n occurrences.', () => {
            const result0 = manyAtLeast(char('a'), 2)('aaa');
            expect(result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('manyAtMost: Parse at most n occurrences.', () => {
            const result0 = manyAtMost(char('a'), 2)('aaa');
            expect(result0).toEqual({
                ok: true,
                value: ['a', 'a'],
                remaining: 'a',
            });
        });

        it('manyBetween: Parse between min and max occurrences.', () => {
            const result0 = manyBetween(char('a'), 2, 3)('aaa');
            expect(result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('manyTill: Parse zero or more until terminator matches.', () => {
            const result0 = manyTill(char('a'), char('b'))('aaab');
            expect(result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('map: Transform the parsed value.', () => {
            const result0 = map(string('hello'), (v) => v.toUpperCase())(
                'hello',
            );
            expect(result0).toEqual({
                ok: true,
                value: 'HELLO',
                remaining: '',
            });
        });

        it('node: Create a node from parser fields.', () => {
            const result0 = node('binop', {
                left: digits,
                op: char('+'),
                right: digits,
            })('1+2');
            expect(result0).toEqual({
                ok: true,
                value: { type: 'binop', left: 1, op: '+', right: 2 },
                remaining: '',
            });
            const result1 = node('number', { value: digits })('123');
            expect(result1).toEqual({
                ok: true,
                value: { type: 'number', value: 123 },
                remaining: '',
            });
        });

        it('not: Succeed if parser fails (without consuming input).', () => {
            const result0 = not(string('hello'))('world');
            expect(result0).toEqual({
                ok: true,
                value: null,
                remaining: 'world',
            });
        });

        it('nth: Extract the nth element from a parser result array.', () => {
            const result0 = nth(
                sequence(char('a'), char('b'), char('c')),
                1,
            )('abc');
            expect(result0).toEqual({ ok: true, value: 'b', remaining: '' });
        });

        it('optional: Make parser optional (return null on failure, without consuming input).', () => {
            const result0 = optional(string('hello'))('hello');
            expect(result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: '',
            });
            const result1 = optional(string('hello'))('world');
            expect(result1).toEqual({
                ok: true,
                value: null,
                remaining: 'world',
            });
        });

        it('optionalConsume: Optionally consume input (always succeeds, returns void).', () => {
            const result0 = optionalConsume(string('hello'))('hello world');
            expect(result0).toEqual({
                ok: true,
                value: undefined,
                remaining: ' world',
            });
            const result1 = optionalConsume(string('hello'))('world');
            expect(result1).toEqual({
                ok: true,
                value: undefined,
                remaining: 'world',
            });
        });

        it('optionalSeparatedBy: Zero or more items separated by a separator, with optional null values.', () => {
            const result0 = optionalSeparatedBy(digits, char(','))('1,2');
            expect(result0).toEqual({ ok: true, value: [1, 2], remaining: '' });
            const result1 = optionalSeparatedBy(digits, char(','))(',1');
            expect(result1).toEqual({
                ok: true,
                value: [null, 1],
                remaining: '',
            });
            const result2 = optionalSeparatedBy(digits, char(','))('1,');
            expect(result2).toEqual({ ok: true, value: [1], remaining: '' });
        });

        it('outer: Extract outer values from a sequence of 3 parsers (skip middle).', () => {
            const result0 = outer(char('('), string('hi'), char(')'))('(hi)');
            expect(result0).toEqual({
                ok: true,
                value: ['(', ')'],
                remaining: '',
            });
        });

        it('padded: Parse content with optional whitespace on both sides.', () => {
            const result0 = padded(string('hi'))('   hi   ');
            expect(result0).toEqual({ ok: true, value: 'hi', remaining: '' });
        });

        it('parenthesized: Parse content surrounded by parentheses.', () => {
            const result0 = parenthesized(string('hi'))('(hi)');
            expect(result0).toEqual({ ok: true, value: 'hi', remaining: '' });
        });

        it('peek: Parse without consuming input.', () => {
            const result0 = peek(string('hello'))('hello world');
            expect(result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: 'hello world',
            });
        });

        it('postfix: Parse postfix operators (chains atom with operators that return functions).', () => {
            const result0 = postfix(
                char('a'),
                map(char('!'), () => (x) => x),
            )('a!');
            expect(result0).toEqual({ ok: true, value: 'a', remaining: '' });
        });

        it('prefix: Parse prefix operators (like - in -5).', () => {
            const result0 = prefix(
                map(char('-'), () => (x) => -x),
                digit,
            )('-5');
            expect(result0).toEqual({ ok: true, value: -5, remaining: '' });
        });

        it('quoted: Parse content surrounded by single or double quotes.', () => {
            const result0 = quoted(string('hello'))('"hello"');
            expect(result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: '',
            });
        });

        it('recover: Use fallback value when parser fails.', () => {
            const result0 = recover(string('hello'), 'default')('world');
            expect(result0).toEqual({
                ok: true,
                value: 'default',
                remaining: 'world',
            });
        });

        it('right: Keep only the right result from a sequence.', () => {
            const result0 = right(
                string('hello'),
                string('world'),
            )('helloworld');
            expect(result0).toEqual({
                ok: true,
                value: 'world',
                remaining: '',
            });
        });

        it('separatedBy: Zero or more items separated by a separator.', () => {
            const result0 = separatedBy(char('a'), char(','))('a,a,a');
            expect(result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('separatedBy1: One or more items separated by a separator.', () => {
            const result0 = separatedBy1(char('a'), char(','))('a,a,a');
            expect(result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('separatedEndBy: Zero or more items separated by and ending with a terminator.', () => {
            const result0 = separatedEndBy(char('a'), char(';'))('a;a;a;');
            expect(result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('separatedEndBy1: One or more items separated by and ending with a terminator.', () => {
            const result0 = separatedEndBy1(char('a'), char(';'))('a;a;a;');
            expect(result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('separatedUntil: Parse items separated by separator until terminator matches.', () => {
            const result0 = separatedUntil(
                char('a'),
                char(','),
                char(';'),
            )('a,a,a;');
            expect(result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                remaining: '',
            });
        });

        it('sequence: Parse a sequence of parsers and return all results as an array.', () => {
            const result0 = sequence(char('a'), char('b'), char('c'))('abc');
            expect(result0).toEqual({
                ok: true,
                value: ['a', 'b', 'c'],
                remaining: '',
            });
        });

        it('skip: Skip a parser n times.', () => {
            const result0 = skip(char('a'), 2)('aabc');
            expect(result0).toEqual({ ok: true, value: null, remaining: 'bc' });
        });

        it('skipMany: Skip zero or more occurrences (never fails, returns null).', () => {
            const result0 = skipMany(char('a'))('aaabc');
            expect(result0).toEqual({ ok: true, value: null, remaining: 'bc' });
        });

        it('skipMany1: Skip one or more occurrences (fails if no matches).', () => {
            const result0 = skipMany1(char('a'))('aaabc');
            expect(result0).toEqual({ ok: true, value: null, remaining: 'bc' });
        });

        it('surrounded: Parse content surrounded by delimiters.', () => {
            const result0 = surrounded(
                char('['),
                string('hi'),
                char(']'),
            )('[hi]');
            expect(result0).toEqual({ ok: true, value: 'hi', remaining: '' });
            const result1 = surrounded(char('a'), char('b'), char('c'))('abc');
            expect(result1).toEqual({ ok: true, value: 'b', remaining: '' });
        });

        it('unless: Parse unless condition is true (inverse of guard).', () => {
            const result0 = unless(false, string('hello'))('hello');
            expect(result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: '',
            });
            const result1 = unless(true, string('hello'))('hello');
            expect(result1).toEqual({
                ok: true,
                value: null,
                remaining: 'hello',
            });
        });

        it('until: Parse until terminator matches (fails if terminator never matches).', () => {
            const result0 = until(char('a'), char('b'))('baaa');
            expect(result0).toEqual({ ok: true, value: [], remaining: 'baaa' });
            const result1 = until(char('a'), char('b'))('aaba');
            expect(result1).toEqual({
                ok: true,
                value: ['a', 'a'],
                remaining: 'ba',
            });
        });

        it('validate: Validate parsed value with a predicate.', () => {
            const result0 = validate(digit, (n) => n > 5)('7');
            expect(result0).toEqual({ ok: true, value: 7, remaining: '' });
            const result1 = validate(digit, (n) => n > 5)('3');
            expect(result1).toEqual({ ok: false });
        });
    });

    describe('core', () => {
        it('failure: Creates a failed result with an optional error message.', () => {
            const result0 = failure('unexpected input');
            expect(result0).toEqual({ ok: false, error: 'unexpected input' });
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
            const result0 = run(g.expr, '1+2');
            expect(result0).toEqual(3);
            const result1 = run(g.expr, '1+2+3');
            expect(result1).toEqual(6);
            const result2 = run(g.expr, '(1+2)');
            expect(result2).toEqual(3);
        });

        it('label: Labels a parser with a custom error message on failure.', () => {
            const result0 = label(char('x'), 'letter x')('');
            expect(result0).toEqual({ ok: false, error: 'expected letter x' });
        });

        it('lazy: Defers parser creation, useful for recursive grammars.', () => {
            const result0 = lazy(() => char('a'))('abc');
            expect(result0).toEqual({ ok: true, value: 'a', remaining: 'bc' });
        });

        it('match: Pattern matching on a Result to handle success and failure cases.', () => {
            const result0 = match(success('hello', ''), {
                success: (v) => v,
                failure: () => 'failed',
            });
            expect(result0).toEqual('hello');
        });

        it('memoize: exponential backtracking.', () => {
            const memoDigits = memoize(digits);
            const result0 = memoDigits('123');
            expect(result0).toEqual({ ok: true, value: 123, remaining: '' });
        });

        it('parser: Creates a parser from a parser function.', () => {
            const result0 = create((input) =>
                success('parsed', input.slice(6)),
            )('hello world');
            expect(result0).toEqual({
                ok: true,
                value: 'parsed',
                remaining: 'world',
            });
        });

        it('run: Runs a parser and returns the value, throws on failure or unconsumed input.', () => {
            const result0 = run(string('hello'), 'hello');
            expect(result0).toEqual('hello');
        });

        it('success: Creates a successful result with a value and remaining input.', () => {
            const result0 = success('hello', ' world');
            expect(result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: ' world',
            });
        });
    });

    describe('primitives', () => {
        it('alphaNum: Parse a single alphanumeric character.', () => {
            const result0 = alphaNum('a1');
            expect(result0).toEqual({ ok: true, value: 'a', remaining: '1' });
            const result1 = alphaNum('1a');
            expect(result1).toEqual({ ok: true, value: '1', remaining: 'a' });
        });

        it('alphaNums: Parse one or more alphanumeric characters.', () => {
            const result0 = alphaNums('abc123');
            expect(result0).toEqual({
                ok: true,
                value: 'abc123',
                remaining: '',
            });
        });

        it('anyChar: Parse any single character.', () => {
            const result0 = anyChar('abc');
            expect(result0).toEqual({ ok: true, value: 'a', remaining: 'bc' });
        });

        it('bool: Parse a boolean literal.', () => {
            const result0 = bool('true');
            expect(result0).toEqual({ ok: true, value: true, remaining: '' });
            const result1 = bool('false');
            expect(result1).toEqual({ ok: true, value: false, remaining: '' });
            const result2 = bool('trueABC');
            expect(result2).toEqual({
                ok: true,
                value: true,
                remaining: 'ABC',
            });
        });

        it('crlf: Parse CRLF line ending.', () => {
            const result0 = crlf('\r\nabc');
            expect(result0).toEqual({
                ok: true,
                value: '\r\n',
                remaining: 'abc',
            });
        });

        it('digit: Parse a single digit and return as number.', () => {
            const result0 = digit('5abc');
            expect(result0).toEqual({ ok: true, value: 5, remaining: 'abc' });
        });

        it('digits: Parse one or more digits and return as number.', () => {
            const result0 = digits('123abc');
            expect(result0).toEqual({ ok: true, value: 123, remaining: 'abc' });
        });

        it('eof: Parse end of file (succeeds only on empty input).', () => {
            const result0 = eof('');
            expect(result0).toEqual({ ok: true, value: null, remaining: '' });
        });

        it('eol: Parse end of line (\\n, \\r\\n, or EOF).', () => {
            const result0 = eol('\nabc');
            expect(result0).toEqual({
                ok: true,
                value: '\n',
                remaining: 'abc',
            });
        });

        it('float: Parse a floating point number.', () => {
            const result0 = float('1.23');
            expect(result0).toEqual({ ok: true, value: 1.23, remaining: '' });
            const result1 = float('-2.5');
            expect(result1).toEqual({ ok: true, value: -2.5, remaining: '' });
            const result2 = float('1.23abc');
            expect(result2).toEqual({
                ok: true,
                value: 1.23,
                remaining: 'abc',
            });
        });

        it('hexDigit: Parse a single hexadecimal digit.', () => {
            const result0 = hexDigit('fF9');
            expect(result0).toEqual({ ok: true, value: 'f', remaining: 'F9' });
        });

        it('hexDigits: Parse one or more hexadecimal digits.', () => {
            const result0 = hexDigits('deadbeef');
            expect(result0).toEqual({
                ok: true,
                value: 'deadbeef',
                remaining: '',
            });
        });

        it('identifier: Parse an identifier — starts with letter or underscore, no leading digit, no hyphen.', () => {
            const result0 = identifier('variable_name');
            expect(result0).toEqual({
                ok: true,
                value: 'variable_name',
                remaining: '',
            });
        });

        it('integer: Parse a signed integer.', () => {
            const result0 = integer('42');
            expect(result0).toEqual({ ok: true, value: 42, remaining: '' });
            const result1 = integer('-7');
            expect(result1).toEqual({ ok: true, value: -7, remaining: '' });
            const result2 = integer('123abc');
            expect(result2).toEqual({ ok: true, value: 123, remaining: 'abc' });
        });

        it('letter: Parse a single letter.', () => {
            const result0 = letter('abc');
            expect(result0).toEqual({ ok: true, value: 'a', remaining: 'bc' });
        });

        it('letters: Parse one or more letters.', () => {
            const result0 = letters('abc123');
            expect(result0).toEqual({
                ok: true,
                value: 'abc',
                remaining: '123',
            });
        });

        it('line: Parse until end of line.', () => {
            const result0 = line('hello\nworld');
            expect(result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: '\nworld',
            });
        });

        it('literal: Parse a word-like value including hyphens.', () => {
            const result0 = literal('foo-bar');
            expect(result0).toEqual({
                ok: true,
                value: 'foo-bar',
                remaining: '',
            });
            const result1 = literal('123abc');
            expect(result1).toEqual({
                ok: true,
                value: '123abc',
                remaining: '',
            });
        });

        it('lowercase: Parse a single lowercase letter.', () => {
            const result0 = lowercase('abc');
            expect(result0).toEqual({ ok: true, value: 'a', remaining: 'bc' });
        });

        it('lowercases: Parses one or more lowercase letters.', () => {
            const result0 = lowercases('abcDEF');
            expect(result0).toEqual({
                ok: true,
                value: 'abc',
                remaining: 'DEF',
            });
        });

        it('nl: Parse a newline character.', () => {
            const result0 = nl('\ntext');
            expect(result0).toEqual({
                ok: true,
                value: '\n',
                remaining: 'text',
            });
        });

        it('octDigit: Parse a single octal digit.', () => {
            const result0 = octDigit('7abc');
            expect(result0).toEqual({ ok: true, value: '7', remaining: 'abc' });
        });

        it('octDigits: Parse one or more octal digits.', () => {
            const result0 = octDigits('0777abc');
            expect(result0).toEqual({
                ok: true,
                value: '0777',
                remaining: 'abc',
            });
        });

        it('position: Get current position (remaining input length).', () => {
            const result0 = position('abc');
            expect(result0).toEqual({ ok: true, value: 3, remaining: 'abc' });
        });

        it('rest: Parse the rest of the input.', () => {
            const result0 = rest('hello');
            expect(result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: '',
            });
        });

        it('tab: Parse tab character.', () => {
            const result0 = tab('\ttext');
            expect(result0).toEqual({
                ok: true,
                value: '\t',
                remaining: 'text',
            });
        });

        it('uppercase: Parses a single uppercase letter.', () => {
            const result0 = uppercase('ABC');
            expect(result0).toEqual({ ok: true, value: 'A', remaining: 'BC' });
        });

        it('uppercases: Parses one or more uppercase letters.', () => {
            const result0 = uppercases('ABCdef');
            expect(result0).toEqual({
                ok: true,
                value: 'ABC',
                remaining: 'def',
            });
        });

        it('whitespace: Parses a single whitespace character.', () => {
            const result0 = whitespace(' abc');
            expect(result0).toEqual({ ok: true, value: ' ', remaining: 'abc' });
        });

        it('whitespaces: Parses one or more whitespace characters.', () => {
            const result0 = whitespaces('  abc');
            expect(result0).toEqual({
                ok: true,
                value: '  ',
                remaining: 'abc',
            });
        });
    });

    describe('terminals', () => {
        it('char: Parse a specific character.', () => {
            const result0 = char('A')('ABC');
            expect(result0).toEqual({ ok: true, value: 'A', remaining: 'BC' });
        });

        it('charOf: Parse any character from a set.', () => {
            const result0 = charOf(['a', 'b', 'c'])('abc');
            expect(result0).toEqual({ ok: true, value: 'a', remaining: 'bc' });
        });

        it('noneOf: Parse any character not in the set.', () => {
            const result0 = noneOf(['a', 'b', 'c'])('xyz');
            expect(result0).toEqual({ ok: true, value: 'x', remaining: 'yz' });
        });

        it('oneOf: Parse one string from a set of strings (longest match wins).', () => {
            const result0 = oneOf(['hello', 'hell', 'help'])('helpful');
            expect(result0).toEqual({
                ok: true,
                value: 'help',
                remaining: 'ful',
            });
        });

        it('regex: Parse with a regular expression.', () => {
            const result0 = regex(/^\w+/)('hello world');
            expect(result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: ' world',
            });
        });

        it('satisfy: Parse a character satisfying a predicate.', () => {
            const result0 = satisfy((c) => c === 'a')('abc');
            expect(result0).toEqual({ ok: true, value: 'a', remaining: 'bc' });
        });

        it('string: Parse a specific string.', () => {
            const result0 = string('hello')('hello world');
            expect(result0).toEqual({
                ok: true,
                value: 'hello',
                remaining: ' world',
            });
        });

        it('stringOf: Parse first character that exists in string (like charOf but for a string).', () => {
            const result0 = stringOf('abc')('abcdef');
            expect(result0).toEqual({
                ok: true,
                value: 'a',
                remaining: 'bcdef',
            });
        });

        it('take: Take n characters.', () => {
            const result0 = take(3)('abcdef');
            expect(result0).toEqual({
                ok: true,
                value: 'abc',
                remaining: 'def',
            });
        });

        it('takeWhile: Takes characters while the predicate returns true.', () => {
            const result0 = takeWhile((c) => c !== 'x')('abcx');
            expect(result0).toEqual({ ok: true, value: 'abc', remaining: 'x' });
        });

        it('token: strings that might be followed by any character.', () => {
            const result0 = token('let')('let x');
            expect(result0).toEqual({ ok: true, value: 'let', remaining: 'x' });
            const result1 = token('let')('let1');
            expect(result1).toEqual({ ok: true, value: 'let', remaining: '1' });
            const result2 = token('let')('let  x');
            expect(result2).toEqual({ ok: true, value: 'let', remaining: 'x' });
        });

        it('word: Use this when parsing keywords that should not be part of a longer identifier.', () => {
            const result0 = word('let')('let x');
            expect(result0).toEqual({ ok: true, value: 'let', remaining: 'x' });
            const result1 = word('let')('let1');
            expect(result1).toEqual({ ok: false });
            const result2 = word('if')('if (x)');
            expect(result2).toEqual({
                ok: true,
                value: 'if',
                remaining: '(x)',
            });
        });
    });

    describe('utils', () => {
        it('filter: Exclude values from array.', () => {
            const result0 = filter([1, 2, 3])([1, 2, 3, 4, 5]);
            expect(result0).toEqual([4, 5]);
            const result1 = filter([1, 2], true)([1, false, 3]);
            expect(result1).toEqual([3]);
        });

        it('flatten: Flatten nested arrays.', () => {
            const result0 = flatten()([1, [2, [3]]]);
            expect(result0).toEqual([1, 2, [3]]);
            const result1 = flatten(2)([1, [2, [3]]]);
            expect(result1).toEqual([1, 2, 3]);
        });

        it('join: Join array elements into a string.', () => {
            const result0 = join()([1, 2, 3]);
            expect(result0).toEqual('123');
            const result1 = join('-')([1, 2, 3]);
            expect(result1).toEqual('1-2-3');
        });

        it('pick: Pick elements from an array by index.', () => {
            const result0 = pick(0, 2)(['a', 'b', 'c']);
            expect(result0).toEqual(['a', 'c']);
            const result1 = pick(2, 4)(['a', 'b', 'c', 'd', 'e']);
            expect(result1).toEqual(['c', 'e']);
        });

        it('pipe: Pipe parser functions together.', () => {
            const result0 = pipe(lexeme)(letters)('xyz   abc');
            expect(result0).toEqual({
                ok: true,
                value: 'xyz',
                remaining: 'abc',
            });
        });

        it('pop: Get the last element of an array.', () => {
            const result0 = pop()([1, 2, 3]);
            expect(result0).toEqual(3);
        });

        it('shift: Get the first element of an array.', () => {
            const result0 = shift()([1, 2, 3]);
            expect(result0).toEqual(1);
        });

        it('spread: Collect spread arguments into an array.', () => {
            const result0 = spread()(1, 2, 3);
            expect(result0).toEqual([1, 2, 3]);
        });
    });
});
