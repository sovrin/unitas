import { assertType, describe, expect, it } from 'vitest';
import { satisfy } from './primitives';
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
});
