import { describe, it } from 'vitest';

import { assertSuccess, createTestParser } from '../../test/utils.test';
import { skipMany } from './skipMany';

describe('skipMany', () => {
    it('should skip many occurrences and return null', () => {
        const parser1 = createTestParser('A');
        const parser = skipMany(parser1);
        const result = parser('AAABBB');

        assertSuccess<null>(result, null, 'BBB');
    });

    it('should return null even when no matches found', () => {
        const parser1 = createTestParser('A');
        const parser = skipMany(parser1);
        const result = parser('BBB');

        assertSuccess<null>(result, null, 'BBB');
    });

    it('should handle empty input', () => {
        const parser1 = createTestParser('A');
        const parser = skipMany(parser1);
        const result = parser('');

        assertSuccess<null>(result, null, '');
    });
});
