import { describe, it } from 'vitest';

import {
    assertFailure,
    assertSuccess,
    createTestParser,
} from '../../test/utils';
import { braced } from './braced';

describe('braced', () => {
    it('should parse braced content', () => {
        const parser = braced(createTestParser('ABC'));
        const result = parser('{ABC}');

        assertSuccess<'ABC'>(result, 'ABC', '');
    });

    it('should fail with uneven braces', () => {
        const parser = braced(createTestParser('ABC'));
        const result = parser('{ABC');

        assertFailure<'ABC'>(result);
    });

    it('should leave remaining input', () => {
        const parser = braced(createTestParser('ABC'));
        const result = parser('{ABC}rest');

        assertSuccess<'ABC'>(result, 'ABC', 'rest');
    });

    it('should handle empty braces input', () => {
        const parser = braced(createTestParser(''));
        const result = parser('{}');

        assertSuccess<''>(result, '', '');
    });
});
