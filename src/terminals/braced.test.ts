import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils.test';
import { braced } from './braced';
import { literal } from './literal';

describe('braced', () => {
    it('should parse braced content', () => {
        const parser1 = literal('ABC');
        const parser = braced(parser1);
        const result = parser('{ABC}');

        assertSuccess<'ABC'>(result, 'ABC', '');
    });

    it('should fail with uneven braces', () => {
        const parser1 = literal('ABC');
        const parser = braced(parser1);
        const result = parser('{ABC');

        assertFailure<'ABC'>(result);
    });

    it('should handle empty braces', () => {
        const parser1 = literal('');
        const parser = braced(parser1);
        const result = parser('{}');

        assertSuccess<''>(result, '', '');
    });
});
