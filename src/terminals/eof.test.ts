import { describe, it } from 'vitest';

import { assertResult } from '../../test/utils.test';
import { eof } from './eof';

describe('eof', () => {
    it('should succeed on empty input', () => {
        const result = eof('');

        assertResult<null>(result, [null, '']);
    });

    it('should fail on non-empty input', () => {
        const result = eof('abc');

        assertResult<null>(result);
    });
});
