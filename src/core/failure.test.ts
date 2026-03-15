import { describe, it } from 'vitest';

import { assertFailure } from '../../test/utils.test';
import { failure } from './failure';

describe('failure', () => {
    it('should create failed parse result', () => {
        const result = failure();

        assertFailure(result);
    });
});
