import { describe, it } from 'vitest';

import { assertResult } from '../../test/utils.test';
import type { UpperCaseLetter } from '../types';
import { uppercase } from './uppercase';

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
