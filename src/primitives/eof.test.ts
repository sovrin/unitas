import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils';
import { eof } from './eof';

describe('eof', () => {
    it('should succeed on empty input', () => {
        const result = eof('');

        assertSuccess<null>(result, null, 0);
    });

    it('should fail on non-empty input', () => {
        const result = eof('abc');

        assertFailure<null>(result);
    });
});
