import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { inner } from './inner';

describe('inner', () => {
    const parser1 = createTestParser('A');
    const parser2 = createTestParser('B');
    const parser3 = createTestParser('C');

    it('should return the inner parser result', () => {
        const parser = inner(parser1, parser2, parser3);
        const result = parser('ABC');

        assertSuccess<'B'>(result, 'B', '');
    });

    it('should fail if first parser fails', () => {
        const parser = inner(parser1, parser2, parser3);
        const result = parser('[content)');

        assertFailure<'B'>(result);
    });

    it('should fail if inner parser fails', () => {
        const parser = inner(parser1, parser2, parser3);
        const result = parser('(wrong)');

        assertFailure<'B'>(result);
    });

    it('should fail if last parser fails', () => {
        const parser = inner(parser1, parser2, parser3);
        const result = parser('(content]');

        assertFailure<'B'>(result);
    });
});
