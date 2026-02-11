import { describe, it } from 'vitest';
import { lowercase } from './lowercase';
import { LowerCaseLetter } from '../types';
import { assertResult } from '../../test/utils.test';

describe('lowercase', () => {
    it('should parse lowercase', () => {
        const result = lowercase('abc');

        assertResult<LowerCaseLetter>(result, ['a', 'bc']);
    });

    it('should fail on non-uppercase', () => {
        const result = lowercase('ABC');

        assertResult<unknown>(result);
    });
});
