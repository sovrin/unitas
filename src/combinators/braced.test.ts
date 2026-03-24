import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { string } from '../terminals/string';
import { braced } from './braced';

describe('braced', () => {
    it('should parse braced content', () => {
        const parser1 = string('ABC');
        const parser = braced(parser1);
        const result = parser('{ABC}');

        assertSuccess<'ABC'>(result, 'ABC', '');
    });

    it('should fail with uneven braces', () => {
        const parser1 = string('ABC');
        const parser = braced(parser1);
        const result = parser('{ABC');

        assertFailure<'ABC'>(result);
    });

    it('should handle empty braces', () => {
        const parser1 = string('');
        const parser = braced(parser1);
        const result = parser('{}');

        assertSuccess<''>(result, '', '');
    });
});
