import { describe, it } from 'vitest';

import { assertResult } from '../../test/utils.test';
import { rest } from './rest';

describe('rest', () => {
    it('should return all remaining input', () => {
        const result = rest('hello world');

        assertResult<string>(result, ['hello world', '']);
    });

    it('should handle empty input', () => {
        const result = rest('');

        assertResult<string>(result, ['', '']);
    });
});
