import { describe, expect, it } from 'vitest';
import {
    char,
    failure,
    grammar,
    literal,
    noneOf,
    oneOf,
    parse,
    regex,
    satisfy,
    success,
    take,
    takeUntil,
    takeWhile,
} from '../src';

describe('core', () => {
    describe('parse', () => {
        it('should return parsed value when parser succeeds and consumes all input', () => {
            const parser = literal('hello');
            const result = parse(parser, 'hello');
            expect(result).toBe('hello');
        });

        it('should return null when parser fails', () => {
            const parser = literal('hello');
            const result = parse(parser, 'world');
            expect(result).toBeNull();
        });

        it('should return null when parser succeeds but does not consume all input', () => {
            const parser = literal('hello');
            const result = parse(parser, 'hello world');
            expect(result).toBeNull();
        });

        it('should handle whitespace at the end of input', () => {
            const parser = literal('hello');
            const result = parse(parser, 'hello   ');
            expect(result).toBe('hello');
        });
    });

    describe('literal', () => {
        it('should match exact string at beginning of input', () => {
            const parser = literal('test');
            const result = parser('testing');
            expect(result).toEqual(['test', 'ing']);
        });

        it('should fail when string does not match', () => {
            const parser = literal('test');
            const result = parser('hello');
            expect(result).toBeNull();
        });

        it('should match entire input', () => {
            const parser = literal('hello');
            const result = parser('hello');
            expect(result).toEqual(['hello', '']);
        });

        it('should handle empty string literal', () => {
            const parser = literal('');
            const result = parser('anything');
            expect(result).toEqual(['', 'anything']);
        });
    });

    describe('regex', () => {
        it('should match pattern at beginning of input', () => {
            const parser = regex(/\d+/);
            const result = parser('123abc');
            expect(result).toEqual(['123', 'abc']);
        });

        it('should fail when pattern does not match at beginning', () => {
            const parser = regex(/\d+/);
            const result = parser('abc123');
            expect(result).toBeNull();
        });

        it('should work with anchored patterns', () => {
            const parser = regex(/^[a-z]+/);
            const result = parser('hello123');
            expect(result).toEqual(['hello', '123']);
        });

        it('should handle empty matches', () => {
            const parser = regex(/\d*/);
            const result = parser('abc');
            expect(result).toEqual(['', 'abc']);
        });
    });

    describe('char', () => {
        it('should match single character', () => {
            const parser = char('a');
            const result = parser('abc');
            expect(result).toEqual(['a', 'bc']);
        });

        it('should fail when character does not match', () => {
            const parser = char('a');
            const result = parser('bcd');
            expect(result).toBeNull();
        });

        it('should fail on empty input', () => {
            const parser = char('a');
            const result = parser('');
            expect(result).toBeNull();
        });
    });

    describe('satisfy', () => {
        it('should match character that satisfies predicate', () => {
            const parser = satisfy((c) => c >= '0' && c <= '9');
            const result = parser('5abc');
            expect(result).toEqual(['5', 'abc']);
        });

        it('should fail when character does not satisfy predicate', () => {
            const parser = satisfy((c) => c >= '0' && c <= '9');
            const result = parser('abc');
            expect(result).toBeNull();
        });

        it('should fail on empty input', () => {
            const parser = satisfy((c) => true);
            const result = parser('');
            expect(result).toBeNull();
        });
    });

    describe('oneOf', () => {
        it('should match character from allowed set', () => {
            const parser = oneOf('aeiou');
            const result = parser('elephant');
            expect(result).toEqual(['e', 'lephant']);
        });

        it('should fail when character is not in set', () => {
            const parser = oneOf('aeiou');
            const result = parser('xyz');
            expect(result).toBeNull();
        });

        it('should handle empty character set', () => {
            const parser = oneOf('');
            const result = parser('abc');
            expect(result).toBeNull();
        });
    });

    describe('noneOf', () => {
        it('should match character not in forbidden set', () => {
            const parser = noneOf('xyz');
            const result = parser('abc');
            expect(result).toEqual(['a', 'bc']);
        });

        it('should fail when character is in forbidden set', () => {
            const parser = noneOf('xyz');
            const result = parser('xyz');
            expect(result).toBeNull();
        });

        it('should match any character when set is empty', () => {
            const parser = noneOf('');
            const result = parser('abc');
            expect(result).toEqual(['a', 'bc']);
        });
    });

    describe('take', () => {
        it('should take specified number of characters', () => {
            const parser = take(3);
            const result = parser('abcdef');
            expect(result).toEqual(['abc', 'def']);
        });

        it('should take all characters when count equals input length', () => {
            const parser = take(3);
            const result = parser('abc');
            expect(result).toEqual(['abc', '']);
        });

        it('should fail when input is shorter than count', () => {
            const parser = take(5);
            const result = parser('abc');
            expect(result).toBeNull();
        });

        it('should handle zero count', () => {
            const parser = take(0);
            const result = parser('abc');
            expect(result).toEqual(['', 'abc']);
        });
    });

    describe('takeWhile', () => {
        it('should take characters while predicate is true', () => {
            const parser = takeWhile((c) => c >= '0' && c <= '9');
            const result = parser('123abc');
            expect(result).toEqual(['123', 'abc']);
        });

        it('should return empty string when first character fails predicate', () => {
            const parser = takeWhile((c) => c >= '0' && c <= '9');
            const result = parser('abc123');
            expect(result).toEqual(['', 'abc123']);
        });

        it('should take all characters when all satisfy predicate', () => {
            const parser = takeWhile((c) => c >= '0' && c <= '9');
            const result = parser('123');
            expect(result).toEqual(['123', '']);
        });

        it('should handle empty input', () => {
            const parser = takeWhile((c) => true);
            const result = parser('');
            expect(result).toEqual(['', '']);
        });
    });

    describe('takeUntil', () => {
        it('should take characters until predicate is true', () => {
            const parser = takeUntil((c) => c === ' ');
            const result = parser('hello world');
            expect(result).toEqual(['hello', ' world']);
        });

        it('should take all characters when predicate never true', () => {
            const parser = takeUntil((c) => c === 'x');
            const result = parser('hello');
            expect(result).toEqual(['hello', '']);
        });

        it('should return empty string when first character satisfies predicate', () => {
            const parser = takeUntil((c) => c === 'h');
            const result = parser('hello');
            expect(result).toEqual(['', 'hello']);
        });

        it('should handle empty input', () => {
            const parser = takeUntil((c) => true);
            const result = parser('');
            expect(result).toEqual(['', '']);
        });
    });

    describe('grammar', () => {
        it('should create recursive parsers', () => {
            interface TestGrammar {
                digit: string;
                number: string;
            }

            const g = grammar<TestGrammar>({
                digit: () => oneOf('0123456789'),
                number: () => takeWhile((c) => c >= '0' && c <= '9'),
            });

            expect(g.digit('5abc')).toEqual(['5', 'abc']);
            expect(g.number('123abc')).toEqual(['123', 'abc']);
        });

        it('should handle circular references', () => {
            interface TestGrammar {
                a: string;
                b: string;
            }

            // wrong
            const g = grammar<TestGrammar>({
                a: () => literal('a'),
                b: () => literal('b'),
            });

            expect(g.a('abc')).toEqual(['a', 'bc']);
            expect(g.b('bcd')).toEqual(['b', 'cd']);
        });
    });

    describe('success and failure helpers', () => {
        it('should create successful parse result', () => {
            const result = success('test', 'remaining');
            expect(result).toEqual(['test', 'remaining']);
        });

        it('should create failed parse result', () => {
            const result = failure();
            expect(result).toBeNull();
        });
    });
});
