import { describe, it } from 'vitest';
import { uppercase } from './uppercase';
import { UpperCaseLetter } from '../types';
import { assertResult } from '../../test/utils.test';

describe('uppercase', () => {
    it('should parse uppercase', () => {
        const result = uppercase('ABC');

        assertResult<UpperCaseLetter>(result, ['A', 'BC']);
    });

    it('should fail on non-uppercase', () => {
        const result = uppercase('abc');

        assertResult<unknown>(result);
    });
});
