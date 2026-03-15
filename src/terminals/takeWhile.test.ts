import { describe, it } from 'vitest';

import { assertSuccess } from '../../test/utils.test';
import { takeWhile } from './takeWhile';

describe('takeWhile', () => {
    it('should take characters while predicate is true', () => {
        const parser = takeWhile((c) => c >= '0' && c <= '9');
        const result = parser('123ABC');

        assertSuccess<string>(result, '123', 'ABC');
    });

    it('should return empty string when first character fails predicate', () => {
        const parser = takeWhile((c) => c >= '0' && c <= '9');
        const result = parser('ABC123');

        assertSuccess<string>(result, '', 'ABC123');
    });

    it('should take all characters when all satisfy predicate', () => {
        const parser = takeWhile((c) => c >= '0' && c <= '9');
        const result = parser('123');

        assertSuccess<string>(result, '123', '');
    });

    it('should handle empty input', () => {
        const parser = takeWhile(() => true);
        const result = parser('');

        assertSuccess<string>(result, '', '');
    });
});
