import { describe, it } from 'vitest';

import { assertSuccess } from '../../test/utils';
import { position } from './position';

describe('position', () => {
    it('should return current position (input length)', () => {
        const result = position('hello');

        assertSuccess<number>(result, 5, 'hello');
    });

    it('should return 0 for empty input', () => {
        const result = position('');

        assertSuccess<number>(result, 0, '');
    });
});
