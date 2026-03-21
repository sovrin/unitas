import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { skip } from './skip';

describe('skip', () => {
    it('should skip exactly n occurrences', () => {
        const parser1 = createTestParser('A');
        const parser = skip(parser1, 3);
        const result = parser('AAAB');

        assertSuccess<null>(result, null, 'B');
    });

    it('should fail if not enough occurrences', () => {
        const parser1 = createTestParser('A');
        const parser = skip(parser1, 3);
        const result = parser('AB');

        assertFailure(result);
    });

    it('should skip zero occurrences', () => {
        const parser1 = createTestParser('A');
        const parser = skip(parser1, 0);
        const result = parser('ABC');

        assertSuccess<null>(result, null, 'ABC');
    });
});
