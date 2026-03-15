import { describe, it } from 'vitest';

import { assertSuccess } from '../../test/utils.test';
import { success } from './success';

describe('success', () => {
    it('should create successful parse result', () => {
        const result = success('test', 'remaining');

        assertSuccess<string>(result, 'test', 'remaining');
    });
});
