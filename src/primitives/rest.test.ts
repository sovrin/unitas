import { describe, it } from 'vitest';

import { assertSuccess } from '../../test/utils';
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
