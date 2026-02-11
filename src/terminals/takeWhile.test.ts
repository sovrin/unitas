import { describe, it } from 'vitest';
import { takeWhile } from './takeWhile';
import { assertResult } from '../../test/utils.test';

describe('takeWhile', () => {
    it('should take characters while predicate is true', () => {
        const parser = takeWhile((c) => c >= '0' && c <= '9');
        const result = parser('123ABC');

        assertResult<string>(result, ['123', 'ABC']);
    });

    it('should return empty string when first character fails predicate', () => {
        const parser = takeWhile((c) => c >= '0' && c <= '9');
        const result = parser('ABC123');

        assertResult<string>(result, ['', 'ABC123']);
    });

    it('should take all characters when all satisfy predicate', () => {
        const parser = takeWhile((c) => c >= '0' && c <= '9');
        const result = parser('123');

        assertResult<string>(result, ['123', '']);
    });

    it('should handle empty input', () => {
        const parser = takeWhile(() => true);
        const result = parser('');

        assertResult<string>(result, ['', '']);
    });
});
