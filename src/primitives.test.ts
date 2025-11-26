import { assertType, describe, expect, it } from 'vitest';
import { digit, digits } from './primitives';
import { Result } from './types';

describe('primitives', () => {
    describe('satisfy', () => {
        it('should match character that satisfies predicate', () => {
            const parser = satisfy((c) => c >= '0' && c <= '9');
            const result = parser('5abc');
            expect(result).toEqual(['5', 'abc']);

            assertType<Result<string>>(result);
        });

        it('should fail when character does not satisfy predicate', () => {
            const parser = satisfy((c) => c >= '0' && c <= '9');
            const result = parser('abc');
            expect(result).toBeNull();

            assertType<Result<string>>(result);
        });

        it('should fail on empty input', () => {
            const parser = satisfy(() => true);
            const result = parser('');
            expect(result).toBeNull();

            assertType<Result<string>>(result);
        });
    });

    describe('digit', () => {
        it('should parse single digit and return number', () => {
            expect(digit('5abc')).toEqual([5, 'abc']);
            expect(digit('0xyz')).toEqual([0, 'xyz']);
            expect(digit('9')).toEqual([9, '']);
        });

        it('should fail on non-digit characters', () => {
            expect(digit('abc')).toBeNull();
            expect(digit('!')).toBeNull();
            expect(digit('')).toBeNull();
        });

        it('should only parse first digit', () => {
            expect(digit('123')).toEqual([1, '23']);
        });
    });

    describe('digits', () => {
        it('should parse multiple digits and return number', () => {
            expect(digits('123abc')).toEqual([123, 'abc']);
            expect(digits('42')).toEqual([42, '']);
            expect(digits('007xyz')).toEqual([7, 'xyz']);
        });

        it('should fail when no digits found', () => {
            expect(digits('abc')).toBeNull();
            expect(digits('')).toBeNull();
        });

        it('should handle single digit', () => {
            expect(digits('5abc')).toEqual([5, 'abc']);
        });

        it('should handle large numbers', () => {
            expect(digits('1234567890')).toEqual([1234567890, '']);
        });

        it('should match the expected type', () => {
            const result = digits('1');
            expect(result).toEqual([1, '']);

            assertType<Result<number>>(result);
        });
    });
});
