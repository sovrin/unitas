import { describe, it } from 'vitest';
import { eof } from './eof';
import { assertResult } from '../../test/utils.test';

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
