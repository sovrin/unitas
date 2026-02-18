import { describe, expect, it } from 'vitest';

import { assertResult } from '../../test/utils.test';
import { braced } from './braced';
import { literal } from './literal';

describe('braced', () => {
    it('should parse braced content', () => {
        const parser1 = literal('ABC');
        const parser = braced(parser1);
        const result = parser('{ABC}');

        assertResult<'ABC'>(result, ['ABC', '']);
    });

    it('should fail with uneven braces', () => {
        const parser1 = literal('ABC');
        const parser = braced(parser1);
        const result = parser('{ABC');

        assertResult<'ABC'>(result);
    });

    it('should handle empty braces', () => {
        const parser1 = literal('');
        const parser = braced(parser1);
        const result = parser('{}');
        expect(result).toEqual(['', '']);

        assertResult<''>(result, ['', '']);
    });
});
