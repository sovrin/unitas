import { describe, it } from 'vitest';

import type { LowerCaseLetter } from '../types';

import { assertResult } from '../../test/utils.test';
import { lowercase } from './lowercase';

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
