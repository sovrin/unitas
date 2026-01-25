import { assertType, describe, expect, it } from 'vitest';
import {
    braced,
    bracketed,
    char,
    charIn,
    literal,
    noneOf,
    parenthesized,
    quoted,
    regex,
    take,
    takeUntil,
    takeWhile,
} from './terminals';
import { Result } from './types';

describe('terminals', () => {
    describe('literal', () => {
        it('should match exact string at beginning of input', () => {
            const parser = literal('test');
            const result = parser('testing');
            expect(result).toEqual(['test', 'ing']);

            assertType<Result<'test' | null>>(result);
        });

        it('should fail when string does not match', () => {
            const parser = literal('test');
            const result = parser('hello');
            expect(result).toBeNull();

            assertType<Result<'test' | null>>(result);
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

            assertType<Result<'' | null>>(result);
        });
    });

    describe('regex', () => {
        it('should match pattern at beginning of input', () => {
            const parser = regex(/\d+/);
            const result = parser('123abc');
            expect(result).toEqual(['123', 'abc']);

            assertType<Result<string | null>>(result);
        });

        it('should fail when pattern does not match at beginning', () => {
            const parser = regex(/\d+/);
            const result = parser('abc123');
            expect(result).toBeNull();

            assertType<Result<string | null>>(result);
        });

        it('should work with anchored patterns', () => {
            const parser = regex(/^[a-z]+/);
            const result = parser('hello123');
            expect(result).toEqual(['hello', '123']);

            assertType<Result<string | null>>(result);
        });

        it('should handle empty matches', () => {
            const parser = regex(/\d*/);
            const result = parser('abc');
            expect(result).toEqual(['', 'abc']);

            assertType<Result<string | null>>(result);
        });

        it('should throw error if a regex with global flag is being used', () => {
            expect(() => {
                regex(/\d*/g);
            }).toThrowError('Global flag is not supported in regex parsers');
        });
    });

    describe('char', () => {
        it('should match single character', () => {
            const parser = char('a');
            const result = parser('abc');
            expect(result).toEqual(['a', 'bc']);

            assertType<Result<'a' | null>>(result);
        });

        it('should fail when character does not match', () => {
            const parser = char('a');
            const result = parser('bcd');
            expect(result).toBeNull();

            assertType<Result<'a' | null>>(result);
        });

        it('should fail on empty input', () => {
            const parser = char('a');
            const result = parser('');
            expect(result).toBeNull();

            assertType<Result<'a' | null>>(result);
        });

        it('should throw if more then one character is given', () => {
            expect(() => {
                char('foobar' as unknown as 'f');
            }).toThrowError('char expects one character, but got foobar');
        });
    });

    describe('charIn', () => {
        it('should match character from allowed set', () => {
            const parser = charIn(['A', 'B', 'C'] as const);
            const result = parser('ABCDEFG');
            expect(result).toEqual(['A', 'BCDEFG']);

            assertType<Result<'A' | 'B' | 'C'>>(result);
        });

        it('should fail when character is not in set', () => {
            const parser = charIn(['A', 'B', 'C'] as const);
            const result = parser('DEFG');
            expect(result).toBeNull();

            assertType<Result<'A' | 'B' | 'C'>>(result);
        });

        it('should handle empty character set', () => {
            const parser = charIn([] as const);
            const result = parser('abc');
            expect(result).toBeNull();

            assertType<Result<never>>(result);
        });
    });

    describe('noneOf', () => {
        it('should match character not in forbidden set', () => {
            const parser = noneOf(['X', 'Y', 'Z'] as const);
            const result = parser('ABC');
            expect(result).toEqual(['A', 'BC']);

            assertType<Result<'X' | 'Y' | 'Z'>>(result);
        });

        it('should fail when character is in forbidden set', () => {
            const parser = noneOf(['X', 'Y', 'Z'] as const);
            const result = parser('XYZ');
            expect(result).toBeNull();

            assertType<Result<'X' | 'Y' | 'Z'>>(result);
        });

        it('should match any character when set is empty', () => {
            const parser = noneOf([]);
            const result = parser('ABC');
            expect(result).toEqual(['A', 'BC']);

            assertType<Result<never>>(result);
        });
    });

    describe('take', () => {
        it('should take specified number of characters', () => {
            const parser = take(3);
            const result = parser('abcdef');
            expect(result).toEqual(['abc', 'def']);

            assertType<Result<string>>(result);
        });

        it('should take all characters when count equals input length', () => {
            const parser = take(3);
            const result = parser('abc');
            expect(result).toEqual(['abc', '']);

            assertType<Result<string>>(result);
        });

        it('should fail when input is shorter than count', () => {
            const parser = take(5);
            const result = parser('abc');
            expect(result).toBeNull();

            assertType<Result<string>>(result);
        });

        it('should handle zero count', () => {
            const parser = take(0);
            const result = parser('abc');
            expect(result).toEqual(['', 'abc']);

            assertType<Result<string>>(result);
        });
    });

    describe('takeWhile', () => {
        it('should take characters while predicate is true', () => {
            const parser = takeWhile((c) => c >= '0' && c <= '9');
            const result = parser('123ABC');
            expect(result).toEqual(['123', 'ABC']);

            assertType<Result<string>>(result);
        });

        it('should return empty string when first character fails predicate', () => {
            const parser = takeWhile((c) => c >= '0' && c <= '9');
            const result = parser('ABC123');
            expect(result).toEqual(['', 'ABC123']);

            assertType<Result<string>>(result);
        });

        it('should take all characters when all satisfy predicate', () => {
            const parser = takeWhile((c) => c >= '0' && c <= '9');
            const result = parser('123');
            expect(result).toEqual(['123', '']);

            assertType<Result<string>>(result);
        });

        it('should handle empty input', () => {
            const parser = takeWhile(() => true);
            const result = parser('');
            expect(result).toEqual(['', '']);

            assertType<Result<string>>(result);
        });
    });

    describe('takeUntil', () => {
        it('should take characters until predicate is true', () => {
            const parser = takeUntil((c) => c === 'B');
            const result = parser('ABC');
            expect(result).toEqual(['A', 'BC']);

            assertType<Result<string>>(result);
        });

        it('should take all characters when predicate never true', () => {
            const parser = takeUntil((c) => c === 'D');
            const result = parser('ABC');
            expect(result).toEqual(['ABC', '']);

            assertType<Result<string>>(result);
        });

        it('should return empty string when first character satisfies predicate', () => {
            const parser = takeUntil((c) => c === 'A');
            const result = parser('ABC');
            expect(result).toEqual(['', 'ABC']);

            assertType<Result<string>>(result);
        });

        it('should handle empty input', () => {
            const parser = takeUntil(() => true);
            const result = parser('');
            expect(result).toEqual(['', '']);

            assertType<Result<string>>(result);
        });
    });

    describe('quoted', () => {
        it('should parse double-quoted content', () => {
            const parser1 = literal('ABC');
            const parser = quoted(parser1);
            const result = parser('"ABC"');
            expect(result).toEqual(['ABC', '']);

            assertType<Result<'ABC'>>(result);
        });

        it('should parse single-quoted content', () => {
            const parser1 = literal('ABC');
            const parser = quoted(parser1);
            const result = parser("'ABC'");
            expect(result).toEqual(['ABC', '']);

            assertType<Result<'ABC'>>(result);
        });

        it('should fail with mismatched quotes', () => {
            const parser1 = literal('ABC');
            const parser = quoted(parser1);
            const result = parser('\'ABC"');
            expect(result).toBeNull();

            assertType<Result<'ABC'>>(result);
        });

        it('should handle empty quoted strings', () => {
            const parser1 = literal('');
            const parser = quoted(parser1);
            const result = parser('""');
            expect(result).toEqual(['', '']);

            assertType<Result<''>>(result);
        });
    });

    describe('parenthesized', () => {
        it('should parse parenthesized content', () => {
            const parser1 = literal('ABC');
            const parser = parenthesized(parser1);
            const result = parser('(ABC)');
            expect(result).toEqual(['ABC', '']);

            assertType<Result<'ABC'>>(result);
        });

        it('should fail with uneven parentheses', () => {
            const parser1 = literal('ABC');
            const parser = parenthesized(parser1);
            const result = parser('(ABC');
            expect(result).toBeNull();

            assertType<Result<'ABC'>>(result);
        });

        it('should handle empty parentheses', () => {
            const parser1 = literal('');
            const parser = parenthesized(parser1);
            const result = parser('()');
            expect(result).toEqual(['', '']);

            assertType<Result<''>>(result);
        });
    });

    describe('braced', () => {
        it('should parse braced content', () => {
            const parser1 = literal('ABC');
            const parser = braced(parser1);
            const result = parser('{ABC}');
            expect(result).toEqual(['ABC', '']);

            assertType<Result<'ABC'>>(result);
        });

        it('should fail with uneven braces', () => {
            const parser1 = literal('ABC');
            const parser = braced(parser1);
            const result = parser('{ABC');
            expect(result).toBeNull();

            assertType<Result<'ABC'>>(result);
        });

        it('should handle empty braces', () => {
            const parser1 = literal('');
            const parser = braced(parser1);
            const result = parser('{}');
            expect(result).toEqual(['', '']);

            assertType<Result<''>>(result);
        });
    });

    describe('bracketed', () => {
        it('should parse bracketed content', () => {
            const parser1 = literal('ABC');
            const parser = bracketed(parser1);
            const result = parser('[ABC]');
            expect(result).toEqual(['ABC', '']);

            assertType<Result<'ABC'>>(result);
        });

        it('should fail with uneven brackets', () => {
            const parser1 = literal('ABC');
            const parser = bracketed(parser1);
            const result = parser('[ABC');
            expect(result).toBeNull();

            assertType<Result<'ABC'>>(result);
        });

        it('should handle empty brackets', () => {
            const parser1 = literal('');
            const parser = bracketed(parser1);
            const result = parser('[]');
            expect(result).toEqual(['', '']);

            assertType<Result<''>>(result);
        });
    });
});
