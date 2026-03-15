import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils.test';
import { skipMany1 } from './skipMany1';

describe('skipMany1', () => {
    it('should skip one or more occurrences and return null', () => {
        const parser1 = createTestParser('A');

        const parser = skipMany1(parser1);
        const result = parser('AAABBB');

        assertSuccess<null>(result, null, 'BBB');
    });

    it('should fail when no matches found', () => {
        const parser1 = createTestParser('A');

        const parser = skipMany1(parser1);
        const result = parser('BBB');

        assertFailure<null>(result);
    });

    it('should succeed with single match', () => {
        const parser1 = createTestParser('A');

        const parser = skipMany1(parser1);
        const result = parser('ABBB');

        assertSuccess<null>(result, null, 'BBB');
    });

    it('should require at least one match', () => {
        const parser1 = createTestParser('A');

        const parser = skipMany1(parser1);
        const result = parser('B');

        assertFailure<null>(result);
    });
});
