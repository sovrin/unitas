import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { peek } from './peek';

describe('peek', () => {
    it('should succeed when parser matches without consuming input', () => {
        const parser1 = createTestParser('A');
        const parser = peek(parser1);
        const result = parser('AB');

        assertSuccess<'A'>(result, 'A', 'AB');
    });

    it('should fail when peek parser does not match', () => {
        const parser1 = createTestParser('A');
        const parser = peek(parser1);
        const result = parser('BC');

        assertFailure<'A'>(result);
    });

    it('should handle empty input', () => {
        const parser1 = createTestParser('A');
        const parser = peek(parser1);
        const result = parser('');

        assertFailure<'A'>(result);
    });
});
