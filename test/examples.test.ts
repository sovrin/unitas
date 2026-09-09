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
        it('bind: Chain parsers where the second parser depends on the first result.', () => {
            const result0 = bind(digits, (n) => take(n))('3abc');
            expect(result0).toEqual({ ok: true, value: 'abc', index: 4 });
        });

        it('braced: Parse content surrounded by braces.', () => {
            const result0 = braced(string('hi'))('{hi}');
            expect(result0).toEqual({ ok: true, value: 'hi', index: 4 });
        });

        it('bracketed: Parse content surrounded by brackets.', () => {
            const result0 = bracketed(string('hi'))('[hi]');
            expect(result0).toEqual({ ok: true, value: 'hi', index: 4 });
        });

        it('chainLeft: Chain left-associative operations (right-to-left for same precedence).', () => {
            const result0 = chainLeft(digits, operation)('1+2+3');
            expect(result0).toEqual({ ok: true, value: 6, index: 5 });
        });

        it('chainLeft1: Chain left-associative operations (fails on empty input).', () => {
            const result0 = chainLeft1(digits, operation)('1+2+3');
            expect(result0).toEqual({ ok: true, value: 6, index: 5 });
            const result1 = chainLeft1(digits, operation)('8/2*3');
            expect(result1).toEqual({ ok: true, value: 12, index: 5 });
        });

        it('chainRight: Chain right-associative operations.', () => {
            const result0 = chainRight(digits, operation)('1+2+3');
            expect(result0).toEqual({ ok: true, value: 6, index: 5 });
        });

        it('chainRight1: Chain right-associative operations (fails on empty input).', () => {
            const result0 = chainRight1(digits, operation)('1+2+3');
            expect(result0).toEqual({ ok: true, value: 6, index: 5 });
        });

        it('choice: in the input is already in the parse context.', () => {
            const result0 = choice(string('hello'), string('world'))('hello');
            expect(result0).toEqual({ ok: true, value: 'hello', index: 5 });
        });

        it('concat: Join string array parser result into a single string.', () => {
            const result0 = concat(many(letter))('abc123');
            expect(result0).toEqual({ ok: true, value: 'abc', index: 3 });
            const result1 = concat(many(letter), '-')('abc123');
            expect(result1).toEqual({ ok: true, value: 'a-b-c', index: 3 });
        });

        it('consume: Consume input but discard the result (return null).', () => {
            const result0 = consume(string('hello'))('hello world');
            expect(result0).toEqual({ ok: true, value: null, index: 5 });
        });

        it('endBy: Zero or more items separated and ending with terminator.', () => {
            const result0 = endBy(string('item'), char(';'))('item;item;item;');
            expect(result0).toEqual({
                ok: true,
                value: ['item', 'item', 'item'],
                index: 15,
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
                index: 15,
            });
        });

        it('exactly: Parse exactly n occurrences.', () => {
            const result0 = exactly(char('a'), 3)('aaa');
            expect(result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                index: 3,
            });
        });

        it('first: Extract the first element from a parser result array.', () => {
            const result0 = first(sequence(char('a'), digit))('a1bc');
            expect(result0).toEqual({ ok: true, value: 'a', index: 2 });
        });

        it('flag: Return true if parser succeeds, false otherwise. Always succeeds without consuming input on failure.', () => {
            const result0 = flag(string('*'))('*abc');
            expect(result0).toEqual({ ok: true, value: true, index: 1 });
            const result1 = flag(string('*'))('abc');
            expect(result1).toEqual({ ok: true, value: false, index: 0 });
        });

        it('fold: Fold zero or more occurrences into a single value.', () => {
            const result0 = fold(digit, 0, (acc, d) => acc + d)('123');
            expect(result0).toEqual({ ok: true, value: 6, index: 3 });
        });

        it('fold1: Fold one or more occurrences into a single value.', () => {
            const result0 = fold1(digit, 0, (acc, d) => acc + d)('123');
            expect(result0).toEqual({ ok: true, value: 6, index: 3 });
        });

        it('foldRight: Fold zero or more occurrences from the right into a single value.', () => {
            const result0 = foldRight(digit, 0, (acc, d) => acc + d)('123');
            expect(result0).toEqual({ ok: true, value: 6, index: 3 });
        });

        it('foldRight1: Fold one or more occurrences from the right into a single value.', () => {
            const result0 = foldRight1(digit, 0, (acc, d) => acc + d)('123');
            expect(result0).toEqual({ ok: true, value: 6, index: 3 });
        });

        it('fuse: The fused parser concatenates all string results.', () => {
            const result0 = fuse(char('a'), char('b'), char('c'))('abc');
            expect(result0).toEqual({ ok: true, value: 'abc', index: 3 });
            const result1 = fuse(
                string('hello'),
                char(' '),
                string('world'),
            )('hello world');
            expect(result1).toEqual({
                ok: true,
                value: 'hello world',
                index: 11,
            });
        });

        it('guard: Conditionally apply parser based on a condition.', () => {
            const result0 = guard(true, string('hello'))('hello');
            expect(result0).toEqual({ ok: true, value: 'hello', index: 5 });
            const result1 = guard(false, string('hello'))('hello');
            expect(result1).toEqual({ ok: false, index: 0, expected: [] });
        });

        it('inner: Extract inner value from surrounded content (like inner of braced).', () => {
            const result0 = inner(char('('), string('hi'), char(')'))('(hi)');
            expect(result0).toEqual({ ok: true, value: 'hi', index: 4 });
        });

        it('interleaved: Parse items separated by separators, keeping both in the result.', () => {
            const result0 = interleaved(digits, char('+'))('1+2');
            expect(result0).toEqual({ ok: true, value: [1, '+', 2], index: 3 });
        });

        it('last: Extract the last element from a parser result array.', () => {
            const result0 = last(sequence(char('a'), char('b')))('ab');
            expect(result0).toEqual({ ok: true, value: 'b', index: 2 });
        });

        it('left: Keep only the left result from a sequence.', () => {
            const result0 = left(
                string('hello'),
                string('world'),
            )('helloworld');
            expect(result0).toEqual({ ok: true, value: 'hello', index: 10 });
        });

        it('lexeme: Parser that consumes trailing whitespace.', () => {
            const result0 = lexeme(string('hello'))('hello   world');
            expect(result0).toEqual({ ok: true, value: 'hello', index: 8 });
        });

        it('many: still report what the repetition was expecting next.', () => {
            const result0 = many(char('a'))('aaa');
            expect(result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                index: 3,
            });
        });

        it('many1: One or more occurrences.', () => {
            const result0 = many1(char('a'))('aaa');
            expect(result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                index: 3,
            });
        });

        it('manyAtLeast: Parse at least n occurrences.', () => {
            const result0 = manyAtLeast(char('a'), 2)('aaa');
            expect(result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                index: 3,
            });
        });

        it('manyAtMost: Parse at most n occurrences (never fails).', () => {
            const result0 = manyAtMost(char('a'), 2)('aaa');
            expect(result0).toEqual({ ok: true, value: ['a', 'a'], index: 2 });
        });

        it('manyBetween: Parse between min and max occurrences.', () => {
            const result0 = manyBetween(char('a'), 1, 2)('aaa');
            expect(result0).toEqual({ ok: true, value: ['a', 'a'], index: 2 });
        });

        it('manyTill: Parse zero or more until terminator matches.', () => {
            const result0 = manyTill(char('a'), char('b'))('aaab');
            expect(result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                index: 4,
            });
        });

        it('map: Transform a parsed value through one or more functions.', () => {
            const result0 = map(digits, (n) => n * 2)('21');
            expect(result0).toEqual({ ok: true, value: 42, index: 2 });
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
                index: 3,
            });
            const result1 = node('number', { value: digits })('123');
            expect(result1).toEqual({
                ok: true,
                value: { type: 'number', value: 123 },
                index: 3,
            });
        });

        it('not: expectation in the final message.', () => {
            const result0 = not(string('hello'))('world');
            expect(result0).toEqual({ ok: true, value: null, index: 0 });
        });

        it('nth: Extract the nth element from a parser result array.', () => {
            const result0 = nth(
                sequence(char('a'), char('b'), char('c')),
                1,
            )('abc');
            expect(result0).toEqual({ ok: true, value: 'b', index: 3 });
        });

        it('optional: Make parser optional (return null on failure, without consuming input).', () => {
            const result0 = optional(string('hello'))('hello');
            expect(result0).toEqual({ ok: true, value: 'hello', index: 5 });
            const result1 = optional(string('hello'))('world');
            expect(result1).toEqual({ ok: true, value: null, index: 0 });
        });

        it('optionalConsume: Consume input if the parser matches, discarding the result.', () => {
            const result0 = optionalConsume(string('hi'))('hi there');
            expect(result0).toEqual({ ok: true, index: 2 });
        });

        it('optionalSeparatedBy: Parse items separated by a separator, allowing empty slots.', () => {
            const result0 = optionalSeparatedBy(digits, char(','))('1,2');
            expect(result0).toEqual({ ok: true, value: [1, 2], index: 3 });
        });

        it('outer: Extract outer values from a sequence of 3 parsers (skip middle).', () => {
            const result0 = outer(char('('), string('hi'), char(')'))('(hi)');
            expect(result0).toEqual({ ok: true, value: ['(', ')'], index: 4 });
        });

        it('padded: Parse content surrounded by optional whitespace.', () => {
            const result0 = padded(string('hi'))('  hi  ');
            expect(result0).toEqual({ ok: true, value: 'hi', index: 6 });
        });

        it('parenthesized: Parse content surrounded by parentheses.', () => {
            const result0 = parenthesized(string('hi'))('(hi)');
            expect(result0).toEqual({ ok: true, value: 'hi', index: 4 });
        });

        it('peek: Look ahead without consuming input.', () => {
            const result0 = peek(string('hello'))('hello world');
            expect(result0).toEqual({ ok: true, value: 'hello', index: 0 });
        });

        it('postfix: Apply zero or more postfix operators to an atom.', () => {
            const result0 = postfix(
                digits,
                map(char('!'), () => (n) => n * 2),
            )('3!');
            expect(result0).toEqual({ ok: true, value: 6, index: 2 });
        });

        it('prefix: Apply zero or more prefix operators to an atom.', () => {
            const result0 = prefix(
                map(char('-'), () => (n) => -n),
                digits,
            )('-3');
            expect(result0).toEqual({ ok: true, value: -3, index: 2 });
        });

        it('pure: Always succeed with a value without consuming input.', () => {
            const result0 = pure(42)('abc');
            expect(result0).toEqual({ ok: true, value: 42, index: 0 });
        });

        it('quoted: Parse content surrounded by single or double quotes.', () => {
            const result0 = quoted(string('hello'))('"hello"');
            expect(result0).toEqual({ ok: true, value: 'hello', index: 7 });
        });

        it('recover: Use fallback value when parser fails.', () => {
            const result0 = recover(string('hello'), 'default')('world');
            expect(result0).toEqual({ ok: true, value: 'default', index: 0 });
        });

        it('right: Keep only the right result from a sequence.', () => {
            const result0 = right(
                string('hello'),
                string('world'),
            )('helloworld');
            expect(result0).toEqual({ ok: true, value: 'world', index: 10 });
        });

        it('separatedBy: after it does not, the list ends before the separator.', () => {
            const result0 = separatedBy(digits, char(','))('1,2,3');
            expect(result0).toEqual({ ok: true, value: [1, 2, 3], index: 5 });
        });

        it('separatedBy1: Parse one or more items separated by a separator.', () => {
            const result0 = separatedBy1(digits, char(','))('1,2,3');
            expect(result0).toEqual({ ok: true, value: [1, 2, 3], index: 5 });
        });

        it('separatedEndBy: Parse zero or more items separated by a separator, allowing a trailing one.', () => {
            const result0 = separatedEndBy(digits, char(','))('1,2,3,');
            expect(result0).toEqual({ ok: true, value: [1, 2, 3], index: 6 });
        });

        it('separatedEndBy1: Parse one or more items separated by a separator, allowing a trailing one.', () => {
            const result0 = separatedEndBy1(digits, char(','))('1,2,3,');
            expect(result0).toEqual({ ok: true, value: [1, 2, 3], index: 6 });
        });

        it('separatedUntil: Parse items separated by a separator, up to a terminator.', () => {
            const result0 = separatedUntil(
                digits,
                char(','),
                char(';'),
            )('1,2,3;');
            expect(result0).toEqual({ ok: true, value: [1, 2, 3], index: 6 });
        });

        it('sequence: Parse a sequence of parsers and return all results as an array.', () => {
            const result0 = sequence(char('a'), char('b'), char('c'))('abc');
            expect(result0).toEqual({
                ok: true,
                value: ['a', 'b', 'c'],
                index: 3,
            });
        });

        it('skip: Skip a parser n times.', () => {
            const result0 = skip(char('a'), 2)('aabc');
            expect(result0).toEqual({ ok: true, value: null, index: 2 });
        });

        it('skipMany: Skip zero or more occurrences (never fails, returns null).', () => {
            const result0 = skipMany(char('a'))('aaabc');
            expect(result0).toEqual({ ok: true, value: null, index: 3 });
        });

        it('skipMany1: Skip one or more occurrences (fails if no matches).', () => {
            const result0 = skipMany1(char('a'))('aaabc');
            expect(result0).toEqual({ ok: true, value: null, index: 3 });
        });

        it('surrounded: Parse content surrounded by delimiters.', () => {
            const result0 = surrounded(
                char('['),
                string('hi'),
                char(']'),
            )('[hi]');
            expect(result0).toEqual({ ok: true, value: 'hi', index: 4 });
            const result1 = surrounded(char('a'), char('b'), char('c'))('abc');
            expect(result1).toEqual({ ok: true, value: 'b', index: 3 });
        });

        it('unless: Parse unless condition is true (inverse of guard).', () => {
            const result0 = unless(false, string('hello'))('hello');
            expect(result0).toEqual({ ok: true, value: 'hello', index: 5 });
            const result1 = unless(true, string('hello'))('hello');
            expect(result1).toEqual({ ok: true, value: null, index: 0 });
        });

        it('until: Parse zero or more until terminator matches, leaving the terminator unconsumed.', () => {
            const result0 = until(char('a'), char('b'))('aaab');
            expect(result0).toEqual({
                ok: true,
                value: ['a', 'a', 'a'],
                index: 3,
            });
        });

        it('validate: Validate parsed value with a predicate.', () => {
            const result0 = validate(digit, (n) => n > 5)('7');
            expect(result0).toEqual({ ok: true, value: 7, index: 1 });
            const result1 = validate(digit, (n) => n > 5)('3');
            expect(result1).toEqual({
                ok: false,
                index: 0,
                expected: ['valid value'],
            });
        });

        it('value: Replace parsed value with a constant.', () => {
            const result0 = value(string('true'), true)('true');
            expect(result0).toEqual({ ok: true, value: true, index: 4 });
            const result1 = value(string('null'), null)('null');
            expect(result1).toEqual({ ok: true, value: null, index: 4 });
        });

        it('when: Branch on a boolean parser result.', () => {
            const result0 = when(
                flag(char('*')),
                pure('many'),
                pure('one'),
            )('*rest');
            expect(result0).toEqual({ ok: true, value: 'many', index: 1 });
            const result1 = when(
                flag(char('*')),
                pure('many'),
                pure('one'),
            )('abc');
            expect(result1).toEqual({ ok: true, value: 'one', index: 0 });
        });
    });

    describe('core', () => {
        it('context: Creates a fresh context. {@link run} and {@link parse} make one per call.', () => {
            const result0 = context();
            expect(result0).toEqual({ furthest: -1, expected: [] });
        });

        it('context: them. Callers rely on that identity to skip allocating.', () => {
            const result0 = union(['digit'], ['digit']);
            expect(result0).toEqual(['digit']);
        });

        it('context: array every time without it being altered underneath.', () => {
            const ctx = context();
            record(ctx, 3, ['digit']);
            const result0 = ctx;
            expect(result0).toEqual({ furthest: 3, expected: ['digit'] });
        });

        it('error: 1-based line/column and the set of expectations at that offset.', () => {
            const result0 = new ParseError('a=1,b=x', 6, ['digit']).line;
            expect(result0).toEqual(1);
        });

        it('failure: later backtracked over.', () => {
            const result0 = failure(undefined, 3, 'digit');
            expect(result0).toEqual({
                ok: false,
                index: 3,
                expected: ['digit'],
            });
        });

        it('failure: avoiding a fresh array on every failure.', () => {
            const expected = ['digit'];
            const result0 = reject(undefined, 3, expected);
            expect(result0).toEqual({
                ok: false,
                index: 3,
                expected: ['digit'],
            });
        });

        it('format: Renders a parse failure as a source excerpt with a caret under the offset.', () => {
            const result0 = format('a=1,b=x', 6, ['digit']);
            expect(result0).toEqual(
                "1:7 expected digit, found 'x'\n  1 | a=1,b=x\n    |       ^",
            );
        });

        it('grammar: reported by name rather than overflowing the stack.', () => {
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

        it('label: be suppressed rather than leaking into the message.', () => {
            const result0 = label(char('x'), 'letter x')('');
            expect(result0).toEqual({
                ok: false,
                index: 0,
                expected: ['letter x'],
            });
        });

        it('lazy: Defers parser creation, useful for recursive grammars.', () => {
            const result0 = lazy(() => char('a'))('abc');
            expect(result0).toEqual({ ok: true, value: 'a', index: 1 });
        });

        it('locate: Converts a character offset into a 1-based line and column.', () => {
            const result0 = locate('a=1\nb=x', 5);
            expect(result0).toEqual({ index: 5, line: 2, column: 2 });
        });

        it('match: Pattern matching on a Result to handle success and failure cases.', () => {
            const result0 = match(success('hello', 5), {
                success: (v) => v,
                failure: () => 'failed',
            });
            expect(result0).toEqual('hello');
        });

        it('memoize: error message rather than silently weakening it.', () => {
            const memoDigits = memoize(digits);
            const result0 = memoDigits('123');
            expect(result0).toEqual({ ok: true, value: 123, index: 3 });
        });

        it('parse: offset, line, column, expectations and a formatted message.', () => {
            const result0 = parse(digits, '12x').ok;
            expect(result0).toEqual(false);
        });

        it('parser: recorded inside your parser reach the final error message.', () => {
            const result0 = create((input, index = 0) =>
                success('parsed', index + 6),
            )('hello world');
            expect(result0).toEqual({ ok: true, value: 'parsed', index: 6 });
        });

        it('run: point — if the parse fails or leaves input unconsumed.', () => {
            const result0 = run(string('hello'), 'hello');
            expect(result0).toEqual('hello');
        });

        it('success: Creates a successful result with a value and the offset reached in the input.', () => {
            const result0 = success('hello', 5);
            expect(result0).toEqual({ ok: true, value: 'hello', index: 5 });
        });
    });

    describe('primitives', () => {
        it('alphaNum: Parse a single alphanumeric character.', () => {
            const result0 = alphaNum('a1');
            expect(result0).toEqual({ ok: true, value: 'a', index: 1 });
            const result1 = alphaNum('1a');
            expect(result1).toEqual({ ok: true, value: '1', index: 1 });
        });

        it('alphaNums: Parse one or more alphanumeric characters as a string.', () => {
            const result0 = alphaNums('placeholder');
            expect(result0).toEqual({
                ok: true,
                value: 'placeholder',
                index: 11,
            });
        });

        it('anyChar: Parse any single character.', () => {
            const result0 = anyChar('abc');
            expect(result0).toEqual({ ok: true, value: 'a', index: 1 });
        });

        it('bool: Parse a boolean literal.', () => {
            const result0 = bool('true');
            expect(result0).toEqual({ ok: true, value: true, index: 4 });
            const result1 = bool('false');
            expect(result1).toEqual({ ok: true, value: false, index: 5 });
            const result2 = bool('trueABC');
            expect(result2).toEqual({ ok: true, value: true, index: 4 });
        });

        it('crlf: Parse CRLF line ending.', () => {
            const result0 = crlf('\r\nabc');
            expect(result0).toEqual({ ok: true, value: '\r\n', index: 2 });
        });

        it('digit: Parse a single digit and return as number.', () => {
            const result0 = digit('5abc');
            expect(result0).toEqual({ ok: true, value: 5, index: 1 });
        });

        it('digits: Parse one or more digits and return as a number.', () => {
            const result0 = digits('123');
            expect(result0).toEqual({ ok: true, value: 123, index: 3 });
        });

        it('eof: Match the end of the input.', () => {
            const result0 = eof('');
            expect(result0).toEqual({ ok: true, value: null, index: 0 });
        });

        it('eol: Parse end of line (\\n, \\r\\n, or EOF).', () => {
            const result0 = eol('\nabc');
            expect(result0).toEqual({ ok: true, value: '\n', index: 1 });
        });

        it('float: Parse a floating point number.', () => {
            const result0 = float('1.23');
            expect(result0).toEqual({ ok: true, value: 1.23, index: 4 });
            const result1 = float('-2.5');
            expect(result1).toEqual({ ok: true, value: -2.5, index: 4 });
            const result2 = float('1.23abc');
            expect(result2).toEqual({ ok: true, value: 1.23, index: 4 });
        });

        it('hexDigit: Parse a single hexadecimal digit.', () => {
            const result0 = hexDigit('fF9');
            expect(result0).toEqual({ ok: true, value: 'f', index: 1 });
        });

        it('hexDigits: Parse one or more hex digits as a string.', () => {
            const result0 = hexDigits('deadbeef');
            expect(result0).toEqual({ ok: true, value: 'deadbeef', index: 8 });
        });

        it('identifier: Parse an identifier — starts with letter or underscore, no leading digit, no hyphen.', () => {
            const result0 = identifier('variable_name');
            expect(result0).toEqual({
                ok: true,
                value: 'variable_name',
                index: 13,
            });
        });

        it('integer: Parse a signed integer.', () => {
            const result0 = integer('42');
            expect(result0).toEqual({ ok: true, value: 42, index: 2 });
            const result1 = integer('-7');
            expect(result1).toEqual({ ok: true, value: -7, index: 2 });
            const result2 = integer('123abc');
            expect(result2).toEqual({ ok: true, value: 123, index: 3 });
        });

        it('letter: Parse a single letter.', () => {
            const result0 = letter('abc');
            expect(result0).toEqual({ ok: true, value: 'a', index: 1 });
        });

        it('letters: Parse one or more letters as a string.', () => {
            const result0 = letters('placeholder');
            expect(result0).toEqual({
                ok: true,
                value: 'placeholder',
                index: 11,
            });
        });

        it('line: Parse until end of line.', () => {
            const result0 = line('hello\nworld');
            expect(result0).toEqual({ ok: true, value: 'hello', index: 5 });
        });

        it('literal: Parse a word-like value including hyphens.', () => {
            const result0 = literal('foo-bar');
            expect(result0).toEqual({ ok: true, value: 'foo-bar', index: 7 });
            const result1 = literal('123abc');
            expect(result1).toEqual({ ok: true, value: '123abc', index: 6 });
        });

        it('lowercase: Parse a single lowercase letter.', () => {
            const result0 = lowercase('abc');
            expect(result0).toEqual({ ok: true, value: 'a', index: 1 });
        });

        it('lowercases: Parse one or more lowercase letters as a string.', () => {
            const result0 = lowercases('placeholder');
            expect(result0).toEqual({
                ok: true,
                value: 'placeholder',
                index: 11,
            });
        });

        it('nl: Parse a newline character.', () => {
            const result0 = nl('\ntext');
            expect(result0).toEqual({ ok: true, value: '\n', index: 1 });
        });

        it('number: Parse an integer or float.', () => {
            const result0 = number('42');
            expect(result0).toEqual({ ok: true, value: 42, index: 2 });
            const result1 = number('3.14');
            expect(result1).toEqual({ ok: true, value: 3.14, index: 4 });
            const result2 = number('-7');
            expect(result2).toEqual({ ok: true, value: -7, index: 2 });
            const result3 = number('-2.5');
            expect(result3).toEqual({ ok: true, value: -2.5, index: 4 });
        });

        it('octDigit: Parse a single octal digit.', () => {
            const result0 = octDigit('7abc');
            expect(result0).toEqual({ ok: true, value: '7', index: 1 });
        });

        it('octDigits: Parse one or more octal digits as a string.', () => {
            const result0 = octDigits('755rest');
            expect(result0).toEqual({ ok: true, value: '755', index: 3 });
        });

        it('position: {@link locate} to attach line/column information to a parsed node.', () => {
            const result0 = position('abc');
            expect(result0).toEqual({ ok: true, value: 0, index: 0 });
            const result1 = right(string('ab'), position)('abc');
            expect(result1).toEqual({ ok: true, value: 2, index: 2 });
        });

        it('rest: Consume and return everything left in the input.', () => {
            const result0 = rest('abc');
            expect(result0).toEqual({ ok: true, value: 'abc', index: 3 });
        });

        it('space: Parse a single space character.', () => {
            const result0 = space(' abc');
            expect(result0).toEqual({ ok: true, value: ' ', index: 1 });
        });

        it('spaces: Parse one or more spaces as a string.', () => {
            const result0 = spaces('   abc');
            expect(result0).toEqual({ ok: true, value: '   ', index: 3 });
        });

        it('tab: Parse tab character.', () => {
            const result0 = tab('\ttext');
            expect(result0).toEqual({ ok: true, value: '\t', index: 1 });
        });

        it('uppercase: Parses a single uppercase letter.', () => {
            const result0 = uppercase('ABC');
            expect(result0).toEqual({ ok: true, value: 'A', index: 1 });
        });

        it('uppercases: Parse one or more uppercase letters as a string.', () => {
            const result0 = uppercases('ABCdef');
            expect(result0).toEqual({ ok: true, value: 'ABC', index: 3 });
        });

        it('whitespace: Parses a single whitespace character.', () => {
            const result0 = whitespace(' abc');
            expect(result0).toEqual({ ok: true, value: ' ', index: 1 });
        });

        it('whitespaces: Parse one or more whitespaces as a string.', () => {
            const result0 = whitespaces(' \t\nabc');
            expect(result0).toEqual({ ok: true, value: ' \t\n', index: 3 });
        });
    });

    describe('terminals', () => {
        it('char: Parse a specific character.', () => {
            const result0 = char('A')('ABC');
            expect(result0).toEqual({ ok: true, value: 'A', index: 1 });
        });

        it('charOf: Parse any character from a set.', () => {
            const result0 = charOf(['a', 'b', 'c'])('abc');
            expect(result0).toEqual({ ok: true, value: 'a', index: 1 });
        });

        it('noneOf: Parse any character not in the set.', () => {
            const result0 = noneOf(['a', 'b', 'c'])('xyz');
            expect(result0).toEqual({ ok: true, value: 'x', index: 1 });
        });

        it('oneOf: Parse one string from a set of strings (longest match wins).', () => {
            const result0 = oneOf(['hello', 'hell', 'help'])('helpful');
            expect(result0).toEqual({ ok: true, value: 'help', index: 4 });
        });

        it('regex: start and still carries meaning.', () => {
            const result0 = regex(/^\w+/)('hello world');
            expect(result0).toEqual({ ok: true, value: 'hello', index: 5 });
        });

        it('satisfy: Parse a character satisfying a predicate.', () => {
            const result0 = satisfy((c) => c === 'a')('abc');
            expect(result0).toEqual({ ok: true, value: 'a', index: 1 });
        });

        it('string: Parse a specific string.', () => {
            const result0 = string('hello')('hello world');
            expect(result0).toEqual({ ok: true, value: 'hello', index: 5 });
        });

        it('stringOf: Parse first character that exists in string (like charOf but for a string).', () => {
            const result0 = stringOf('abc')('abcdef');
            expect(result0).toEqual({ ok: true, value: 'a', index: 1 });
        });

        it('take: Take n characters.', () => {
            const result0 = take(3)('abcdef');
            expect(result0).toEqual({ ok: true, value: 'abc', index: 3 });
        });

        it('takeWhile: Takes characters while the predicate returns true.', () => {
            const result0 = takeWhile((c) => c !== 'x')('abcx');
            expect(result0).toEqual({ ok: true, value: 'abc', index: 3 });
        });

        it('token: strings that might be followed by any character.', () => {
            const result0 = token('let')('let x');
            expect(result0).toEqual({ ok: true, value: 'let', index: 4 });
            const result1 = token('let')('let1');
            expect(result1).toEqual({ ok: true, value: 'let', index: 3 });
            const result2 = token('let')('let  x');
            expect(result2).toEqual({ ok: true, value: 'let', index: 5 });
        });

        it('word: Use this when parsing keywords that should not be part of a longer identifier.', () => {
            const result0 = word('let')('let x');
            expect(result0).toEqual({ ok: true, value: 'let', index: 4 });
            const result1 = word('let')('let1');
            expect(result1).toEqual({
                ok: false,
                index: 3,
                expected: ['/(?!\\w)/'],
            });
            const result2 = word('if')('if (x)');
            expect(result2).toEqual({ ok: true, value: 'if', index: 3 });
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
            expect(result0).toEqual({ ok: true, value: 'xyz', index: 6 });
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
