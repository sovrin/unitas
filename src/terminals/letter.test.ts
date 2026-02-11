import { describe, it } from 'vitest';
import { letter } from './letter';
import { assertResult } from '../../test/utils.test';
import { Letter } from '../types';

describe('letter', () => {
    it('should parse alphabetic characters', () => {
        const result = letter('A');

        assertResult<Letter>(result, ['A', '']);
    });

    it('should fail on non-letter characters', () => {
        const result = letter('123' as never);

        assertResult<unknown>(result);
    });

    it('should only parse first character', () => {
        const result = letter('hello' as never);

        assertResult<unknown>(result, ['h', 'ello']);
    });

    it('should match the expected type', () => {
        const result = letter('A');

        assertResult<Letter>(result, ['A', '']);
    });
});
