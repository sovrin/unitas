import { describe, it } from 'vitest';

import { assertFailure, assertSuccess } from '../../test/utils.test';
import { noneOf } from './noneOf';

describe('noneOf', () => {
    it('should match character not in forbidden set', () => {
        const parser = noneOf(['X', 'Y', 'Z']);
        const result = parser('ABC');

        assertSuccess<string>(result, 'A', 'BC');
    });

    it('should fail when character is in forbidden set', () => {
        const parser = noneOf(['X', 'Y', 'Z']);
        const result = parser('XYZ');

        assertFailure<string>(result);
    });

    it('should match any character when set is empty', () => {
        const parser = noneOf([]);
        const result = parser('ABC');

        assertSuccess<string>(result, 'A', 'BC');
    });
});
