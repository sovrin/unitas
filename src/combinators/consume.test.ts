import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { consume } from './consume';

describe('consume', () => {
    it('should consume parser result and return null', () => {
        const parser1 = createTestParser('A');
        const parser = consume(parser1);
        const result = parser('ABBB');

        assertSuccess<unknown>(result, null, 'BBB');
    });

    it('should fail when underlying parser fails', () => {
        const parser1 = createTestParser('A');
        const parser = consume(parser1);
        const result = parser('BBB');

        assertFailure<null>(result);
    });
});
