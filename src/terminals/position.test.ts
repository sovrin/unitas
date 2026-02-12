import { describe, it } from 'vitest';
import { position } from './position';
import { assertResult } from '../../test/utils.test';

describe('position', () => {
    it('should return current position (input length)', () => {
        const result = position('hello');

        assertResult<number>(result, [5, 'hello']);
    });

    it('should return 0 for empty input', () => {
        const result = position('');

        assertResult<number>(result, [0, '']);
    });
});
