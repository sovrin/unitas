import { describe, expect, it } from 'vitest';

import { assertResult, createTestParser } from '../../test/utils.test';
import { skip } from './skip';

describe('skip', () => {
    it('should skip exactly n occurrences', () => {
        const parser1 = createTestParser('A');
        const parser = skip(parser1, 3);
        const result = parser('AAAB');

        assertResult<null>(result, [null, 'B']);
    });

    it('should fail if not enough occurrences', () => {
        const parser1 = createTestParser('A');
        const parser = skip(parser1, 3);
        const result = parser('AB');

        expect(result).toBeNull();
    });

    it('should skip zero occurrences', () => {
        const parser1 = createTestParser('A');
        const parser = skip(parser1, 0);
        const result = parser('ABC');

        assertResult<null>(result, [null, 'ABC']);
    });
});
