import { describe, expect, it } from 'vitest';
import { atLeast, atMost, char, count, exactly, literal, many, many1, optional, optionalMaybe, range } from '../src';

describe('repetition', () => {
    describe('many', () => {
        it('should parse zero occurrences', () => {
            const parser = many(char('a'));
            const result = parser('bcd');

            expect(result).toEqual([[], 'bcd']);
        });

        it('should parse one occurrence', () => {
            const parser = many(char('a'));
            const result = parser('abcd');

            expect(result).toEqual([['a'], 'bcd']);
        });

        it('should parse multiple occurrences', () => {
            const parser = many(char('a'));
            const result = parser('aaabcd');

            expect(result).toEqual([['a', 'a', 'a'], 'bcd']);
        });

        it('should handle empty input', () => {
            const parser = many(char('a'));
            const result = parser('');

            expect(result).toEqual([[], '']);
        });

        it('should prevent infinite loops with non-consuming parsers', () => {
            const nonConsumingParser = () => ['', 'test'] as [string, string];
            const parser = many(nonConsumingParser);
            const result = parser('test');

            expect(result).toEqual([[], 'test']);
        });

        it('should work with literal parsers', () => {
            const parser = many(literal('ab'));
            const result = parser('ababab cd');

            expect(result).toEqual([['ab', 'ab', 'ab'], ' cd']);
        });
    });

    describe('many1', () => {
        it('should fail on zero occurrences', () => {
            const parser = many1(char('a'));
            const result = parser('bcd');

            expect(result).toBeNull();
        });

        it('should parse one occurrence', () => {
            const parser = many1(char('a'));
            const result = parser('abcd');

            expect(result).toEqual([['a'], 'bcd']);
        });

        it('should parse multiple occurrences', () => {
            const parser = many1(char('a'));
            const result = parser('aaabcd');

            expect(result).toEqual([['a', 'a', 'a'], 'bcd']);
        });

        it('should fail on empty input', () => {
            const parser = many1(char('a'));
            const result = parser('');

            expect(result).toBeNull();
        });

        it('should work with literal parsers', () => {
            const parser = many1(literal('xyz'));
            const result = parser('xyzxyz end');

            expect(result).toEqual([['xyz', 'xyz'], ' end']);
        });
    });

    describe('count', () => {
        it('should parse exactly n occurrences', () => {
            const parser = count(char('a'), 3);
            const result = parser('aaabcd');

            expect(result).toEqual([['a', 'a', 'a'], 'bcd']);
        });

        it('should fail if fewer than n occurrences', () => {
            const parser = count(char('a'), 3);
            const result = parser('aabcd');

            expect(result).toBeNull();
        });

        it('should parse exactly n and leave remainder', () => {
            const parser = count(char('a'), 2);
            const result = parser('aaaaa');

            expect(result).toEqual([['a', 'a'], 'aaa']);
        });

        it('should handle count of zero', () => {
            const parser = count(char('a'), 0);
            const result = parser('aaabcd');

            expect(result).toEqual([[], 'aaabcd']);
        });

        it('should fail on empty input when count > 0', () => {
            const parser = count(char('a'), 2);
            const result = parser('');

            expect(result).toBeNull();
        });
    });

    describe('exactly', () => {
        it('should work the same as count', () => {
            const countParser = count(char('x'), 4);
            const exactlyParser = exactly(char('x'), 4);
            const input = 'xxxxyz';

            const countResult = countParser(input);
            const exactlyResult = exactlyParser(input);

            expect(exactlyResult).toEqual(countResult);
            expect(exactlyResult).toEqual([['x', 'x', 'x', 'x'], 'yz']);
        });
    });

    describe('atMost', () => {
        it('should parse up to n occurrences', () => {
            const parser = atMost(char('a'), 3);
            const result = parser('aabcd');

            expect(result).toEqual([['a', 'a'], 'bcd']);
        });

        it('should parse exactly n occurrences when available', () => {
            const parser = atMost(char('a'), 3);
            const result = parser('aaabcd');

            expect(result).toEqual([['a', 'a', 'a'], 'bcd']);
        });

        it('should not parse more than n occurrences', () => {
            const parser = atMost(char('a'), 2);
            const result = parser('aaaaaa');

            expect(result).toEqual([['a', 'a'], 'aaaa']);
        });

        it('should parse zero occurrences', () => {
            const parser = atMost(char('a'), 3);
            const result = parser('bcd');

            expect(result).toEqual([[], 'bcd']);
        });

        it('should handle limit of zero', () => {
            const parser = atMost(char('a'), 0);
            const result = parser('aaabcd');

            expect(result).toEqual([[], 'aaabcd']);
        });
    });

    describe('atLeast', () => {
        it('should parse at least n occurrences', () => {
            const parser = atLeast(char('a'), 2);
            const result = parser('aaabcd');

            expect(result).toEqual([['a', 'a', 'a'], 'bcd']);
        });

        it('should parse exactly n occurrences', () => {
            const parser = atLeast(char('a'), 2);
            const result = parser('aabcd');

            expect(result).toEqual([['a', 'a'], 'bcd']);
        });

        it('should fail if fewer than n occurrences', () => {
            const parser = atLeast(char('a'), 3);
            const result = parser('aabcd');

            expect(result).toBeNull();
        });

        it('should handle minimum of zero', () => {
            const parser = atLeast(char('a'), 0);
            const result = parser('bcd');

            expect(result).toEqual([[], 'bcd']);
        });

        it('should parse many more than minimum', () => {
            const parser = atLeast(char('a'), 2);
            const result = parser('aaaaaa');

            expect(result).toEqual([['a', 'a', 'a', 'a', 'a', 'a'], '']);
        });
    });

    describe('range', () => {
        it('should parse within range', () => {
            const parser = range(char('a'), 2, 4);
            const result = parser('aaabcd');

            expect(result).toEqual([['a', 'a', 'a'], 'bcd']);
        });

        it('should parse minimum required', () => {
            const parser = range(char('a'), 2, 4);
            const result = parser('aabcd');

            expect(result).toEqual([['a', 'a'], 'bcd']);
        });

        it('should parse maximum allowed', () => {
            const parser = range(char('a'), 2, 4);
            const result = parser('aaaabcd');

            expect(result).toEqual([['a', 'a', 'a', 'a'], 'bcd']);
        });

        it('should not parse more than maximum', () => {
            const parser = range(char('a'), 1, 3);
            const result = parser('aaaaaa');

            expect(result).toEqual([['a', 'a', 'a'], 'aaa']);
        });

        it('should fail if fewer than minimum', () => {
            const parser = range(char('a'), 3, 5);
            const result = parser('aabcd');

            expect(result).toBeNull();
        });

        it('should handle equal min and max', () => {
            const parser = range(char('a'), 3, 3);
            const result = parser('aaabcd');

            expect(result).toEqual([['a', 'a', 'a'], 'bcd']);
        });
    });

    describe('optional', () => {
        it('should return parsed value when parser succeeds', () => {
            const parser = optional(char('a'), 'default');
            const result = parser('abc');

            expect(result).toEqual(['a', 'bc']);
        });

        it('should return default value when parser fails', () => {
            const parser = optional(char('a'), 'default');
            const result = parser('bcd');

            expect(result).toEqual(['default', 'bcd']);
        });

        it('should not consume input when parser fails', () => {
            const parser = optional(literal('hello'), 'world');
            const result = parser('goodbye');

            expect(result).toEqual(['world', 'goodbye']);
        });

        it('should handle empty input', () => {
            const parser = optional(char('a'), 'empty');
            const result = parser('');

            expect(result).toEqual(['empty', '']);
        });

        it('should work with complex default values', () => {
            const parser = optional<string | object>(char('x'), { default: true, value: 42 });
            const result = parser('y');

            expect(result).toEqual([{ default: true, value: 42 }, 'y']);
        });
    });

    describe('optionalMaybe', () => {
        it('should return parsed value when parser succeeds', () => {
            const parser = optionalMaybe(char('a'));
            const result = parser('abc');

            expect(result).toEqual(['a', 'bc']);
        });

        it('should return null when parser fails', () => {
            const parser = optionalMaybe(char('a'));
            const result = parser('bcd');

            expect(result).toEqual([null, 'bcd']);
        });

        it('should not consume input when parser fails', () => {
            const parser = optionalMaybe(literal('hello'));
            const result = parser('goodbye');

            expect(result).toEqual([null, 'goodbye']);
        });

        it('should handle empty input', () => {
            const parser = optionalMaybe(char('a'));
            const result = parser('');

            expect(result).toEqual([null, '']);
        });

        it('should preserve original type when successful', () => {
            const parser = optionalMaybe(literal('test'));
            const result = parser('test123');

            expect(result).toEqual(['test', '123']);
        });
    });

    describe('integration tests', () => {
        it('should combine multiple repetition parsers', () => {
            // Parse at least 2 'a's followed by exactly 3 'b's
            const aParser = atLeast(char('a'), 2);
            const bParser = exactly(char('b'), 3);

            const aResult = aParser('aaabbbcd');
            expect(aResult).toEqual([['a', 'a', 'a'], 'bbbcd']);

            const bResult = bParser(aResult![1]);
            expect(bResult).toEqual([['b', 'b', 'b'], 'cd']);
        });

        it('should handle nested repetitions', () => {
            // Parse multiple groups of 2 'x's
            const twoXs = exactly(char('x'), 2);
            const manyTwoXs = many(twoXs);

            const result = manyTwoXs('xxxxxx y');
            expect(result).toEqual([
                [
                    ['x', 'x'],
                    ['x', 'x'],
                    ['x', 'x'],
                ],
                ' y',
            ]);
        });
    });
});
