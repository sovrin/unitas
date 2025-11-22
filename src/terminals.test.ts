import { assertType, describe, expect, it } from 'vitest';
import { char, literal, regex } from './terminals';
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
});
