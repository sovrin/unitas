import { describe, it } from 'vitest';

import type { UpperCaseLetter } from '../types';

import { assertFailure, assertSuccess } from '../../test/utils.test';
import { uppercase } from './uppercase';

describe('uppercase', () => {
    it('should parse uppercase', () => {
        const result = uppercase('ABC');

        assertSuccess<UpperCaseLetter>(result, 'A', 'BC');
    });

    it('should fail on non-uppercase', () => {
        const result = uppercase('abc');

        assertFailure<unknown>(result);
    });
});
