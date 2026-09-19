import { describe, it } from 'vitest';

import { assertSuccess } from '../../test/utils';
import { position } from './position';

describe('position', () => {
    it('should return the current offset', () => {
        const result = position('hello');

        assertSuccess<number>(result, 0, 0);
    });

    it('should return 0 for empty input', () => {
        const result = position('');

        assertSuccess<number>(result, 0, 0);
    });
});
