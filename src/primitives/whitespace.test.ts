import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { whitespace } from './whitespace';

describe('whitespace', () => {
    it('should parse whitespace', () => {
        const result = whitespace(' ');

        assertSuccess<string>(result, ' ', 1);
    });

    it('should parse only one whitespace', () => {
        const result = whitespace('   ');

        assertSuccess<string>(result, ' ', 1);
    });

    it('should fail on non-whitespace', () => {
        const result = whitespace('ABC');

        assertFailure<string>(result);
    });
});
