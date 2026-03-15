import { describe, it } from 'vitest';

import { assertSuccess } from '../../test/utils.test';
import { rest } from './rest';

describe('rest', () => {
    it('should return all remaining input', () => {
        const result = rest('hello world');

        assertSuccess<string>(result, 'hello world', '');
    });

    it('should handle empty input', () => {
        const result = rest('');

        assertSuccess<string>(result, '', '');
    });
});
