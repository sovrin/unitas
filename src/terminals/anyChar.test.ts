import { describe, it } from 'vitest';
import { anyChar } from './anyChar';
import { assertResult } from '../../test/utils.test';

describe('anyChar', () => {
    it('should match any single character', () => {
        const result = anyChar('abc');

        assertResult<string>(result, ['a', 'bc']);
    });

    it('should match special characters', () => {
        const result = anyChar('@#$');

        assertResult<string>(result, ['@', '#$']);
    });

    it('should fail on empty input', () => {
        const result = anyChar('');

        assertResult<string>(result);
    });
});
