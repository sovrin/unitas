import { describe, expect, it } from 'vitest';
import { attempt, between, bind, char, choice, lazy, literal, map, oneOf, Parser, pipe, regex, sequence } from '../src';
import { digit } from '../src/primitives';

describe('combinators', () => {
    describe('sequence', () => {
        it('should parse all parsers in sequence', () => {
            const parser = sequence(literal('hello'), char(' '), literal('world'));
            const result = parser('hello world!');
            expect(result).toEqual([['hello', ' ', 'world'], '!']);
        });

        it('should fail if any parser fails', () => {
            const parser = sequence(literal('hello'), char(' '), literal('world'));
            const result = parser('hello earth');
            expect(result).toBeNull();
        });

        it('should handle empty sequence', () => {
            const parser = sequence();
            const result = parser('anything');
            expect(result).toEqual([[], 'anything']);
        });

        it('should handle single parser', () => {
            const parser = sequence(literal('test'));
            const result = parser('testing');
            expect(result).toEqual([['test'], 'ing']);
        });

        it('should consume input progressively', () => {
            const parser = sequence(char('a'), char('b'), char('c'));
            const result = parser('abcdef');
            expect(result).toEqual([['a', 'b', 'c'], 'def']);
        });

        it('should maintain type safety for mixed types', () => {
            const numParser = map(regex(/\d+/), parseInt);
            const parser = sequence(literal('number:'), numParser);
            const result = parser('number:42rest');
            expect(result).toEqual([['number:', 42], 'rest']);
        });
    });

    describe('choice', () => {
        it('should try parsers in order and return first success', () => {
            const parser = choice(literal('hello'), literal('hi'), literal('hey'));
            const result = parser('hi there');
            expect(result).toEqual(['hi', ' there']);
        });

        it('should try all parsers if earlier ones fail', () => {
            const parser = choice(literal('hello'), literal('hi'), literal('hey'));
            const result = parser('hey there');
            expect(result).toEqual(['hey', ' there']);
        });

        it('should fail if all parsers fail', () => {
            const parser = choice(literal('hello'), literal('hi'), literal('hey'));
            const result = parser('goodbye');
            expect(result).toBeNull();
        });

        it('should handle single parser', () => {
            const parser = choice(literal('test'));
            const result = parser('testing');
            expect(result).toEqual(['test', 'ing']);
        });

        it('should handle empty choices', () => {
            const parser = choice();
            const result = parser('anything');
            expect(result).toBeNull();
        });

        it('should work with different parser types', () => {
            const parser = choice(regex(/\d+/), literal('word'), oneOf('abc'));

            expect(parser('123')).toEqual(['123', '']);
            expect(parser('word')).toEqual(['word', '']);
            expect(parser('a')).toEqual(['a', '']);
        });
    });

    describe('map', () => {
        it('should transform parser result with single transform', () => {
            const parser = map(regex(/\d+/), parseInt);
            const result = parser('42abc');
            expect(result).toEqual([42, 'abc']);
        });

        it('should chain multiple transforms', () => {
            const parser = map(
                regex(/\d+/),
                parseInt,
                (n: number) => n * 2,
                (n: number) => n.toString(),
            );
            const result = parser('21abc');
            expect(result).toEqual(['42', 'abc']);
        });

        it('should fail if underlying parser fails', () => {
            const parser = map(literal('hello'), (s) => s.toUpperCase());
            const result = parser('goodbye');
            expect(result).toBeNull();
        });

        it('should handle complex transformations', () => {
            const parser = map(
                sequence(regex(/\w+/), char('='), regex(/\d+/)),
                ([key, , value]: [string, string, string]) => ({ [key]: parseInt(value) }),
            );
            const result = parser('count=5;');
            expect(result).toEqual([{ count: 5 }, ';']);
        });

        it('should maintain original input consumption', () => {
            const parser = map(literal('test'), (s) => s.length);
            const result = parser('testing');
            expect(result).toEqual([4, 'ing']);
        });
    });

    describe('bind', () => {
        it('should use result of first parser to create second parser', () => {
            const parser = bind(oneOf('123'), (digit) => {
                const count = parseInt(digit);
                return map(regex(new RegExp(`[a-z]{${count}}`)), (s) => s);
            });

            const result = parser('2ab');
            expect(result).toEqual(['ab', '']);
        });

        it('should fail if first parser fails', () => {
            const parser = bind(literal('hello'), () => literal('world'));
            const result = parser('goodbye');
            expect(result).toBeNull();
        });

        it('should fail if second parser fails', () => {
            const parser = bind(literal('hello'), () => literal('world'));
            const result = parser('hello there');
            expect(result).toBeNull();
        });

        it('should handle complex dependencies', () => {
            const parser = bind(regex(/(\w+):/), (match) => {
                const key = match.slice(0, -1); // remove the ':'
                return map(regex(/\d+/), (value) => ({ [key]: parseInt(value) }));
            });

            const result = parser('count:42;');
            expect(result).toEqual([{ count: 42 }, ';']);
        });
    });

    describe('pipe', () => {
        const add1 = (x: number) => x + 1;
        const multiply2 = (x: number) => x * 2;
        const toString = (x: number) => x.toString();
        const toUpperCase = (s: string) => s.toUpperCase();

        it('should apply single function', () => {
            const pipeline = pipe(add1);
            expect(pipeline(5)).toBe(6);
        });

        it('should compose two functions', () => {
            const pipeline = pipe(add1, multiply2);
            expect(pipeline(3)).toBe(8); // (3 + 1) * 2 = 8
        });

        it('should compose three functions with type changes', () => {
            const pipeline = pipe(add1, multiply2, toString);
            expect(pipeline(2)).toBe('6'); // (2 + 1) * 2 = 6 → "6"
        });

        it('should compose four functions', () => {
            const pipeline = pipe(add1, multiply2, toString, toUpperCase);
            expect(pipeline(1)).toBe('4'); // (1 + 1) * 2 = 4 → "4" → "4"
        });

        it('should handle string transformations', () => {
            const addPrefix = (s: string) => `prefix_${s}`;
            const pipeline = pipe(toString, toUpperCase, addPrefix);
            expect(pipeline(42)).toBe('prefix_42');
        });

        it('should pipe value to each fn and transform', () => {
            const parser = map(
                sequence(digit, digit, digit),
                pipe(
                    (v) => v.map((n) => n + 1),
                    (v) => v.join('_'),
                ),
            );
            const result = parser('123');
            expect(result).toEqual(['2_3_4', '']);
        });
    });

    describe('lazy', () => {
        it('should defer parser creation', () => {
            let called = false;
            const parser = lazy(() => {
                called = true;
                return literal('test');
            });

            expect(called).toBe(false);
            const result = parser('testing');
            expect(called).toBe(true);
            expect(result).toEqual(['test', 'ing']);
        });

        it('should enable recursive parsers', () => {
            // Simple recursive parser for nested parentheses
            const paren: Parser<string> = lazy<string>(() => choice(between(char('('), paren, char(')')), char('x')));

            expect(paren('x')).toEqual(['x', '']);
            expect(paren('(x)')).toEqual(['x', '']);
            expect(paren('((x))')).toEqual(['x', '']);
        });

        it('should handle parser that fails', () => {
            const parser = lazy(() => literal('hello'));
            const result = parser('goodbye');
            expect(result).toBeNull();
        });
    });

    describe('attempt', () => {
        it('should behave like the underlying parser', () => {
            const parser = attempt(literal('test'));
            const result = parser('testing');
            expect(result).toEqual(['test', 'ing']);
        });

        it('should fail when underlying parser fails', () => {
            const parser = attempt(literal('test'));
            const result = parser('hello');
            expect(result).toBeNull();
        });

        it('should work with complex parsers', () => {
            const parser = attempt(sequence(literal('hello'), char(' '), literal('world')));
            const result = parser('hello world!');
            expect(result).toEqual([['hello', ' ', 'world'], '!']);
        });

        it('should maintain backtracking behavior', () => {
            // In this simple implementation, all parsers already backtrack
            const parser = choice(
                attempt(sequence(literal('hello'), literal('world'))),
                sequence(literal('hello'), literal(' world')),
            );

            const result = parser('hello world');
            expect(result).toEqual([['hello', ' world'], '']);
        });
    });

    describe('integration tests', () => {
        it('should combine multiple combinators', () => {
            // Parser for simple key-value pairs like "name=John,age=25"
            const keyValueParser = map(
                sequence(regex(/\w+/), char('='), choice(regex(/\d+/), regex(/\w+/))),
                ([key, , value]: [string, string, string]) => ({
                    key,
                    value: isNaN(parseInt(value)) ? value : parseInt(value),
                }),
            );

            const pairsParser = map(
                sequence(
                    keyValueParser,
                    map(sequence(char(','), keyValueParser), ([, pair]: [string, any]) => pair),
                ),
                ([first, second]: [any, any]) => [first, second],
            );

            const result = pairsParser('name=John,age=25');
            expect(result).toEqual([
                [
                    { key: 'name', value: 'John' },
                    { key: 'age', value: 25 },
                ],
                '',
            ]);
        });

        it('should handle nested choices and sequences', () => {
            const expr: Parser<number> = choice(
                map(regex(/\d+/), parseInt),
                map(
                    sequence(
                        char('('),
                        lazy<number>(() => expr),
                        char(')'),
                    ),
                    ([, value]: [string, number, string]) => value,
                ),
            );

            expect(expr('42')).toEqual([42, '']);
            expect(expr('(42)')).toEqual([42, '']);
            expect(expr('((42))')).toEqual([42, '']);
        });

        it('should work with bind for context-dependent parsing', () => {
            // Parser that reads a count, then that many characters
            const parser = bind(map(regex(/\d+/), parseInt), (count) =>
                bind(char(':'), () => map(regex(new RegExp(`.{${count}}`)), (chars) => ({ count, chars }))),
            );

            const result = parser('3:abc');
            expect(result).toEqual([{ count: 3, chars: 'abc' }, '']);
        });
    });
});
