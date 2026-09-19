import { describe, it } from 'vitest';

import { assertSuccess } from '../../test/utils';
import { success } from './success';

describe('success', () => {
    it('should create successful parse result', () => {
        const result = success('test', 4);

        assertSuccess<string>(result, 'test', 4);
    });
});
