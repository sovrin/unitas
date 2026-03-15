import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils.test';
import { not } from './not';

describe('not', () => {
    it('should succeed when parser fails', () => {
        const parser1 = createTestParser('A');
        const parser = not(parser1);
        const result = parser('BCD');

        assertSuccess<null>(result, null, 'BCD');
    });

    it('should fail when parser succeeds', () => {
        const parser1 = createTestParser('A');
        const parser = not(parser1);
        const result = parser('ABC');

        assertFailure(result);
    });

    it('should not consume input when failing due to parser success', () => {
        const parser1 = createTestParser('A');
        const parser = not(parser1);
        const result = parser('ABC');

        assertFailure(result);
    });
});
